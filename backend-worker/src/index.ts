import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// Enable CORS for frontend SPA
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Health Check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', engine: 'Cloudflare Workers + D1', timestamp: new Date().toISOString() });
});

// GET /api/products — Fetch published products from D1 Database
app.get('/api/products', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM products WHERE is_published = 1 ORDER BY display_order ASC, name ASC"
    ).all();

    const formatted = (results || []).map((p: any) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      subtitle: p.subtitle,
      price: Number(p.price),
      originalPrice: p.original_price ? Number(p.original_price) : null,
      image: p.image,
      hoverImage: p.hover_image,
      badge: p.badge,
      soldOut: (p.inventory_count || 0) <= 0,
      description: p.description,
      sizes: p.sizes_json ? JSON.parse(p.sizes_json) : ["S", "M", "L", "XL"],
      colors: p.colors_json ? JSON.parse(p.colors_json) : [],
      category: p.category,
      isPublished: Boolean(p.is_published),
    }));

    return c.json(formatted);
  } catch (err: any) {
    return c.json({ error: 'Failed to fetch products', details: err.message }, 500);
  }
});

// GET /api/products/preview — Fetch all products (including draft products)
app.get('/api/products/preview', async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      "SELECT * FROM products ORDER BY display_order ASC, name ASC"
    ).all();

    const formatted = (results || []).map((p: any) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      subtitle: p.subtitle,
      price: Number(p.price),
      originalPrice: p.original_price ? Number(p.original_price) : null,
      image: p.image,
      hoverImage: p.hover_image,
      badge: p.badge,
      soldOut: (p.inventory_count || 0) <= 0,
      description: p.description,
      sizes: p.sizes_json ? JSON.parse(p.sizes_json) : ["S", "M", "L", "XL"],
      colors: p.colors_json ? JSON.parse(p.colors_json) : [],
      category: p.category,
      isPublished: Boolean(p.is_published),
    }));

    return c.json(formatted);
  } catch (err: any) {
    return c.json({ error: 'Failed to fetch products preview', details: err.message }, 500);
  }
});

// POST /api/orders/checkout — Create new order in D1 DB
app.post('/api/orders/checkout', async (c) => {
  try {
    const body = await c.req.json();
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const { customerEmail, customerName, shippingAddress, items, totalAmount, paymentMethod = 'cod' } = body;

    if (!items || !items.length) {
      return c.json({ error: 'Cart is empty' }, 400);
    }

    // Insert Order
    await c.env.DB.prepare(
      `INSERT INTO orders (id, customer_email, customer_name, shipping_address_json, total_amount, status, payment_method)
       VALUES (?, ?, ?, ?, ?, 'pending', ?)`
    ).bind(orderId, customerEmail || 'guest@squadgear.com', customerName || 'Guest Customer', JSON.stringify(shippingAddress || {}), totalAmount || 0, paymentMethod).run();

    // Insert Order Items & Update Inventory
    for (const item of items) {
      const itemId = `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      await c.env.DB.prepare(
        `INSERT INTO order_items (id, order_id, product_id, product_name, quantity, price_at_purchase)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).bind(itemId, orderId, item.productId, item.name || 'Apparel Item', item.quantity || 1, item.price || 0).run();

      // Decrement Inventory in D1
      await c.env.DB.prepare(
        `UPDATE products SET inventory_count = MAX(0, inventory_count - ?) WHERE id = ?`
      ).bind(item.quantity || 1, item.productId).run();
    }

    // Insert Audit Event
    const eventId = `event_${Date.now()}`;
    await c.env.DB.prepare(
      `INSERT INTO order_events (id, order_id, event_status, notes) VALUES (?, ?, 'order_placed', ?)`
    ).bind(eventId, orderId, `Order placed successfully via ${paymentMethod}`).run();

    return c.json({ success: true, orderId, status: 'pending', message: 'Order created successfully' }, 201);
  } catch (err: any) {
    return c.json({ error: 'Failed to process checkout', details: err.message }, 500);
  }
});

export default app;
