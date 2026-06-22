import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";

const router: IRouter = Router();

function getAuthUserId(req: any): number | null {
  return req.cookies?.["farm2me_uid"] ? parseInt(req.cookies["farm2me_uid"]) : null;
}

function setAuthCookies(res: any, userId: number) {
  res.cookie("farm2me_uid", String(userId), {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: "lax",
  });
}

function serializeUser(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
  };
}

router.get("/auth/me", async (req, res): Promise<void> => {
  const uid = getAuthUserId(req);
  if (!uid) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, uid));
  if (!user) {
    res.clearCookie("farm2me_uid");
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json(serializeUser(user));
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  setAuthCookies(res, user.id);
  res.json(serializeUser(user));
});

router.post("/auth/register", async (req, res): Promise<void> => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email and password required" });
    return;
  }
  const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, email.toLowerCase()));
  if (existing) {
    res.status(409).json({ error: "Email already in use" });
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db
    .insert(usersTable)
    .values({ name, email: email.toLowerCase(), passwordHash, phone: phone || null, role: "customer" })
    .returning();
  setAuthCookies(res, user.id);
  res.status(201).json(serializeUser(user));
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  res.clearCookie("farm2me_uid");
  res.json({ ok: true });
});

export default router;
