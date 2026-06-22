import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, cartItemsTable, productsTable } from "@workspace/db";

const router: IRouter = Router();

function getSessionId(req: any): string {
  if (!req.cookies["farm2me_session"]) {
    const id = `sess_${Math.random().toString(36).slice(2)}${Date.now()}`;
    req._newSession = id;
    return id;
  }
  return req.cookies["farm2me_session"];
}

async function buildCart(sessionId: string) {
  const items = await db
    .select()
    .from(cartItemsTable)
    .where(eq(cartItemsTable.sessionId, sessionId));

  if (items.length === 0) {
    return { items: [], total: 0, itemCount: 0 };
  }

  const productIds = items.map((i) => i.productId);
  const products = await db
    .select()
    .from(productsTable)
    .where(
      productIds.length === 1
        ? eq(productsTable.id, productIds[0])
        : eq(productsTable.id, productIds[0])
    );

  // fetch all products for cart
  const productMap = new Map<number, typeof productsTable.$inferSelect>();
  for (const pid of productIds) {
    const [p] = await db.select().from(productsTable).where(eq(productsTable.id, pid));
    if (p) productMap.set(pid, p);
  }

  const cartItems = items
    .map((item) => {
      const product = productMap.get(item.productId);
      if (!product) return null;
      return {
        productId: item.productId,
        quantity: item.quantity,
        product: {
          ...product,
          price: parseFloat(product.price),
          rating: parseFloat(product.rating),
        },
      };
    })
    .filter(Boolean);

  const total = cartItems.reduce(
    (sum, item) => sum + (item ? item.product.price * item.quantity : 0),
    0
  );
  const itemCount = cartItems.reduce((sum, item) => sum + (item ? item.quantity : 0), 0);

  return { items: cartItems, total: Math.round(total * 100) / 100, itemCount };
}

router.get("/cart", async (req, res): Promise<void> => {
  const sessionId = getSessionId(req);
  if (req._newSession) {
    res.cookie("farm2me_session", sessionId, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  }
  const cart = await buildCart(sessionId);
  res.json(cart);
});

router.delete("/cart", async (req, res): Promise<void> => {
  const sessionId = getSessionId(req);
  if (req._newSession) {
    res.cookie("farm2me_session", sessionId, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  }
  await db.delete(cartItemsTable).where(eq(cartItemsTable.sessionId, sessionId));
  res.json({ items: [], total: 0, itemCount: 0 });
});

router.post("/cart/items", async (req, res): Promise<void> => {
  const sessionId = getSessionId(req);
  if (req._newSession) {
    res.cookie("farm2me_session", sessionId, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  }

  const { productId, quantity } = req.body;
  if (!productId || !quantity || quantity < 1) {
    res.status(400).json({ error: "productId and quantity (>=1) required" });
    return;
  }

  const [existing] = await db
    .select()
    .from(cartItemsTable)
    .where(and(eq(cartItemsTable.sessionId, sessionId), eq(cartItemsTable.productId, productId)));

  if (existing) {
    await db
      .update(cartItemsTable)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItemsTable.id, existing.id));
  } else {
    await db.insert(cartItemsTable).values({ sessionId, productId, quantity });
  }

  const cart = await buildCart(sessionId);
  res.json(cart);
});

router.patch("/cart/items/:productId", async (req, res): Promise<void> => {
  const sessionId = getSessionId(req);
  if (req._newSession) {
    res.cookie("farm2me_session", sessionId, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  }

  const raw = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
  const productId = parseInt(raw, 10);
  const { quantity } = req.body;

  if (quantity < 1) {
    await db
      .delete(cartItemsTable)
      .where(and(eq(cartItemsTable.sessionId, sessionId), eq(cartItemsTable.productId, productId)));
  } else {
    await db
      .update(cartItemsTable)
      .set({ quantity })
      .where(and(eq(cartItemsTable.sessionId, sessionId), eq(cartItemsTable.productId, productId)));
  }

  const cart = await buildCart(sessionId);
  res.json(cart);
});

router.delete("/cart/items/:productId", async (req, res): Promise<void> => {
  const sessionId = getSessionId(req);
  if (req._newSession) {
    res.cookie("farm2me_session", sessionId, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
  }

  const raw = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
  const productId = parseInt(raw, 10);

  await db
    .delete(cartItemsTable)
    .where(and(eq(cartItemsTable.sessionId, sessionId), eq(cartItemsTable.productId, productId)));

  const cart = await buildCart(sessionId);
  res.json(cart);
});

export default router;
