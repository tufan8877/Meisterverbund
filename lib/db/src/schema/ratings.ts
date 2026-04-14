import { pgTable, serial, timestamp, integer, text, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const ratingsTable = pgTable("ratings", {
  id: serial("id").primaryKey(),
  stars: integer("stars").notNull(), // 1-5
  contentType: text("content_type").notNull(), // 'blog' | 'news' | 'ad' | 'business'
  contentId: integer("content_id").notNull(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  unique("ratings_user_content_unique").on(table.userId, table.contentType, table.contentId),
]);

export const insertRatingSchema = createInsertSchema(ratingsTable).omit({ id: true, createdAt: true });
export type InsertRating = z.infer<typeof insertRatingSchema>;
export type Rating = typeof ratingsTable.$inferSelect;
