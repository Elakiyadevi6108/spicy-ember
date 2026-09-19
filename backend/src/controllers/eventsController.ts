import { Request, Response } from 'express';
import { getDb } from '../db.js';

export async function getEvents(req: Request, res: Response) {
  try {
    const db = await getDb();
    const events = await db.all('SELECT * FROM events ORDER BY id ASC');
    const mapped = events.map((e: any) => ({
      id: e.id,
      title: e.title,
      date: e.date,
      time: e.time,
      description: e.description,
      imageUrl: e.image_url
    }));
    return res.json(mapped);
  } catch (err: any) {
    console.error('Get events error:', err);
    return res.status(500).json({ error: 'Failed to fetch events' });
  }
}
