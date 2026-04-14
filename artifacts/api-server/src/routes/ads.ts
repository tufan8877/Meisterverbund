import { Router } from "express";
import { db, adPostsTable, commentsTable, ratingsTable } from "@workspace/db";
import { eq, desc, count, avg, and } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";
import {
  ListAdPostsQueryParams,
  ListAllAdPostsQueryParams,
  CreateAdPostBody,
  UpdateAdPostBody,
} from "@workspace/api-zod";

const router = Router();

async function enrichPost(post: typeof adPostsTable.$inferSelect) {
  const [commentCount, ratingData] = await Promise.all([
    db.select({ count: count() }).from(commentsTable).where(
      and(eq(commentsTable.contentType, "ad"), eq(commentsTable.contentId, post.id))
    ),
    db.select({ avg: avg(ratingsTable.stars), count: count() }).from(ratingsTable).where(
      and(eq(ratingsTable.contentType, "ad"), eq(ratingsTable.contentId, post.id))
    ),
  ]);
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage ?? null,
    category: post.category ?? null,
    published: post.published,
    averageRating: ratingData[0]?.avg ? Number(ratingData[0].avg) : null,
    ratingCount: Number(ratingData[0]?.count ?? 0),
    commentCount: Number(commentCount[0]?.count ?? 0),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };
}

router.get("/ads", async (req, res): Promise<void> => {
  const parsed = ListAdPostsQueryParams.safeParse(req.query);
  const page = parsed.success && parsed.data.page ? parsed.data.page : 1;
  const limit = parsed.success && parsed.data.limit ? parsed.data.limit : 10;
  const offset = (page - 1) * limit;

  const [posts, countResult] = await Promise.all([
    db.select().from(adPostsTable).where(eq(adPostsTable.published, true)).orderBy(desc(adPostsTable.createdAt)).limit(limit).offset(offset),
    db.select({ count: count() }).from(adPostsTable).where(eq(adPostsTable.published, true)),
  ]);

  const total = Number(countResult[0]?.count ?? 0);
  const enriched = await Promise.all(posts.map(enrichPost));

  res.json({ posts: enriched, total, page, totalPages: Math.ceil(total / limit) });
});

router.post("/ads", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateAdPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [post] = await db.insert(adPostsTable).values({
    title: parsed.data.title,
    slug: parsed.data.slug,
    excerpt: parsed.data.excerpt,
    content: parsed.data.content,
    coverImage: parsed.data.coverImage ?? null,
    category: parsed.data.category ?? null,
    published: parsed.data.published ?? false,
  }).returning();

  res.status(201).json(await enrichPost(post));
});

router.get("/ads/all", requireAdmin, async (req, res): Promise<void> => {
  const parsed = ListAllAdPostsQueryParams.safeParse(req.query);
  const page = parsed.success && parsed.data.page ? parsed.data.page : 1;
  const limit = parsed.success && parsed.data.limit ? parsed.data.limit : 10;
  const offset = (page - 1) * limit;

  const [posts, countResult] = await Promise.all([
    db.select().from(adPostsTable).orderBy(desc(adPostsTable.createdAt)).limit(limit).offset(offset),
    db.select({ count: count() }).from(adPostsTable),
  ]);

  const total = Number(countResult[0]?.count ?? 0);
  const enriched = await Promise.all(posts.map(enrichPost));

  res.json({ posts: enriched, total, page, totalPages: Math.ceil(total / limit) });
});

router.get("/ads/:slug", async (req, res): Promise<void> => {
  const rawSlug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const [post] = await db.select().from(adPostsTable).where(eq(adPostsTable.slug, rawSlug));

  if (!post) {
    res.status(404).json({ error: "Ad post not found" });
    return;
  }

  res.json(await enrichPost(post));
});

router.patch("/ads/:slug", requireAdmin, async (req, res): Promise<void> => {
  const rawSlug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const parsed = UpdateAdPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [post] = await db.update(adPostsTable).set({
    ...(parsed.data.title !== undefined && { title: parsed.data.title }),
    ...(parsed.data.slug !== undefined && { slug: parsed.data.slug }),
    ...(parsed.data.excerpt !== undefined && { excerpt: parsed.data.excerpt }),
    ...(parsed.data.content !== undefined && { content: parsed.data.content }),
    ...(parsed.data.coverImage !== undefined && { coverImage: parsed.data.coverImage }),
    ...(parsed.data.category !== undefined && { category: parsed.data.category }),
    ...(parsed.data.published !== undefined && { published: parsed.data.published }),
  }).where(eq(adPostsTable.slug, rawSlug)).returning();

  if (!post) {
    res.status(404).json({ error: "Ad post not found" });
    return;
  }

  res.json(await enrichPost(post));
});

router.delete("/ads/:slug", requireAdmin, async (req, res): Promise<void> => {
  const rawSlug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const [post] = await db.delete(adPostsTable).where(eq(adPostsTable.slug, rawSlug)).returning();

  if (!post) {
    res.status(404).json({ error: "Ad post not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
