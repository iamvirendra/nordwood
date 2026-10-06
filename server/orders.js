import { randomBytes } from 'node:crypto';
import { transaction } from './db.js';
import { ApiError } from './security.js';

export const statusTransitions = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['in_production', 'cancelled'],
  in_production: ['ready', 'cancelled'],
  ready: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

const selectOrders = `SELECT o.*, u.name AS customer_name, u.email AS customer_email
  FROM orders o JOIN users u ON u.id = o.user_id`;

export async function hydrateOrders(connection, rows) {
  if (!rows.length) return [];
  const ids = rows.map(row => Number(row.id));
  const items = await connection.query(`SELECT * FROM order_items WHERE order_id IN (${ids.map(() => '?').join(',')}) ORDER BY id`, ids);
  const grouped = new Map();
  for (const row of items) {
    const list = grouped.get(Number(row.order_id)) || [];
    list.push({ productId: Number(row.product_id), name: row.name, woodType: row.wood_type, size: row.size, image: row.image, quantity: Number(row.quantity), unitPrice: Number(row.unit_price), lineTotal: Number(row.line_total) });
    grouped.set(Number(row.order_id), list);
  }
  return rows.map(row => ({
    id: Number(row.id), orderNumber: row.order_number, status: row.status, subtotal: Number(row.subtotal),
    createdAt: row.created_at.toISOString(), updatedAt: row.updated_at.toISOString(),
    customer: { id: Number(row.user_id), name: row.customer_name, email: row.customer_email },
    shipping: { name: row.shipping_name, phone: row.shipping_phone, address: row.shipping_address, city: row.shipping_city, postalCode: row.shipping_postal_code },
    notes: row.notes, items: grouped.get(Number(row.id)) || [],
  }));
}

export async function getOrder(pool, id, user) {
  const filter = user.role === 'admin' ? '' : ' AND o.user_id = ?';
  const rows = await pool.query(`${selectOrders} WHERE o.id = ?${filter}`, user.role === 'admin' ? [id] : [id, user.id]);
  if (!rows.length) throw new ApiError(404, 'Order not found.');
  return (await hydrateOrders(pool, rows))[0];
}

export async function getUserOrders(pool, userId) {
  const rows = await pool.query(`${selectOrders} WHERE o.user_id = ? ORDER BY o.created_at DESC, o.id DESC LIMIT 200`, [userId]);
  return hydrateOrders(pool, rows);
}

export async function placeOrder(pool, user, data) {
  try {
    return await transaction(pool, async connection => {
      // Serialize a customer's submissions: duplicate retries can never insert twice.
      await connection.query('SELECT id FROM users WHERE id = ? FOR UPDATE', [user.id]);
      const existing = await connection.query('SELECT id, request_hash FROM orders WHERE user_id = ? AND request_id = ?', [user.id, data.requestId]);
      if (existing.length) {
        if (existing[0].request_hash !== data.requestHash) throw new ApiError(409, 'This order request was already used. Please start a new order.');
        return { order: await getOrder(connection, existing[0].id, user), created: false };
      }
      const number = `NW-${new Date().toISOString().slice(2, 10).replaceAll('-', '')}-${randomBytes(6).toString('hex').toUpperCase()}`;
      const { shipping } = data;
      const result = await connection.query(`INSERT INTO orders
        (order_number, user_id, request_id, request_hash, subtotal, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_postal_code, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [number, user.id, data.requestId, data.requestHash, data.subtotal, shipping.name, shipping.phone, shipping.address, shipping.city, shipping.postalCode, data.notes]);
      const id = Number(result.insertId);
      for (const item of data.items) {
        await connection.query(`INSERT INTO order_items
          (order_id, product_id, name, wood_type, size, image, quantity, unit_price, line_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, item.productId, item.name, item.woodType, item.size, item.image, item.quantity, item.unitPrice, item.lineTotal]);
      }
      return { order: await getOrder(connection, id, user), created: true };
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') throw new ApiError(409, 'This order already exists. Refresh your orders before trying again.');
    throw error;
  }
}

export async function getAdminOrders(pool, { search = '', status = '', page = 1 }) {
  const pageSize = 20;
  const where = [];
  const params = [];
  if (status) { where.push('o.status = ?'); params.push(status); }
  if (search) {
    const like = `%${search.replace(/[!%_]/g, value => `!${value}`)}%`;
    where.push("(o.order_number LIKE ? ESCAPE '!' OR u.name LIKE ? ESCAPE '!' OR u.email LIKE ? ESCAPE '!' OR o.shipping_name LIKE ? ESCAPE '!')");
    params.push(like, like, like, like);
  }
  const filter = where.length ? ` WHERE ${where.join(' AND ')}` : '';
  const [counts] = await pool.query(`SELECT COUNT(*) AS total FROM orders o JOIN users u ON u.id = o.user_id${filter}`, params);
  const rows = await pool.query(`${selectOrders}${filter} ORDER BY o.created_at DESC, o.id DESC LIMIT ? OFFSET ?`, [...params, pageSize, (page - 1) * pageSize]);
  const [stats] = await pool.query(`SELECT COUNT(*) AS total,
    COALESCE(SUM(status = 'pending'), 0) AS pending,
    COALESCE(SUM(status IN ('confirmed','in_production','ready')), 0) AS active,
    COALESCE(SUM(status = 'completed'), 0) AS completed,
    COALESCE(SUM(CASE WHEN status <> 'cancelled' THEN subtotal ELSE 0 END), 0) AS subtotal FROM orders`);
  return { orders: await hydrateOrders(pool, rows), total: Number(counts.total), page, pageSize, stats: Object.fromEntries(Object.entries(stats).map(([key, value]) => [key, Number(value)])) };
}

export async function updateOrderStatus(pool, id, status, user) {
  return transaction(pool, async connection => {
    const [row] = await connection.query('SELECT status FROM orders WHERE id = ? FOR UPDATE', [id]);
    if (!row) throw new ApiError(404, 'Order not found.');
    if (row.status !== status) {
      if (!statusTransitions[row.status]?.includes(status)) throw new ApiError(409, `This order cannot move from ${row.status.replaceAll('_', ' ')} to ${status.replaceAll('_', ' ')}.`);
      await connection.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
      await connection.query('INSERT INTO order_status_history (order_id, actor_id, from_status, to_status) VALUES (?, ?, ?, ?)', [id, user.id, row.status, status]);
    }
    return getOrder(connection, id, user);
  });
}
