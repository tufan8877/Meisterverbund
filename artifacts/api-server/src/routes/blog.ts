import { Router } from "express";
import { db, blogPostsTable, commentsTable, ratingsTable } from "@workspace/db";
import { eq, desc, count, avg, and, ilike } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";
import {
  ListBlogPostsQueryParams,
  ListAllBlogPostsQueryParams,
  GetBlogPostParams,
  UpdateBlogPostParams,
  DeleteBlogPostParams,
  CreateBlogPostBody,
  UpdateBlogPostBody,
} from "@workspace/api-zod";

const router = Router();

async function enrichPost(post: typeof blogPostsTable.$inferSelect) {
  const [commentCount, ratingData] = await Promise.all([
    db.select({ count: count() }).from(commentsTable).where(
      and(eq(commentsTable.contentType, "blog"), eq(commentsTable.contentId, post.id))
    ),
    db.select({ avg: avg(ratingsTable.stars), count: count() }).from(ratingsTable).where(
      and(eq(ratingsTable.contentType, "blog"), eq(ratingsTable.contentId, post.id))
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

router.get("/blog", async (req, res): Promise<void> => {
  const parsed = ListBlogPostsQueryParams.safeParse(req.query);
  const page = parsed.success && parsed.data.page ? parsed.data.page : 1;
  const limit = parsed.success && parsed.data.limit ? parsed.data.limit : 10;
  const offset = (page - 1) * limit;

  const [posts, countResult] = await Promise.all([
    db.select().from(blogPostsTable).where(eq(blogPostsTable.published, true)).orderBy(desc(blogPostsTable.createdAt)).limit(limit).offset(offset),
    db.select({ count: count() }).from(blogPostsTable).where(eq(blogPostsTable.published, true)),
  ]);

  const total = Number(countResult[0]?.count ?? 0);
  const enriched = await Promise.all(posts.map(enrichPost));

  res.json({ posts: enriched, total, page, totalPages: Math.ceil(total / limit) });
});

router.post("/blog", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [post] = await db.insert(blogPostsTable).values({
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

router.get("/blog/all", requireAdmin, async (req, res): Promise<void> => {
  const parsed = ListAllBlogPostsQueryParams.safeParse(req.query);
  const page = parsed.success && parsed.data.page ? parsed.data.page : 1;
  const limit = parsed.success && parsed.data.limit ? parsed.data.limit : 10;
  const offset = (page - 1) * limit;

  const [posts, countResult] = await Promise.all([
    db.select().from(blogPostsTable).orderBy(desc(blogPostsTable.createdAt)).limit(limit).offset(offset),
    db.select({ count: count() }).from(blogPostsTable),
  ]);

  const total = Number(countResult[0]?.count ?? 0);
  const enriched = await Promise.all(posts.map(enrichPost));

  res.json({ posts: enriched, total, page, totalPages: Math.ceil(total / limit) });
});

router.get("/blog/:slug", async (req, res): Promise<void> => {
  const rawSlug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const [post] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.slug, rawSlug));

  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }

  res.json(await enrichPost(post));
});

router.patch("/blog/:slug", requireAdmin, async (req, res): Promise<void> => {
  const rawSlug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const parsed = UpdateBlogPostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [post] = await db.update(blogPostsTable).set({
    ...(parsed.data.title !== undefined && { title: parsed.data.title }),
    ...(parsed.data.slug !== undefined && { slug: parsed.data.slug }),
    ...(parsed.data.excerpt !== undefined && { excerpt: parsed.data.excerpt }),
    ...(parsed.data.content !== undefined && { content: parsed.data.content }),
    ...(parsed.data.coverImage !== undefined && { coverImage: parsed.data.coverImage }),
    ...(parsed.data.category !== undefined && { category: parsed.data.category }),
    ...(parsed.data.published !== undefined && { published: parsed.data.published }),
  }).where(eq(blogPostsTable.slug, rawSlug)).returning();

  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }

  res.json(await enrichPost(post));
});

router.delete("/blog/:slug", requireAdmin, async (req, res): Promise<void> => {
  const rawSlug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const [post] = await db.delete(blogPostsTable).where(eq(blogPostsTable.slug, rawSlug)).returning();

  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
