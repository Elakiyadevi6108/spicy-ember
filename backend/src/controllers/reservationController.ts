import { Request, Response } from 'express';
import { getDb } from '../db.js';

export async function checkAvailability(req: Request, res: Response) {
  try {
    const { date, time, guests } = req.query;
    if (!date || !time || !guests) {
      return res.status(400).json({ error: 'Date, time, and guests parameters are required' });
    }

    const guestCount = parseInt(guests as string, 10);
    if (isNaN(guestCount) || guestCount < 1 || guestCount > 20) {
      return res.status(400).json({ error: 'Guest count must be between 1 and 20' });
    }

    const db = await getDb();

    // Get all tables capable of holding guestCount
    const tables = await db.all('SELECT * FROM tables WHERE status != "Maintenance" AND capacity >= ?', [guestCount]);
    
    // Get existing active reservations for this date and time slot
    const existingReservations = await db.all(
      'SELECT table_id FROM reservations WHERE date = ? AND time = ? AND status IN ("Pending", "Confirmed")',
      [date as string, time as string]
    );

    const bookedTableIds = new Set(existingReservations.map((r: any) => r.table_id));
    const availableTables = tables.filter((t: any) => !bookedTableIds.has(t.id));

    let availabilityStatus = 'Available';
    if (availableTables.length === 0) {
      availabilityStatus = 'Fully booked';
    } else if (availableTables.length <= 2) {
      availabilityStatus = 'Limited availability';
    }

    return res.json({
      available: availableTables.length > 0,
      statusText: availabilityStatus,
      availableTablesCount: availableTables.length,
      availableTables
    });
  } catch (err: any) {
    console.error('Check availability error:', err);
    return res.status(500).json({ error: 'Failed to check availability' });
  }
}

export async function createReservation(req: Request, res: Response) {
  try {
    const { customerName, email, phone, date, time, guests, seatingPreference, specialRequest } = req.body;

    // Validation
    if (!customerName || !email || !phone || !date || !time || !guests) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const guestCount = parseInt(guests, 10);
    if (isNaN(guestCount) || guestCount < 1 || guestCount > 20) {
      return res.status(400).json({ error: 'Guests count must be between 1 and 20' });
    }

    // Check date is not in the past
    const selectedDate = new Date(`${date}T${time.length === 5 ? time : '12:00'}`);
    const now = new Date();
    // Allow today's date
    const todayStr = new Date().toISOString().split('T')[0];
    if (date < todayStr) {
      return res.status(400).json({ error: 'Reservation date cannot be in the past' });
    }

    const db = await getDb();

    // Find available table matching capacity & seating preference if possible
    const suitableTables = await db.all(
      'SELECT * FROM tables WHERE capacity >= ? AND status != "Maintenance" ORDER BY capacity ASC',
      [guestCount]
    );

    const existingBookings = await db.all(
      'SELECT table_id FROM reservations WHERE date = ? AND time = ? AND status IN ("Pending", "Confirmed")',
      [date, time]
    );

    const bookedTableIds = new Set(existingBookings.map((r: any) => r.table_id));
    const freeTables = suitableTables.filter((t: any) => !bookedTableIds.has(t.id));

    if (freeTables.length === 0) {
      return res.status(400).json({ error: 'Sorry, no tables are available for the selected date, time, and party size.' });
    }

    // Pick table matching preference if available, else pick first available
    let assignedTable = freeTables.find((t: any) => t.location === seatingPreference) || freeTables[0];

    // Generate unique reservation ID: SE-XXXXX
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const reservationId = `SE-${randomNum}`;

    const result = await db.run(
      `INSERT INTO reservations 
       (reservation_id, customer_name, email, phone, date, time, guests, seating_preference, special_request, status, table_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Confirmed', ?)`,
      [reservationId, customerName.trim(), email.trim(), phone.trim(), date, time, guestCount, seatingPreference || 'Indoor', specialRequest || '', assignedTable.id]
    );

    const newReservation = await db.get('SELECT * FROM reservations WHERE id = ?', [result.lastID]);

    return res.status(201).json({
      message: 'Reservation confirmed successfully',
      reservation: {
        id: newReservation.id,
        reservationId: newReservation.reservation_id,
        customerName: newReservation.customer_name,
        email: newReservation.email,
        phone: newReservation.phone,
        date: newReservation.date,
        time: newReservation.time,
        guests: newReservation.guests,
        seatingPreference: newReservation.seating_preference,
        specialRequest: newReservation.special_request,
        status: newReservation.status,
        tableId: newReservation.table_id,
        tableNumber: assignedTable.table_number,
        createdAt: newReservation.created_at
      }
    });
  } catch (err: any) {
    console.error('Create reservation error:', err);
    return res.status(500).json({ error: 'Failed to create reservation' });
  }
}

