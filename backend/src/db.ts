import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

let dbInstance: Database | null = null;

export async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance;

  const dbPath = path.join(process.cwd(), 'spice_and_ember.db');
  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await initSchema(dbInstance);
  return dbInstance;
}

async function initSchema(db: Database) {
  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      table_number INTEGER UNIQUE NOT NULL,
      capacity INTEGER NOT NULL,
      location TEXT NOT NULL, -- Indoor, Outdoor, Window, Private Dining
      status TEXT NOT NULL DEFAULT 'Available' -- Available, Reserved, Occupied, Maintenance
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reservation_id TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      date TEXT NOT NULL, -- YYYY-MM-DD
      time TEXT NOT NULL, -- e.g. 19:00
      guests INTEGER NOT NULL,
      seating_preference TEXT NOT NULL,
      special_request TEXT,
      status TEXT NOT NULL DEFAULT 'Confirmed', -- Pending, Confirmed, Cancelled, Completed, No Show
      table_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (table_id) REFERENCES tables(id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer', -- admin, customer
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      is_veg INTEGER NOT NULL DEFAULT 1,
      is_popular INTEGER NOT NULL DEFAULT 0,
      image_url TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT NOT NULL
    );
  `);

  // Seed default tables if empty
  const tableCount = await db.get('SELECT COUNT(*) as count FROM tables');
  if (tableCount.count === 0) {
    const defaultTables = [
      { number: 1, capacity: 2, location: 'Indoor', status: 'Available' },
      { number: 2, capacity: 2, location: 'Window', status: 'Available' },
      { number: 3, capacity: 4, location: 'Indoor', status: 'Available' },
      { number: 4, capacity: 4, location: 'Outdoor', status: 'Available' },
      { number: 5, capacity: 6, location: 'Indoor', status: 'Available' },
      { number: 6, capacity: 8, location: 'Private Dining', status: 'Available' },
      { number: 7, capacity: 2, location: 'Outdoor', status: 'Available' },
      { number: 8, capacity: 4, location: 'Window', status: 'Available' },
      { number: 9, capacity: 4, location: 'Indoor', status: 'Available' },
      { number: 10, capacity: 6, location: 'Outdoor', status: 'Available' },
      { number: 11, capacity: 10, location: 'Private Dining', status: 'Available' },
      { number: 12, capacity: 2, location: 'Indoor', status: 'Available' }
    ];

    for (const t of defaultTables) {
      await db.run(
        'INSERT INTO tables (table_number, capacity, location, status) VALUES (?, ?, ?, ?)',
        [t.number, t.capacity, t.location, t.status]
      );
    }
  }

  // Seed default menu items if empty
  const menuCount = await db.get('SELECT COUNT(*) as count FROM menu_items');
  if (menuCount.count === 0) {
    const defaultMenu = [
      // Starters
      { name: 'Crispy Paneer', description: 'Cottage cheese cubes tossed in spicy aromatic herbs and crisp peppers.', price: 340, category: 'Starters', is_veg: 1, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=600&q=80' },
      { name: 'Chicken 65', description: 'Deep fried spicy chicken chunks tempered with curry leaves and red chili.', price: 420, category: 'Starters', is_veg: 0, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80' },
      { name: 'Garlic Prawns', description: 'Jumbo prawns pan-seared with crushed garlic, green chili butter, and coriander.', price: 580, category: 'Starters', is_veg: 0, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1559742811-822863646df8?auto=format&fit=crop&w=600&q=80' },
      { name: 'Vegetable Spring Rolls', description: 'Crispy golden pastry filled with seasoned julienned veggies and glass noodles.', price: 290, category: 'Starters', is_veg: 1, is_popular: 0, image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80' },
      
      // Soups
      { name: 'Charred Tomato & Basil Soup', description: 'Roasted plum tomatoes pureed with fresh basil and garlic olive oil croutons.', price: 220, category: 'Soups', is_veg: 1, is_popular: 0, image_url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80' },
      { name: 'Spicy Chicken Lemon Coriander', description: 'Zesty clear soup loaded with shredded tender chicken and cilantro infusion.', price: 260, category: 'Soups', is_veg: 0, is_popular: 0, image_url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=600&q=80' },

      // Main Course
      { name: 'Butter Chicken', description: 'Succulent chicken tikka simmered in rich velvety cashew tomato gravy.', price: 490, category: 'Main Course', is_veg: 0, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=600&q=80' },
      { name: 'Paneer Tikka Masala', description: 'Char-broiled paneer cubes cooked in a fragrant spiced onion-tomato reduction.', price: 430, category: 'Main Course', is_veg: 1, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80' },
      { name: 'Chicken Biryani', description: 'Long-grain basmati rice layered with spiced marinated chicken and aromatics.', price: 480, category: 'Main Course', is_veg: 0, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80' },
      { name: 'Vegetable Biryani', description: 'Fragrant basmati rice slow-cooked dum style with seasonal vegetables & mint.', price: 380, category: 'Main Course', is_veg: 1, is_popular: 0, image_url: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=600&q=80' },
      { name: 'Grilled Fish with Herb Butter', description: 'Pan-seared sea bass filet served with lemon-garlic butter sauce and mashed potatoes.', price: 620, category: 'Main Course', is_veg: 0, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80' },

      // Indian Specials
      { name: 'Dal Makhani', description: 'Slow-cooked black lentils simmered overnight with butter, cream and whole spices.', price: 360, category: 'Indian Specials', is_veg: 1, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80' },
      { name: 'Kadhai Lamb Raan', description: 'Tender mutton pieces tossed in coarse pounded coriander, cumin and bell peppers.', price: 650, category: 'Indian Specials', is_veg: 0, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80' },

      // Continental
      { name: 'Truffle Mushroom Pasta', description: 'Fettuccine tossed in white wine cream sauce with wild mushrooms and truffle oil.', price: 490, category: 'Continental', is_veg: 1, is_popular: 0, image_url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6288764?auto=format&fit=crop&w=600&q=80' },
      { name: 'Wood-fired Pepperoni Pizza', description: 'Hand-stretched dough topped with smoky tomato ragu, mozzarella and spicy pepperoni.', price: 540, category: 'Continental', is_veg: 0, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80' },

      // Desserts
      { name: 'Gulab Jamun with Rabri', description: 'Hot saffron milk dumplings served over thick cardamom infused condensed milk.', price: 240, category: 'Desserts', is_veg: 1, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80' },
      { name: 'Chocolate Lava Cake', description: 'Warm dark chocolate cake with a molten chocolate core, served with vanilla ice cream.', price: 290, category: 'Desserts', is_veg: 1, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80' },
      { name: 'New York Cheesecake', description: 'Classic dense baked cheesecake topped with fresh wild berry compote.', price: 320, category: 'Desserts', is_veg: 1, is_popular: 0, image_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80' },

      // Beverages
      { name: 'Fresh Lime Soda', description: 'Sweet or salted sparkling citrus refresher with fresh mint leaves.', price: 140, category: 'Beverages', is_veg: 1, is_popular: 0, image_url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80' },
      { name: 'Mango Lassi', description: 'Thick chilled yogurt drink blended with sweet Alphonso mango pulp and saffron.', price: 180, category: 'Beverages', is_veg: 1, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=600&q=80' },
      { name: 'Cold Coffee with Ice Cream', description: 'Double espresso blended with ice cold milk, topped with a scoop of chocolate gelée.', price: 210, category: 'Beverages', is_veg: 1, is_popular: 1, image_url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80' },
      { name: 'Fresh Fruit Juice', description: 'Pressed seasonal watermelon, orange, or pineapple juice.', price: 160, category: 'Beverages', is_veg: 1, is_popular: 0, image_url: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80' }
    ];

    for (const item of defaultMenu) {
      await db.run(
        'INSERT INTO menu_items (name, description, price, category, is_veg, is_popular, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [item.name, item.description, item.price, item.category, item.is_veg, item.is_popular, item.image_url]
      );
    }
  }

  // Seed default events if empty
  const eventsCount = await db.get('SELECT COUNT(*) as count FROM events');
  if (eventsCount.count === 0) {
    const defaultEvents = [
      {
        title: 'Weekend Live Music Night',
        date: 'Every Friday & Saturday',
        time: '07:30 PM - 10:30 PM',
        description: 'Immerse yourself in acoustic jazz & classical fusion while enjoying our signature cocktails and tandoori grills.',
        image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Family Dinner Night',
        date: 'Every Sunday',
        time: '06:30 PM - 10:30 PM',
        description: 'Complimentary dessert platter and custom kids menu for family bookings of 4 or more guests.',
        image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: "Chef's Special Tasting Evening",
        date: 'Last Wednesday of the Month',
        time: '07:00 PM - 10:00 PM',
        description: 'An exclusive 7-course culinary journey curated by Executive Chef Vikram Roy paired with fine mocktails & wines.',
        image_url: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Private Dining Experience',
        date: 'Available on Booking',
        time: 'Custom Slots',
        description: 'Reserve our luxury private dining suite with dedicated butler service and customized menu curation.',
        image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'
      }
    ];

    for (const ev of defaultEvents) {
      await db.run(
        'INSERT INTO events (title, date, time, description, image_url) VALUES (?, ?, ?, ?, ?)',
        [ev.title, ev.date, ev.time, ev.description, ev.image_url]
      );
    }
  }

  // Seed admin user and demo reservations if empty
  const userCount = await db.get('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    // Password for admin is 'admin123' (stored as simple hash for demo simplicity)
    await db.run(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      ['Admin', 'admin@spiceandember.com', 'admin123', 'admin']
    );
    await db.run(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      ['Rohan Sharma', 'rohan@example.com', 'user123', 'customer']
    );
  }

  const resCount = await db.get('SELECT COUNT(*) as count FROM reservations');
  if (resCount.count === 0) {
    const today = new Date().toISOString().split('T')[0];
    const demoRes = [
      {
        reservation_id: 'SE-91823',
        customer_name: 'Ananya Verma',
        email: 'ananya@example.com',
        phone: '+91 98765 43210',
        date: today,
        time: '19:30',
        guests: 4,
        seating_preference: 'Indoor',
        special_request: 'Anniversary celebration, need a quiet corner table.',
        status: 'Confirmed',
        table_id: 3
      },
      {
        reservation_id: 'SE-91824',
        customer_name: 'Rajesh Kumar',
        email: 'rajesh@example.com',
        phone: '+91 98123 45678',
        date: today,
        time: '20:00',
        guests: 2,
        seating_preference: 'Window',
        special_request: '',
        status: 'Confirmed',
        table_id: 2
      },
      {
        reservation_id: 'SE-91825',
        customer_name: 'Priya Sundaram',
        email: 'priya@example.com',
        phone: '+91 97654 32109',
        date: today,
        time: '13:00',
        guests: 6,
        seating_preference: 'Private Dining',
        special_request: 'High chair needed for child.',
        status: 'Completed',
        table_id: 6
      }
    ];

    for (const r of demoRes) {
      await db.run(
        `INSERT INTO reservations 
         (reservation_id, customer_name, email, phone, date, time, guests, seating_preference, special_request, status, table_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [r.reservation_id, r.customer_name, r.email, r.phone, r.date, r.time, r.guests, r.seating_preference, r.special_request, r.status, r.table_id]
      );
    }
  }
}
