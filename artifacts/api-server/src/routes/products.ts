import { Router, type IRouter } from "express";
import { eq, and, gte, lte, ilike, SQL } from "drizzle-orm";
import { db, productsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/products/featured", async (_req, res): Promise<void> => {
  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.isFeatured, true))
    .limit(8);
  res.json(products.map(serializeProduct));
});

router.get("/products/seasonal", async (_req, res): Promise<void> => {
  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.isSeasonal, true))
    .limit(8);
  res.json(products.map(serializeProduct));
});

router.get("/products", async (req, res): Promise<void> => {
  const { category, search, organic, seasonal, minPrice, maxPrice } = req.query;

  const conditions: SQL[] = [];

  if (category && typeof category === "string") {
    conditions.push(eq(productsTable.categorySlug, category));
  }
  if (search && typeof search === "string") {
    conditions.push(ilike(productsTable.name, `%${search}%`));
  }
  if (organic === "true") {
    conditions.push(eq(productsTable.isOrganic, true));
  }
  if (seasonal === "true") {
    conditions.push(eq(productsTable.isSeasonal, true));
  }
  if (minPrice) {
    conditions.push(gte(productsTable.price, String(minPrice)));
  }
  if (maxPrice) {
    conditions.push(lte(productsTable.price, String(maxPrice)));
  }

  const products = await db
    .select()
    .from(productsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  res.json(products.map(serializeProduct));
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id));
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(serializeProduct(product));
});

function serializeProduct(p: typeof productsTable.$inferSelect) {
  return {
    ...p,
    price: parseFloat(p.price),
    rating: parseFloat(p.rating),
  };
}

export default router;