export async function getReservations(req: Request, res: Response) {
  try {
    const { email, date, status, search } = req.query;
    const db = await getDb();

    let query = `
      SELECT r.*, t.table_number, t.location as table_location 
      FROM reservations r 
      LEFT JOIN tables t ON r.table_id = t.id 
      WHERE 1=1
    `;
    const params: any[] = [];

    if (email) {
      query += ' AND LOWER(r.email) = LOWER(?)';
      params.push(email);
    }
    if (date) {
      query += ' AND r.date = ?';
      params.push(date);
    }
    if (status) {
      query += ' AND r.status = ?';
      params.push(status);
    }
    if (search) {
      query += ' AND (r.reservation_id LIKE ? OR r.customer_name LIKE ? OR r.phone LIKE ? OR r.email LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    query += ' ORDER BY r.date DESC, r.time DESC';

    const rows = await db.all(query, params);

    const mapped = rows.map((r: any) => ({
      id: r.id,
      reservationId: r.reservation_id,
      customerName: r.customer_name,
      email: r.email,
      phone: r.phone,
      date: r.date,
      time: r.time,
      guests: r.guests,
      seatingPreference: r.seating_preference,
      specialRequest: r.special_request,
      status: r.status,
      tableId: r.table_id,
      tableNumber: r.table_number,
      createdAt: r.created_at
    }));

    return res.json(mapped);
  } catch (err: any) {
    console.error('Get reservations error:', err);
    return res.status(500).json({ error: 'Failed to fetch reservations' });
  }
}

export async function getReservationById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const db = await getDb();

    const r = await db.get(
      `SELECT r.*, t.table_number 
       FROM reservations r 
       LEFT JOIN tables t ON r.table_id = t.id 
       WHERE r.id = ? OR r.reservation_id = ?`,
      [id, id]
    );

    if (!r) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    return res.json({
      id: r.id,
      reservationId: r.reservation_id,
      customerName: r.customer_name,
      email: r.email,
      phone: r.phone,
      date: r.date,
      time: r.time,
      guests: r.guests,
      seatingPreference: r.seating_preference,
      specialRequest: r.special_request,
      status: r.status,
      tableId: r.table_id,
      tableNumber: r.table_number,
      createdAt: r.created_at
    });
  } catch (err: any) {
    console.error('Get reservation by ID error:', err);
    return res.status(500).json({ error: 'Failed to fetch reservation' });
  }
}

export async function updateReservation(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status, date, time, guests, seatingPreference, specialRequest, tableId } = req.body;

    const db = await getDb();
    const existing = await db.get('SELECT * FROM reservations WHERE id = ? OR reservation_id = ?', [id, id]);
    if (!existing) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    const updatedStatus = status || existing.status;
    const updatedDate = date || existing.date;
    const updatedTime = time || existing.time;
    const updatedGuests = guests !== undefined ? parseInt(guests, 10) : existing.guests;
    const updatedPref = seatingPreference || existing.seating_preference;
    const updatedReq = specialRequest !== undefined ? specialRequest : existing.special_request;
    const updatedTableId = tableId !== undefined ? tableId : existing.table_id;

    await db.run(
      `UPDATE reservations 
       SET status = ?, date = ?, time = ?, guests = ?, seating_preference = ?, special_request = ?, table_id = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? OR reservation_id = ?`,
      [updatedStatus, updatedDate, updatedTime, updatedGuests, updatedPref, updatedReq, updatedTableId, id, id]
    );

    const updated = await db.get('SELECT r.*, t.table_number FROM reservations r LEFT JOIN tables t ON r.table_id = t.id WHERE r.id = ?', [existing.id]);

    return res.json({
      message: 'Reservation updated successfully',
      reservation: {
        id: updated.id,
        reservationId: updated.reservation_id,
        customerName: updated.customer_name,
        email: updated.email,
        phone: updated.phone,
        date: updated.date,
        time: updated.time,
        guests: updated.guests,
        seatingPreference: updated.seating_preference,
        specialRequest: updated.special_request,
        status: updated.status,
        tableId: updated.table_id,
        tableNumber: updated.table_number,
        updatedAt: updated.updated_at
      }
    });
  } catch (err: any) {
    console.error('Update reservation error:', err);
    return res.status(500).json({ error: 'Failed to update reservation' });
  }
}

export async function deleteReservation(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const db = await getDb();

    const existing = await db.get('SELECT * FROM reservations WHERE id = ? OR reservation_id = ?', [id, id]);
    if (!existing) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    await db.run('UPDATE reservations SET status = "Cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?', [existing.id]);

    return res.json({ message: 'Reservation cancelled successfully', reservationId: existing.reservation_id });
  } catch (err: any) {
    console.error('Delete reservation error:', err);
    return res.status(500).json({ error: 'Failed to cancel reservation' });
  }
}
