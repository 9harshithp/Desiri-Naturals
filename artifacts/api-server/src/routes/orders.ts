import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, ordersTable, cartItemsTable, productsTable } from "@workspace/db";

const router: IRouter = Router();

function getSessionId(req: any): string {
  return req.cookies?.["farm2me_session"] ?? "anonymous";
}

router.get("/orders", async (req, res): Promise<void> => {
  const sessionId = getSessionId(req);
  const orders = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.sessionId, sessionId))
    .orderBy(ordersTable.createdAt);
  res.json(orders.map(serializeOrder));
});

router.post("/orders", async (req, res): Promise<void> => {
  const sessionId = getSessionId(req);
  const { customerName, customerPhone, deliveryAddress, deliveryDate, notes } = req.body;

  if (!customerName || !customerPhone || !deliveryAddress) {
    res.status(400).json({ error: "customerName, customerPhone, deliveryAddress are required" });
    return;
  }

  // Load cart items
  const cartItems = await db
    .select()
    .from(cartItemsTable)
    .where(eq(cartItemsTable.sessionId, sessionId));

  if (cartItems.length === 0) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }

  // Build order items
  const orderItems: any[] = [];
  let total = 0;
  for (const item of cartItems) {
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, item.productId));
    if (product) {
      const price = parseFloat(product.price);
      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price,
        unit: product.unit,
        imageUrl: product.imageUrl,
      });
      total += price * item.quantity;
    }
  }

  const [order] = await db
    .insert(ordersTable)
    .values({
      sessionId,
      items: orderItems,
      total: total.toFixed(2),
      status: "confirmed",
      deliveryDate: deliveryDate || null,
      deliveryAddress,
      customerName,
      customerPhone,
      notes: notes || null,
    })
    .returning();

  // Clear cart
  await db.delete(cartItemsTable).where(eq(cartItemsTable.sessionId, sessionId));

  res.status(201).json(serializeOrder(order));
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(serializeOrder(order));
});

function serializeOrder(order: typeof ordersTable.$inferSelect) {
  return {
    ...order,
    total: parseFloat(order.total),
    createdAt: order.createdAt.toISOString(),
  };
}

export default router;
