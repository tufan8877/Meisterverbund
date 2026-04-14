import { Router } from "express";
import { db, newsPostsTable, commentsTable, ratingsTable } from "@workspace/db";
import { eq, desc, count, avg, and } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";
import {
  ListNewsPostsQueryParams,
  ListAllNewsPostsQueryParams,
  CreateNewsPostBody,
  UpdateNewsPostBody,
} from "@workspace/api-zod";

const router = Router();

async function enrichPost(post: typeof newsPostsTable.$inferSelect) {
  const [commentCount, ratingData] = await Promise.all([
    db.select({ count: count() }).from(commentsTable).where(
      and(eq(commentsTable.contentType, "news"), eq(commentsTable.contentId, post.id))
    ),
    db.select({ avg: avg(ratingsTable.stars), count: count() }).from(ratingsTable).where(
      and(eq(ratingsTable.contentType, "news"), eq(ratingsTable.contentId, post.id))
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

router.get("/news", async (req, res): Promise<void> => {
  const parsed = ListNewsPostsQueryParams.safeParse(req.query);
  const page = parsed.success && parsed.data.page ? parsed.data.page : 1;
  const limit = parsed.success && parsed.data.limit ? parsed.data.limit : 10;
  const offset = (page - 1) * limit;

  const [posts, countResult] = await Promise.all([
    db.select().from(newsPostsTable).where(eq(newsPostsTable.published, true)).orderBy(desc(newsPostsTable.createdAt)).limit(limit).offset(offset),
    db.select({ count: count() }).from(newsPostsTable).where(eq(newsPostsTable.published, true)),
  ]);

  const total = Number(countResult[0]?.count ?? 0);
  const enriched = await Promise.all(posts.map(enrichPost));

  res.json({ posts: enriched, total, page, totalPages: Math.ceil(total / limit) });
});

router.post("/news", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateNewsPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [post] = await db.insert(newsPostsTable).values({
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

router.get("/news/all", requireAdmin, async (req, res): Promise<void> => {
  const parsed = ListAllNewsPostsQueryParams.safeParse(req.query);
  const page = parsed.success && parsed.data.page ? parsed.data.page : 1;
  const limit = parsed.success && parsed.data.limit ? parsed.data.limit : 10;
  const offset = (page - 1) * limit;

  const [posts, countResult] = await Promise.all([
    db.select().from(newsPostsTable).orderBy(desc(newsPostsTable.createdAt)).limit(limit).offset(offset),
    db.select({ count: count() }).from(newsPostsTable),
  ]);

  const total = Number(countResult[0]?.count ?? 0);
  const enriched = await Promise.all(posts.map(enrichPost));

  res.json({ posts: enriched, total, page, totalPages: Math.ceil(total / limit) });
});

router.get("/news/:slug", async (req, res): Promise<void> => {
  const rawSlug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const [post] = await db.select().from(newsPostsTable).where(eq(newsPostsTable.slug, rawSlug));

  if (!post) {
    res.status(404).json({ error: "News post not found" });
    return;
  }

  res.json(await enrichPost(post));
});

router.patch("/news/:slug", requireAdmin, async (req, res): Promise<void> => {
  const rawSlug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const parsed = UpdateNewsPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [post] = await db.update(newsPostsTable).set({
    ...(parsed.data.title !== undefined && { title: parsed.data.title }),
    ...(parsed.data.slug !== undefined && { slug: parsed.data.slug }),
    ...(parsed.data.excerpt !== undefined && { excerpt: parsed.data.excerpt }),
    ...(parsed.data.content !== undefined && { content: parsed.data.content }),
    ...(parsed.data.coverImage !== undefined && { coverImage: parsed.data.coverImage }),
    ...(parsed.data.category !== undefined && { category: parsed.data.category }),
    ...(parsed.data.published !== undefined && { published: parsed.data.published }),
  }).where(eq(newsPostsTable.slug, rawSlug)).returning();

  if (!post) {
    res.status(404).json({ error: "News post not found" });
    return;
  }

  res.json(await enrichPost(post));
});

router.delete("/news/:slug", requireAdmin, async (req, res): Promise<void> => {
  const rawSlug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const [post] = await db.delete(newsPostsTable).where(eq(newsPostsTable.slug, rawSlug)).returning();

  if (!post) {
    res.status(404).json({ error: "News post not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
