import { Router, type IRouter } from "express";
import { db, boxesTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/boxes", async (_req, res): Promise<void> => {
  const boxes = await db.select().from(boxesTable).orderBy(boxesTable.price);
  res.json(boxes.map((b) => ({ ...b, price: parseFloat(b.price) })));
});

export default router;
