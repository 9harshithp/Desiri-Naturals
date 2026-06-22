import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, ordersTable, productsTable, usersTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

async function requireAdmin(req: any, res: any): Promise<boolean> {
  const uid = req.cookies?.["farm2me_uid"] ? parseInt(req.cookies["farm2me_uid"]) : null;
  if (!uid) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, uid));
  if (!user || user.role !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return false;
  }
  return true;
}

function serializeOrder(order: typeof ordersTable.$inferSelect) {
  return {
    ...order,
    total: parseFloat(order.total),
    createdAt: order.createdAt.toISOString(),
  };
}

function serializeProduct(p: typeof productsTable.$inferSelect) {
  return {
    ...p,
    price: parseFloat(p.price),
    rating: parseFloat(p.rating),
  };
}

router.get("/admin/stats", async (req, res): Promise<void> => {
  if (!(await requireAdmin(req, res))) return;

  const [orderCount] = await db.select({ count: sql<number>`count(*)::int`, revenue: sql<number>`coalesce(sum(total::numeric), 0)` }).from(ordersTable);
  const [productCount] = await db.select({ count: sql<number>`count(*)::int` }).from(productsTable);
  const [customerCount] = await db.select({ count: sql<number>`count(*)::int` }).from(usersTable).where(eq(usersTable.role, "customer"));

  const recentOrders = await db
    .select()
    .from(ordersTable)
    .orderBy(sql`created_at desc`)
    .limit(5);

  res.json({
    totalOrders: orderCount?.count ?? 0,
    totalRevenue: parseFloat(String(orderCount?.revenue ?? 0)),
    totalProducts: productCount?.count ?? 0,
    totalCustomers: customerCount?.count ?? 0,
    recentOrders: recentOrders.map(serializeOrder),
    topProducts: [],
  });
});

router.get("/admin/orders", async (req, res): Promise<void> => {
  if (!(await requireAdmin(req, res))) return;

  const orders = await db
    .select()
    .from(ordersTable)
    .orderBy(sql`created_at desc`);
  res.json(orders.map(serializeOrder));
});

router.patch("/admin/products/:id", async (req, res): Promise<void> => {
  if (!(await requireAdmin(req, res))) return;

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const { price, stock, isFeatured, freshnessScore } = req.body;
  const updates: Record<string, unknown> = {};
  if (price !== undefined) updates.price = String(price);
  if (stock !== undefined) updates.stock = stock;
  if (isFeatured !== undefined) updates.isFeatured = isFeatured;
  if (freshnessScore !== undefined) updates.freshnessScore = freshnessScore;

  const [updated] = await db
    .update(productsTable)
    .set(updates)
    .where(eq(productsTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(serializeProduct(updated));
});

router.patch("/admin/orders/:id/status", async (req, res): Promise<void> => {
  if (!(await requireAdmin(req, res))) return;

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const { status } = req.body;
  if (!status) {
    res.status(400).json({ error: "status is required" });
    return;
  }

  const [updated] = await db
    .update(ordersTable)
    .set({ status })
    .where(eq(ordersTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json({
    ...updated,
    total: parseFloat(updated.total),
    createdAt: updated.createdAt.toISOString(),
  });
});

export default router;
