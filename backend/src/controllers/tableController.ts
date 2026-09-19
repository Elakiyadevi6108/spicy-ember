import { Request, Response } from 'express';
import { getDb } from '../db.js';

export async function getTables(req: Request, res: Response) {
  try {
    const db = await getDb();
    const tables = await db.all('SELECT * FROM tables ORDER BY table_number ASC');
    
    // Calculate current occupancy status based on today's active reservations
    const today = new Date().toISOString().split('T')[0];
    const activeReservations = await db.all(
      'SELECT table_id, status, time, customer_name FROM reservations WHERE date = ? AND status IN ("Confirmed", "Pending")',
      [today]
    );

    const resMap = new Map();
    activeReservations.forEach((r: any) => {
      resMap.set(r.table_id, r);
    });

    const mapped = tables.map((t: any) => {
      const activeRes = resMap.get(t.id);
      let dynamicStatus = t.status;
      if (t.status === 'Available' && activeRes) {
        dynamicStatus = 'Reserved';
      }
      return {
        id: t.id,
        tableNumber: t.table_number,
        capacity: t.capacity,
        location: t.location,
        status: dynamicStatus,
        currentReservation: activeRes ? { customerName: activeRes.customer_name, time: activeRes.time } : null
      };
    });

    return res.json(mapped);
  } catch (err: any) {
    console.error('Get tables error:', err);
    return res.status(500).json({ error: 'Failed to fetch tables' });
  }
}

export async function createTable(req: Request, res: Response) {
  try {
    const { tableNumber, capacity, location, status } = req.body;
    if (!tableNumber || !capacity || !location) {
      return res.status(400).json({ error: 'Table number, capacity, and location are required' });
    }

    const db = await getDb();
    const existing = await db.get('SELECT * FROM tables WHERE table_number = ?', [tableNumber]);
    if (existing) {
      return res.status(400).json({ error: `Table number ${tableNumber} already exists` });
    }

    const result = await db.run(
      'INSERT INTO tables (table_number, capacity, location, status) VALUES (?, ?, ?, ?)',
      [tableNumber, capacity, location, status || 'Available']
    );

    const newTable = await db.get('SELECT * FROM tables WHERE id = ?', [result.lastID]);
    return res.status(201).json({
      id: newTable.id,
      tableNumber: newTable.table_number,
      capacity: newTable.capacity,
      location: newTable.location,
      status: newTable.status
    });
  } catch (err: any) {
    console.error('Create table error:', err);
    return res.status(500).json({ error: 'Failed to create table' });
  }
}

export async function updateTable(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { tableNumber, capacity, location, status } = req.body;

    const db = await getDb();
    const existing = await db.get('SELECT * FROM tables WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Table not found' });
    }

    const updatedNumber = tableNumber || existing.table_number;
    const updatedCapacity = capacity || existing.capacity;
    const updatedLocation = location || existing.location;
    const updatedStatus = status || existing.status;

    await db.run(
      'UPDATE tables SET table_number = ?, capacity = ?, location = ?, status = ? WHERE id = ?',
      [updatedNumber, updatedCapacity, updatedLocation, updatedStatus, id]
    );

    const updated = await db.get('SELECT * FROM tables WHERE id = ?', [id]);
    return res.json({
      id: updated.id,
      tableNumber: updated.table_number,
      capacity: updated.capacity,
      location: updated.location,
      status: updated.status
    });
  } catch (err: any) {
    console.error('Update table error:', err);
    return res.status(500).json({ error: 'Failed to update table' });
  }
}

export async function deleteTable(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const db = await getDb();
    await db.run('DELETE FROM tables WHERE id = ?', [id]);
    return res.json({ message: 'Table deleted successfully' });
  } catch (err: any) {
    console.error('Delete table error:', err);
    return res.status(500).json({ error: 'Failed to delete table' });
  }
}
