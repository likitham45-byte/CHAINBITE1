<<<<<<< HEAD
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import { OrderStatus, Order, Restaurant } from './src/types';
import { restaurants } from './src/data';

const PORT = 3000;
=======
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("chainbite.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    wallet_address TEXT UNIQUE,
    email TEXT UNIQUE,
    name TEXT,
    role TEXT DEFAULT 'user',
    kyc_status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    cuisine TEXT,
    rating REAL,
    delivery_time TEXT,
    price_range TEXT,
    image_url TEXT,
    is_verified INTEGER DEFAULT 0,
    hygiene_score TEXT
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id INTEGER,
    name TEXT,
    description TEXT,
    price_fiat REAL,
    category TEXT,
    image_url TEXT,
    provenance_info TEXT,
    FOREIGN KEY(restaurant_id) REFERENCES restaurants(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    restaurant_id INTEGER,
    status TEXT DEFAULT 'placed',
    total_fiat REAL,
    payment_method TEXT,
    delivery_lat REAL,
    delivery_lng REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(restaurant_id) REFERENCES restaurants(id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    user_id INTEGER,
    restaurant_id INTEGER,
    rating INTEGER,
    comment TEXT,
    on_chain_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// Seed Data if empty or incomplete
const restaurantCount = db.prepare("SELECT COUNT(*) as count FROM restaurants").get() as { count: number };
const menuCount = db.prepare("SELECT COUNT(*) as count FROM menu_items").get() as { count: number };

if (restaurantCount.count === 0 || menuCount.count < 600) {
  console.log("Database incomplete. Re-seeding...");
  db.exec(`
    DELETE FROM menu_items;
    DELETE FROM restaurants;
  `);
  
  const insertRestaurant = db.prepare(`
    INSERT INTO restaurants (name, cuisine, rating, delivery_time, price_range, image_url, is_verified, hygiene_score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const indianRestaurants = [
    ["Royal Biryani House", "Biryani, North Indian", 4.8, "30-40 min", "$$", "https://picsum.photos/seed/biryani-pot/800/600", 1, "A+"],
    ["South Indian Delights", "South Indian", 4.5, "20-30 min", "$", "https://picsum.photos/seed/dosa-plate/800/600", 1, "A"],
    ["Tandoori Nights", "North Indian, Mughlai", 4.7, "35-45 min", "$$$", "https://picsum.photos/seed/tandoori-chicken/800/600", 1, "A+"],
    ["The Curry Leaf", "South Indian, Kerala", 4.6, "25-35 min", "$$", "https://picsum.photos/seed/kerala-curry/800/600", 1, "A"],
    ["Punjab Grill", "North Indian, Punjabi", 4.9, "40-50 min", "$$$", "https://picsum.photos/seed/punjabi-thali/800/600", 1, "A+"],
    ["Dosa Plaza", "South Indian, Fast Food", 4.2, "15-25 min", "$", "https://picsum.photos/seed/idli-vada/800/600", 1, "B+"],
    ["Mughal Darbar", "Mughlai, North Indian", 4.4, "30-40 min", "$$", "https://picsum.photos/seed/mutton-kebab/800/600", 1, "A"],
    ["Chai Point", "Beverages, Snacks", 4.3, "10-20 min", "$", "https://picsum.photos/seed/masala-chai/800/600", 1, "A+"],
    ["Haldiram's", "Sweets, North Indian", 4.7, "20-30 min", "$$", "https://picsum.photos/seed/indian-sweets/800/600", 1, "A+"],
    ["Bikanervala", "Sweets, Fast Food", 4.5, "25-35 min", "$$", "https://picsum.photos/seed/chaat-food/800/600", 1, "A"],
    ["Paradise Biryani", "Biryani, Hyderabadi", 4.8, "35-45 min", "$$", "https://picsum.photos/seed/hyderabad-biryani/800/600", 1, "A+"],
    ["Sagar Ratna", "South Indian", 4.6, "20-30 min", "$$", "https://picsum.photos/seed/south-indian-thali/800/600", 1, "A"],
    ["Karim's", "Mughlai, North Indian", 4.7, "40-50 min", "$$$", "https://picsum.photos/seed/nihari-stew/800/600", 1, "A"],
    ["Wow! Momo", "Chinese, Fast Food", 4.1, "15-25 min", "$", "https://picsum.photos/seed/steamed-momo/800/600", 1, "B"],
    ["The Great Kabab Factory", "North Indian, Mughlai", 4.8, "45-55 min", "$$$", "https://picsum.photos/seed/seekh-kebab/800/600", 1, "A+"],
    ["Saravana Bhavan", "South Indian", 4.5, "25-35 min", "$$", "https://picsum.photos/seed/mini-tiffin/800/600", 1, "A"],
    ["Social", "Continental, Finger Food", 4.6, "30-40 min", "$$$", "https://picsum.photos/seed/cocktail-snacks/800/600", 1, "A"],
    ["Farzi Cafe", "Modern Indian", 4.7, "35-45 min", "$$$", "https://picsum.photos/seed/fusion-food/800/600", 1, "A+"],
    ["Barbeque Nation", "North Indian, BBQ", 4.8, "45-60 min", "$$$", "https://picsum.photos/seed/grill-platter/800/600", 1, "A+"],
    ["Chowman", "Chinese", 4.4, "25-35 min", "$$", "https://picsum.photos/seed/manchurian-noodles/800/600", 1, "A"]
  ];

  indianRestaurants.forEach(r => insertRestaurant.run(...r));

  const restaurants = db.prepare("SELECT id, cuisine FROM restaurants").all() as { id: number, cuisine: string }[];
  const insertMenuItem = db.prepare(`
    INSERT INTO menu_items (restaurant_id, name, description, price_fiat, category, image_url, provenance_info)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const starters = [
    ["Paneer Tikka", "Spiced cottage cheese cubes grilled to perfection.", 250, "Starter", "paneer-tikka"],
    ["Chicken 65", "Spicy, deep-fried chicken pieces from South India.", 320, "Starter", "chicken-65"],
    ["Hara Bhara Kabab", "Healthy spinach and pea patties.", 220, "Starter", "hara-bhara"],
    ["Fish Amritsari", "Crispy batter-fried fish with carom seeds.", 380, "Starter", "fish-fry"],
    ["Veg Samosa (2pcs)", "Classic crispy pastry with potato filling.", 80, "Starter", "samosa-dish"],
    ["Onion Bhaji", "Crispy onion fritters with gram flour.", 120, "Starter", "onion-bhaji"],
    ["Gobi Manchurian", "Crispy cauliflower florets in tangy sauce.", 180, "Starter", "gobi-manchurian"]
  ];

  const mains = [
    ["Butter Chicken", "Rich and creamy tomato-based chicken curry.", 450, "Main", "butter-chicken-dish"],
    ["Dal Makhani", "Slow-cooked black lentils with butter and cream.", 280, "Main", "dal-makhani-dish"],
    ["Chicken Dum Biryani", "Fragrant basmati rice cooked with tender chicken.", 350, "Main", "biryani-dish"],
    ["Paneer Butter Masala", "Cottage cheese in a smooth tomato gravy.", 320, "Main", "paneer-butter"],
    ["Mutton Rogan Josh", "Kashmiri style slow-cooked lamb curry.", 550, "Main", "rogan-josh"],
    ["Malai Kofta", "Potato and paneer balls in a nutty gravy.", 340, "Main", "malai-kofta"],
    ["Veg Kolhapuri", "Spicy mixed vegetable curry from Maharashtra.", 260, "Main", "veg-kolhapuri"],
    ["Palak Paneer", "Cottage cheese in a healthy spinach gravy.", 300, "Main", "palak-paneer"],
    ["Chana Masala", "Spicy chickpeas cooked with ginger and spices.", 220, "Main", "chana-masala"]
  ];

  const breads = [
    ["Garlic Naan", "Soft clay-oven bread with garlic and butter.", 60, "Bread", "garlic-naan-dish"],
    ["Butter Roti", "Whole wheat flatbread with butter.", 30, "Bread", "roti-dish"],
    ["Lacha Paratha", "Multi-layered flaky whole wheat bread.", 50, "Bread", "paratha-dish"],
    ["Tandoori Roti", "Clay oven baked whole wheat bread.", 25, "Bread", "tandoori-roti"],
    ["Missi Roti", "Gram flour and wheat bread with spices.", 45, "Bread", "missi-roti"]
  ];

  const desserts = [
    ["Gulab Jamun (2pcs)", "Deep-fried milk solids in sugar syrup.", 100, "Dessert", "gulab-jamun-dish"],
    ["Rasmalai (2pcs)", "Soft paneer discs in saffron milk.", 120, "Dessert", "rasmalai-dish"],
    ["Gajar Ka Halwa", "Warm carrot pudding with nuts and khoya.", 150, "Dessert", "carrot-halwa"],
    ["Kulfi", "Traditional Indian frozen dessert.", 80, "Dessert", "kulfi-ice"],
    ["Jalebi (100g)", "Crispy fried swirls soaked in syrup.", 90, "Dessert", "jalebi-sweet"]
  ];

  const beverages = [
    ["Mango Lassi", "Creamy yogurt drink with mango pulp.", 120, "Beverage", "mango-lassi-dish"],
    ["Masala Chai", "Traditional Indian spiced milk tea.", 40, "Beverage", "masala-chai-dish"],
    ["Fresh Lime Soda", "Refreshing lemon drink with salt or sugar.", 80, "Beverage", "lime-soda"],
    ["Sweet Lassi", "Traditional sweetened yogurt drink.", 100, "Beverage", "sweet-lassi"],
    ["Jal Jeera", "Tangy and spicy cumin-based drink.", 60, "Beverage", "jal-jeera"]
  ];

  restaurants.forEach(r => {
    const allItems = [...starters, ...mains, ...breads, ...desserts, ...beverages];
    allItems.forEach((item, idx) => {
      // Use unique seed for each item per restaurant to ensure variety
      const uniqueSeed = `${item[4]}-${r.id}-${idx}`;
      insertMenuItem.run(
        r.id, 
        item[0], 
        item[1], 
        item[2], 
        item[3], 
        `https://picsum.photos/seed/${uniqueSeed}/400/300`, 
        "Sourced from local Indian markets."
      );
    });
  });
}
>>>>>>> 1ba813d9bbd7f8ddd70b7c10c23c0c70e64a64a6

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
<<<<<<< HEAD
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  app.use(cors());
  app.use(express.json());

  let orders: Order[] = [];

  // API Routes
  app.get('/api/restaurants', (req, res) => {
    res.json(restaurants);
  });

  app.get('/api/restaurants/:id', (req, res) => {
    const restaurant = restaurants.find((r) => r.id === req.params.id);
    if (restaurant) res.json(restaurant);
    else res.status(404).send('Restaurant not found');
  });

  app.get('/api/orders/:userId', (req, res) => {
    const userOrders = orders.filter((o) => o.userId === req.params.userId);
    res.json(userOrders);
  });

  app.post('/api/orders', (req, res) => {
    const newOrder: Order = {
      ...req.body,
      id: Math.random().toString(36).substring(7).toUpperCase(),
      status: OrderStatus.PLACED,
      createdAt: Date.now(),
    };
    orders.push(newOrder);
    io.emit('order_update', newOrder);

    // Automation: Progress order through stages after specific intervals
    setTimeout(() => {
      const order = orders.find(o => o.id === newOrder.id);
      if (order && order.status === OrderStatus.PLACED) {
        order.status = OrderStatus.COOKING;
        io.emit('order_update', order);
      }
    }, 10000); // 10 seconds to Cooking

    setTimeout(() => {
      const order = orders.find(o => o.id === newOrder.id);
      if (order && order.status === OrderStatus.COOKING) {
        order.status = OrderStatus.OUT_FOR_DELIVERY;
        io.emit('order_update', order);
      }
    }, 25000); // 25 seconds total to Transit

    res.json(newOrder);
  });

  app.patch('/api/orders/:id/status', (req, res) => {
    const { status } = req.body;
    const orderIndex = orders.findIndex((o) => o.id === req.params.id);
    if (orderIndex > -1) {
      orders[orderIndex].status = status;
      io.emit('order_update', orders[orderIndex]);
      res.json(orders[orderIndex]);
    } else {
      res.status(404).send('Order not found');
    }
  });

  // AI Recommendation (Mock/Proxy for Gemini if needed on server, but guidelines say call from frontend)
  // I'll implement the actual call in the frontend as per guidelines.
  
  // Socket.IO
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
=======
  const io = new Server(httpServer);
  const PORT = 3000;

  app.use(express.json());

  // Health check (no DB)
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server is running" });
  });

  // API Routes
  app.get("/api/restaurants", (req, res) => {
    console.log("GET /api/restaurants requested");
    try {
      const restaurants = db.prepare("SELECT * FROM restaurants").all();
      console.log(`Returning ${restaurants.length} restaurants`);
      res.json(restaurants);
    } catch (error) {
      console.error("DB Error in GET /api/restaurants:", error);
      res.status(500).json({ error: "Database error" });
    }
  });

  app.get("/api/restaurants/:id", (req, res) => {
    console.log(`GET /api/restaurants/${req.params.id} requested`);
    try {
      const restaurant = db.prepare("SELECT * FROM restaurants WHERE id = ?").get(req.params.id) as any;
      if (!restaurant) {
        console.log(`Restaurant ${req.params.id} not found`);
        return res.status(404).json({ error: "Restaurant not found" });
      }
      const menu = db.prepare("SELECT * FROM menu_items WHERE restaurant_id = ?").all(req.params.id);
      console.log(`Returning restaurant ${restaurant.name} with ${menu.length} items`);
      res.json({ ...restaurant, menu });
    } catch (error) {
      console.error(`DB Error in GET /api/restaurants/${req.params.id}:`, error);
      res.status(500).json({ error: "Database error" });
    }
  });

  app.post("/api/orders", (req, res) => {
    const { user_id, restaurant_id, total_fiat, payment_method } = req.body;
    const info = db.prepare(`
      INSERT INTO orders (user_id, restaurant_id, total_fiat, payment_method, status)
      VALUES (?, ?, ?, ?, 'placed')
    `).run(user_id || 1, restaurant_id, total_fiat, payment_method);
    
    const orderId = info.lastInsertRowid;
    io.emit("order_update", { orderId, status: "placed" });
    res.json({ orderId });
  });

  app.get("/api/orders/user/:userId", (req, res) => {
    const orders = db.prepare(`
      SELECT o.*, r.name as restaurant_name 
      FROM orders o 
      JOIN restaurants r ON o.restaurant_id = r.id 
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `).all(req.params.userId);
    res.json(orders);
  });

  // WebSocket logic
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    
    socket.on("track_order", (orderId) => {
      // Simulate real-time updates
      let step = 0;
      const statuses = ["placed", "preparing", "picked_up", "delivered"];
      const interval = setInterval(() => {
        if (step < statuses.length) {
          const status = statuses[step];
          db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, orderId);
          io.emit(`order_status_${orderId}`, { 
            status, 
            lat: 40.7128 + (Math.random() - 0.5) * 0.01, 
            lng: -74.0060 + (Math.random() - 0.5) * 0.01,
            timestamp: new Date().toISOString()
          });
          step++;
        } else {
          clearInterval(interval);
        }
      }, 5000);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
>>>>>>> 1ba813d9bbd7f8ddd70b7c10c23c0c70e64a64a6
    });
  });

  // Vite middleware for development
<<<<<<< HEAD
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
=======
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist/index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`>>> ChainBite Server started successfully!`);
    console.log(`>>> Listening on http://0.0.0.0:${PORT}`);
    console.log(`>>> NODE_ENV: ${process.env.NODE_ENV}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
>>>>>>> 1ba813d9bbd7f8ddd70b7c10c23c0c70e64a64a6
