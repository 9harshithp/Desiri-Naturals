import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, reviewsTable, productsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/products/:id/reviews", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.productId, id))
    .orderBy(reviewsTable.createdAt);
  res.json(reviews.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.post("/products/:id/reviews", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const { rating, reviewerName, comment } = req.body;
  if (!rating || !reviewerName) {
    res.status(400).json({ error: "rating and reviewerName are required" });
    return;
  }
  const [review] = await db
    .insert(reviewsTable)
    .values({ productId: id, rating: parseInt(rating), reviewerName, comment: comment || null })
    .returning();

  // Update product rating and review count
  const reviews = await db.select().from(reviewsTable).where(eq(reviewsTable.productId, id));
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await db
    .update(productsTable)
    .set({ rating: avgRating.toFixed(1), reviewCount: reviews.length })
    .where(eq(productsTable.id, id));

  res.status(201).json({ ...review, createdAt: review.createdAt.toISOString() });
});

export default router;
