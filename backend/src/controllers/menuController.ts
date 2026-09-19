import { Request, Response } from 'express';
import { getDb } from '../db.js';

export async function getMenuItems(req: Request, res: Response) {
  try {
    const { category, search, veg } = req.query;
    const db = await getDb();

    let query = 'SELECT * FROM menu_items WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }
    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s);
    }
    if (veg !== undefined && veg !== '') {
      query += ' AND is_veg = ?';
      params.push(veg === 'true' || veg === '1' ? 1 : 0);
    }

    const items = await db.all(query, params);
    const mapped = items.map((i: any) => ({
      id: i.id,
      name: i.name,
      description: i.description,
      price: i.price,
      category: i.category,
      isVeg: Boolean(i.is_veg),
      isPopular: Boolean(i.is_popular),
      imageUrl: i.image_url
    }));

    return res.json(mapped);
  } catch (err: any) {
    console.error('Get menu error:', err);
    return res.status(500).json({ error: 'Failed to fetch menu items' });
  }
}
