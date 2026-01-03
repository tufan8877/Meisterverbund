import { 
  users, companies, reviews, posts,
  type User, type InsertUser, type Company, type InsertCompany,
  type Review, type InsertReview, type Post, type InsertPost,
  type CompanyWithRating
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // Auth
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>; // username is email
  createUser(user: InsertUser): Promise<User>;
  
  // Companies
  getCompanies(filters?: { search?: string, state?: string, category?: string }): Promise<CompanyWithRating[]>;
  getCompany(id: number): Promise<CompanyWithRating | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company | undefined>;
  
  // Reviews
  getReviews(companyId: number): Promise<(Review & { user: { email: string } })[]>;
  createReview(review: InsertReview): Promise<Review>;
  deleteReview(id: number): Promise<void>;
  
  // Posts
  getPosts(publishedOnly?: boolean): Promise<Post[]>;
  getPostBySlug(slug: string): Promise<Post | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post | undefined>;
  
  // Admin
  getUsers(): Promise<User[]>;
  toggleUserBlock(id: number, blocked: boolean): Promise<User | undefined>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getCompanies(filters?: { search?: string, state?: string, category?: string }): Promise<CompanyWithRating[]> {
    let conditions = [];
    if (filters?.state && filters.state !== "all") conditions.push(eq(companies.state, filters.state));
    if (filters?.category && filters.category !== "all") conditions.push(eq(companies.category, filters.category));
    // Simple search (case insensitive ideally, but exact for simplicity first or ilike)
    if (filters?.search) conditions.push(sql`lower(${companies.name}) LIKE lower(${'%' + filters.search + '%'})`);

    const result = await db.select({
        company: companies,
        avg: sql<number>`COALESCE(AVG(CASE WHEN ${reviews.deleted} = false THEN ${reviews.stars} END), 0)`,
        count: sql<number>`COUNT(CASE WHEN ${reviews.deleted} = false THEN ${reviews.id} END)`
      })
      .from(companies)
      .leftJoin(reviews, eq(companies.id, reviews.companyId))
      .where(and(...conditions))
      .groupBy(companies.id);

    return result.map(({ company, avg, count }) => ({
      ...company,
      averageRating: Number(avg),
      reviewCount: Number(count),
    }));
  }

  async getCompany(id: number): Promise<CompanyWithRating | undefined> {
    const [result] = await db.select({
        company: companies,
        avg: sql<number>`COALESCE(AVG(CASE WHEN ${reviews.deleted} = false THEN ${reviews.stars} END), 0)`,
        count: sql<number>`COUNT(CASE WHEN ${reviews.deleted} = false THEN ${reviews.id} END)`
      })
      .from(companies)
      .leftJoin(reviews, eq(companies.id, reviews.companyId))
      .where(eq(companies.id, id))
      .groupBy(companies.id);
      
    if (!result) return undefined;
    
    return {
      ...result.company,
      averageRating: Number(result.avg),
      reviewCount: Number(result.count),
    };
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const [company] = await db.insert(companies).values(insertCompany).returning();
    return company;
  }

  async updateCompany(id: number, update: Partial<InsertCompany>): Promise<Company | undefined> {
    const [company] = await db.update(companies).set(update).where(eq(companies.id, id)).returning();
    return company;
  }

  async getReviews(companyId: number): Promise<(Review & { user: { email: string } })[]> {
    const result = await db.select({
        review: reviews,
        userEmail: users.email
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(and(eq(reviews.companyId, companyId), eq(reviews.deleted, false)))
      .orderBy(desc(reviews.createdAt));
      
    return result.map(({ review, userEmail }) => ({
      ...review,
      user: { email: userEmail } // In a real app we'd map this to a username or alias
    }));
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    return review;
  }

  async deleteReview(id: number): Promise<void> {
    await db.update(reviews).set({ deleted: true }).where(eq(reviews.id, id));
  }

  async getPosts(publishedOnly: boolean = true): Promise<Post[]> {
    const conditions = [];
    if (publishedOnly) conditions.push(eq(posts.published, true));
    
    return await db.select().from(posts)
      .where(and(...conditions))
      .orderBy(desc(posts.createdAt));
  }

  async getPostBySlug(slug: string): Promise<Post | undefined> {
    const [post] = await db.select().from(posts).where(eq(posts.slug, slug));
    return post;
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const [post] = await db.insert(posts).values(insertPost).returning();
    return post;
  }

  async updatePost(id: number, update: Partial<InsertPost>): Promise<Post | undefined> {
    const [post] = await db.update(posts).set(update).where(eq(posts.id, id)).returning();
    return post;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async toggleUserBlock(id: number, blocked: boolean): Promise<User | undefined> {
    const [user] = await db.update(users).set({ blocked }).where(eq(users.id, id)).returning();
    return user;
  }
}

export const storage = new DatabaseStorage();
