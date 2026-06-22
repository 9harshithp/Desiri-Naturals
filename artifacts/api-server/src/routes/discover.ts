import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, productsTable, farmsTable, categoriesTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/discover/summary", async (_req, res): Promise<void> => {
  const [productCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(productsTable);
  const [farmCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(farmsTable);
  const [catCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(categoriesTable);
  const [organicCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(productsTable)
    .where(eq(productsTable.isOrganic, true));

  const total = productCount?.count ?? 0;
  const organic = organicCount?.count ?? 0;

  res.json({
    totalProducts: total,
    totalFarms: farmCount?.count ?? 0,
    totalCategories: catCount?.count ?? 0,
    happyCustomers: 12400,
    organicPercentage: total > 0 ? Math.round((organic / total) * 100) : 0,
    avgDeliveryHours: 6,
  });
});

export default router;
