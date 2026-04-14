import { Router } from "express";
import { db, ratingsTable, usersTable } from "@workspace/db";
import { eq, desc, count, avg, and } from "drizzle-orm";
import { requireAuth, requireAdmin } from "../lib/auth";
import {
  GetRatingQueryParams,
  GetUserRatingQueryParams,
  ListAllRatingsQueryParams,
  CreateOrUpdateRatingBody,
  DeleteRatingParams,
} from "@workspace/api-zod";

const router = Router();

async function enrichRating(rating: typeof ratingsTable.$inferSelect) {
  const [user] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, rating.userId));
  return {
    id: rating.id,
    stars: rating.stars,
    contentType: rating.contentType,
    contentId: rating.contentId,
    userId: rating.userId,
    userName: user?.name ?? "Unbekannt",
    createdAt: rating.createdAt.toISOString(),
  };
}

router.get("/ratings", async (req, res): Promise<void> => {
  const parsed = GetRatingQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { contentType, contentId } = parsed.data;
  const ratingData = await db.select({ avg: avg(ratingsTable.stars), count: count() }).from(ratingsTable).where(
    and(eq(ratingsTable.contentType, contentType), eq(ratingsTable.contentId, contentId))
  );

  let userRating: number | null = null;
  if (req.userId) {
    const [ur] = await db.select().from(ratingsTable).where(
      and(eq(ratingsTable.userId, req.userId), eq(ratingsTable.contentType, contentType), eq(ratingsTable.contentId, contentId))
    );
    userRating = ur?.stars ?? null;
  }

  res.json({
    averageRating: ratingData[0]?.avg ? Number(ratingData[0].avg) : null,
    ratingCount: Number(ratingData[0]?.count ?? 0),
    userRating,
  });
});

router.post("/ratings", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateOrUpdateRatingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { stars, contentType, contentId } = parsed.data;

  if (stars < 1 || stars > 5) {
    res.status(400).json({ error: "Stars must be between 1 and 5" });
    return;
  }

  const existing = await db.select().from(ratingsTable).where(
    and(eq(ratingsTable.userId, req.userId!), eq(ratingsTable.contentType, contentType), eq(ratingsTable.contentId, contentId))
  );

  let rating;
  if (existing.length > 0) {
    [rating] = await db.update(ratingsTable).set({ stars }).where(eq(ratingsTable.id, existing[0].id)).returning();
  } else {
    [rating] = await db.insert(ratingsTable).values({ stars, contentType, contentId, userId: req.userId! }).returning();
  }

  res.json(await enrichRating(rating));
});

router.get("/ratings/user", requireAuth, async (req, res): Promise<void> => {
  const parsed = GetUserRatingQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { contentType, contentId } = parsed.data;
  const [rating] = await db.select().from(ratingsTable).where(
    and(eq(ratingsTable.userId, req.userId!), eq(ratingsTable.contentType, contentType), eq(ratingsTable.contentId, contentId))
  );

  if (!rating) {
    res.status(404).json({ error: "No rating found" });
    return;
  }

  res.json(await enrichRating(rating));
});

router.get("/ratings/all", requireAdmin, async (req, res): Promise<void> => {
  const parsed = ListAllRatingsQueryParams.safeParse(req.query);
  const page = parsed.success && parsed.data.page ? parsed.data.page : 1;
  const limit = parsed.success && parsed.data.limit ? parsed.data.limit : 20;
  const offset = (page - 1) * limit;

  const [ratings, countResult] = await Promise.all([
    db.select().from(ratingsTable).orderBy(desc(ratingsTable.createdAt)).limit(limit).offset(offset),
    db.select({ count: count() }).from(ratingsTable),
  ]);

  const total = Number(countResult[0]?.count ?? 0);
  const enriched = await Promise.all(ratings.map(enrichRating));

  res.json({ ratings: enriched, total, page, totalPages: Math.ceil(total / limit) });
});

router.delete("/ratings/:id", requireAdmin, async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid rating ID" });
    return;
  }

  const [rating] = await db.delete(ratingsTable).where(eq(ratingsTable.id, id)).returning();
  if (!rating) {
    res.status(404).json({ error: "Rating not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
