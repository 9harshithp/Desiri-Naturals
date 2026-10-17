import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, farmsTable } from "@workspace/db";

const router: IRouter = Router();

router.get("/farms", async (req, res): Promise<void> => {
  const farms = await db.select().from(farmsTable).orderBy(farmsTable.name);
  res.json(farms);
});

router.get("/farms/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }
  const [farm] = await db.select().from(farmsTable).where(eq(farmsTable.id, id));
  if (!farm) {
    res.status(404).json({ error: "Farm not found" });
    return;
  }
  res.json(farm);
});

export default router;
