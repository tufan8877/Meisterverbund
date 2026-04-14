import { Router } from "express";
import { db, businessesTable, ratingsTable } from "@workspace/db";
import { eq, desc, count, avg, and, ilike, or } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";
import {
  ListBusinessesQueryParams,
  CreateBusinessBody,
  UpdateBusinessBody,
} from "@workspace/api-zod";

const router = Router();

async function enrichBusiness(business: typeof businessesTable.$inferSelect) {
  const ratingData = await db.select({ avg: avg(ratingsTable.stars), count: count() }).from(ratingsTable).where(
    and(eq(ratingsTable.contentType, "business"), eq(ratingsTable.contentId, business.id))
  );
  return {
    id: business.id,
    name: business.name,
    slug: business.slug,
    bundesland: business.bundesland,
    stadt: business.stadt,
    branche: business.branche,
    description: business.description,
    telefon: business.telefon ?? null,
    email: business.email ?? null,
    website: business.website ?? null,
    logo: business.logo ?? null,
    isFeatured: business.isFeatured,
    featuredLabel: business.featuredLabel ?? null,
    averageRating: ratingData[0]?.avg ? Number(ratingData[0].avg) : null,
    ratingCount: Number(ratingData[0]?.count ?? 0),
    createdAt: business.createdAt.toISOString(),
    updatedAt: business.updatedAt.toISOString(),
  };
}

// Featured businesses — must come before /businesses/:slug
router.get("/businesses/featured", async (req, res): Promise<void> => {
  const featured = await db
    .select()
    .from(businessesTable)
    .where(eq(businessesTable.isFeatured, true))
    .orderBy(desc(businessesTable.updatedAt));

  const enriched = await Promise.all(featured.map(enrichBusiness));
  const label = enriched[0]?.featuredLabel ?? null;
  res.json({ businesses: enriched, label });
});

router.get("/businesses", async (req, res): Promise<void> => {
  const parsed = ListBusinessesQueryParams.safeParse(req.query);
  const page = parsed.success && parsed.data.page ? parsed.data.page : 1;
  const limit = parsed.success && parsed.data.limit ? parsed.data.limit : 12;
  const search = parsed.success ? parsed.data.search : undefined;
  const bundesland = parsed.success ? parsed.data.bundesland : undefined;
  const branche = parsed.success ? parsed.data.branche : undefined;
  const offset = (page - 1) * limit;

  let whereClause = undefined;
  const conditions = [];

  if (search) {
    conditions.push(or(
      ilike(businessesTable.name, `%${search}%`),
      ilike(businessesTable.description, `%${search}%`),
      ilike(businessesTable.branche, `%${search}%`),
    ));
  }
  if (bundesland) {
    conditions.push(eq(businessesTable.bundesland, bundesland));
  }
  if (branche) {
    conditions.push(ilike(businessesTable.branche, `%${branche}%`));
  }

  if (conditions.length > 0) {
    whereClause = and(...conditions);
  }

  const [businesses, countResult] = await Promise.all([
    whereClause
      ? db.select().from(businessesTable).where(whereClause).orderBy(desc(businessesTable.createdAt)).limit(limit).offset(offset)
      : db.select().from(businessesTable).orderBy(desc(businessesTable.createdAt)).limit(limit).offset(offset),
    whereClause
      ? db.select({ count: count() }).from(businessesTable).where(whereClause)
      : db.select({ count: count() }).from(businessesTable),
  ]);

  const total = Number(countResult[0]?.count ?? 0);
  const enriched = await Promise.all(businesses.map(enrichBusiness));

  res.json({ businesses: enriched, total, page, totalPages: Math.ceil(total / limit) });
});

router.post("/businesses", requireAdmin, async (req, res): Promise<void> => {
  const parsed = CreateBusinessBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [business] = await db.insert(businessesTable).values({
    name: parsed.data.name,
    slug: parsed.data.slug,
    bundesland: parsed.data.bundesland,
    stadt: parsed.data.stadt,
    branche: parsed.data.branche,
    description: parsed.data.description,
    telefon: parsed.data.telefon ?? null,
    email: parsed.data.email ?? null,
    website: parsed.data.website ?? null,
    logo: parsed.data.logo ?? null,
  }).returning();

  res.status(201).json(await enrichBusiness(business));
});

router.get("/businesses/:slug", async (req, res): Promise<void> => {
  const rawSlug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const [business] = await db.select().from(businessesTable).where(eq(businessesTable.slug, rawSlug));

  if (!business) {
    res.status(404).json({ error: "Business not found" });
    return;
  }

  res.json(await enrichBusiness(business));
});

router.patch("/businesses/:slug", requireAdmin, async (req, res): Promise<void> => {
  const rawSlug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const parsed = UpdateBusinessBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [business] = await db.update(businessesTable).set({
    ...(parsed.data.name !== undefined && { name: parsed.data.name }),
    ...(parsed.data.slug !== undefined && { slug: parsed.data.slug }),
    ...(parsed.data.bundesland !== undefined && { bundesland: parsed.data.bundesland }),
    ...(parsed.data.stadt !== undefined && { stadt: parsed.data.stadt }),
    ...(parsed.data.branche !== undefined && { branche: parsed.data.branche }),
    ...(parsed.data.description !== undefined && { description: parsed.data.description }),
    ...(parsed.data.telefon !== undefined && { telefon: parsed.data.telefon }),
    ...(parsed.data.email !== undefined && { email: parsed.data.email }),
    ...(parsed.data.website !== undefined && { website: parsed.data.website }),
    ...(parsed.data.logo !== undefined && { logo: parsed.data.logo }),
    ...(parsed.data.isFeatured !== undefined && { isFeatured: parsed.data.isFeatured }),
    ...(parsed.data.featuredLabel !== undefined && { featuredLabel: parsed.data.featuredLabel }),
  }).where(eq(businessesTable.slug, rawSlug)).returning();

  if (!business) {
    res.status(404).json({ error: "Business not found" });
    return;
  }

  res.json(await enrichBusiness(business));
});

router.delete("/businesses/:slug", requireAdmin, async (req, res): Promise<void> => {
  const rawSlug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const [business] = await db.delete(businessesTable).where(eq(businessesTable.slug, rawSlug)).returning();

  if (!business) {
    res.status(404).json({ error: "Business not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
