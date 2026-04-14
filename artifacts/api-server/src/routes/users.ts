import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { eq, ilike, count, sql } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../lib/auth";
import { ListUsersQueryParams, GetUserParams, BlockUserParams, UnblockUserParams, UpdateProfileBody } from "@workspace/api-zod";

const router = Router();

function formatUser(user: typeof usersTable.$inferSelect) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isBlocked: user.isBlocked,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

router.get("/users", requireAdmin, async (req, res): Promise<void> => {
  const parsed = ListUsersQueryParams.safeParse(req.query);
  const page = parsed.success && parsed.data.page ? parsed.data.page : 1;
  const limit = parsed.success && parsed.data.limit ? parsed.data.limit : 20;
  const search = parsed.success && parsed.data.search ? parsed.data.search : undefined;
  const offset = (page - 1) * limit;

  let query = db.select().from(usersTable);
  let countQuery = db.select({ count: count() }).from(usersTable);

  if (search) {
    const searchFilter = ilike(usersTable.name, `%${search}%`);
    query = query.where(searchFilter) as typeof query;
    countQuery = countQuery.where(searchFilter) as typeof countQuery;
  }

  const [users, countResult] = await Promise.all([
    query.limit(limit).offset(offset).orderBy(usersTable.createdAt),
    countQuery,
  ]);

  const total = Number(countResult[0]?.count ?? 0);
  res.json({
    users: users.map(formatUser),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
});

router.get("/users/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(formatUser(user));
});

router.patch("/users/:id/block", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  if (id === req.userId) {
    res.status(400).json({ error: "You cannot block yourself" });
    return;
  }

  const [user] = await db.update(usersTable).set({ isBlocked: true }).where(eq(usersTable.id, id)).returning();
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(formatUser(user));
});

router.patch("/users/:id/unblock", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid user ID" });
    return;
  }

  const [user] = await db.update(usersTable).set({ isBlocked: false }).where(eq(usersTable.id, id)).returning();
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(formatUser(user));
});

router.patch("/users/profile", requireAuth, async (req, res): Promise<void> => {
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [user] = await db.update(usersTable).set(parsed.data).where(eq(usersTable.id, req.userId!)).returning();
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(formatUser(user));
});

export default router;
