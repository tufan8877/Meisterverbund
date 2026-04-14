import { Router } from "express";
import { db, usersTable, blogPostsTable, newsPostsTable, adPostsTable, commentsTable, ratingsTable, businessesTable } from "@workspace/db";
import { count, eq } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";

const router = Router();

router.get("/admin/stats", requireAdmin, async (_req, res): Promise<void> => {
  const [
    userCountResult,
    blogCountResult,
    newsCountResult,
    adCountResult,
    commentCountResult,
    ratingCountResult,
    businessCountResult,
    blockedCountResult,
  ] = await Promise.all([
    db.select({ count: count() }).from(usersTable),
    db.select({ count: count() }).from(blogPostsTable),
    db.select({ count: count() }).from(newsPostsTable),
    db.select({ count: count() }).from(adPostsTable),
    db.select({ count: count() }).from(commentsTable),
    db.select({ count: count() }).from(ratingsTable),
    db.select({ count: count() }).from(businessesTable),
    db.select({ count: count() }).from(usersTable).where(eq(usersTable.isBlocked, true)),
  ]);

  res.json({
    userCount: Number(userCountResult[0]?.count ?? 0),
    blogCount: Number(blogCountResult[0]?.count ?? 0),
    newsCount: Number(newsCountResult[0]?.count ?? 0),
    adCount: Number(adCountResult[0]?.count ?? 0),
    commentCount: Number(commentCountResult[0]?.count ?? 0),
    ratingCount: Number(ratingCountResult[0]?.count ?? 0),
    businessCount: Number(businessCountResult[0]?.count ?? 0),
    blockedUserCount: Number(blockedCountResult[0]?.count ?? 0),
  });
});

export default router;
