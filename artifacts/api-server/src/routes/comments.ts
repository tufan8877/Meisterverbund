import { Router } from "express";
import { db, commentsTable, usersTable } from "@workspace/db";
import { eq, desc, count, and } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../lib/auth";
import {
  ListCommentsQueryParams,
  ListAllCommentsQueryParams,
  CreateCommentBody,
  UpdateCommentBody,
  GetUserParams,
} from "@workspace/api-zod";

const router = Router();

async function enrichComment(comment: typeof commentsTable.$inferSelect) {
  const [user] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, comment.userId));
  return {
    id: comment.id,
    content: comment.content,
    contentType: comment.contentType,
    contentId: comment.contentId,
    userId: comment.userId,
    userName: user?.name ?? "Unbekannt",
    createdAt: comment.createdAt.toISOString(),
    updatedAt: comment.updatedAt.toISOString(),
  };
}

router.get("/comments", async (req, res): Promise<void> => {
  const parsed = ListCommentsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { contentType, contentId, page = 1, limit = 20 } = parsed.data;
  const offset = (page - 1) * limit;

  const [comments, countResult] = await Promise.all([
    db.select().from(commentsTable).where(
      and(eq(commentsTable.contentType, contentType), eq(commentsTable.contentId, contentId))
    ).orderBy(desc(commentsTable.createdAt)).limit(limit).offset(offset),
    db.select({ count: count() }).from(commentsTable).where(
      and(eq(commentsTable.contentType, contentType), eq(commentsTable.contentId, contentId))
    ),
  ]);

  const total = Number(countResult[0]?.count ?? 0);
  const enriched = await Promise.all(comments.map(enrichComment));

  res.json({ comments: enriched, total, page, totalPages: Math.ceil(total / limit) });
});

router.post("/comments", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateCommentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (!parsed.data.content.trim()) {
    res.status(400).json({ error: "Comment cannot be empty" });
    return;
  }

  const [comment] = await db.insert(commentsTable).values({
    content: parsed.data.content,
    contentType: parsed.data.contentType,
    contentId: parsed.data.contentId,
    userId: req.userId!,
  }).returning();

  res.status(201).json(await enrichComment(comment));
});

router.get("/comments/all", requireAdmin, async (req, res): Promise<void> => {
  const parsed = ListAllCommentsQueryParams.safeParse(req.query);
  const page = parsed.success && parsed.data.page ? parsed.data.page : 1;
  const limit = parsed.success && parsed.data.limit ? parsed.data.limit : 20;
  const offset = (page - 1) * limit;

  const [comments, countResult] = await Promise.all([
    db.select().from(commentsTable).orderBy(desc(commentsTable.createdAt)).limit(limit).offset(offset),
    db.select({ count: count() }).from(commentsTable),
  ]);

  const total = Number(countResult[0]?.count ?? 0);
  const enriched = await Promise.all(comments.map(enrichComment));

  res.json({ comments: enriched, total, page, totalPages: Math.ceil(total / limit) });
});

router.patch("/comments/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid comment ID" });
    return;
  }

  const parsed = UpdateCommentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db.select().from(commentsTable).where(eq(commentsTable.id, id));
  if (!existing) {
    res.status(404).json({ error: "Comment not found" });
    return;
  }

  if (existing.userId !== req.userId && !req.isAdmin) {
    res.status(403).json({ error: "You can only edit your own comments" });
    return;
  }

  const [comment] = await db.update(commentsTable).set({ content: parsed.data.content }).where(eq(commentsTable.id, id)).returning();
  res.json(await enrichComment(comment));
});

router.delete("/comments/:id", requireAuth, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid comment ID" });
    return;
  }

  const [existing] = await db.select().from(commentsTable).where(eq(commentsTable.id, id));
  if (!existing) {
    res.status(404).json({ error: "Comment not found" });
    return;
  }

  if (existing.userId !== req.userId && !req.isAdmin) {
    res.status(403).json({ error: "You can only delete your own comments" });
    return;
  }

  await db.delete(commentsTable).where(eq(commentsTable.id, id));
  res.sendStatus(204);
});

export default router;
