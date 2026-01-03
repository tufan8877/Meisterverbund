import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { setupAuth, hashPassword } from "./auth";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import passport from "passport";

function requireAuth(req: Request, res: any, next: any) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized" });
}

function requireAdmin(req: Request, res: any, next: any) {
  if (req.isAuthenticated() && (req.user as any).role === 'admin') return next();
  res.status(403).json({ message: "Forbidden" });
}

async function seedDatabase() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@meisterverbund.at";
  const existingAdmin = await storage.getUserByUsername(adminEmail);
  
  if (!existingAdmin) {
    console.log("Seeding admin user...");
    const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD || "admin123");
    await storage.createUser({
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      blocked: false
    });
  }

  const existingCompanies = await storage.getCompanies();
  if (existingCompanies.length === 0) {
    console.log("Seeding companies...");
    await storage.createCompany({
      name: "Meisterbetrieb Müller",
      description: "Ihr Experte für Dach und Fach seit 1950. Wir bieten erstklassige Handwerksqualität.",
      category: "Dachdecker",
      address: "Handwerksstraße 1",
      city: "Wien",
      state: "Wien",
      phone: "+43 1 2345678",
      website: "https://example.com",
      isMasterVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e"
    });
    
    await storage.createCompany({
      name: "Tischlerei Huber",
      description: "Maßgefertigte Möbel aus Meisterhand. Küchen, Schränke und mehr.",
      category: "Tischler",
      address: "Holzweg 7",
      city: "Graz",
      state: "Steiermark",
      phone: "+43 316 123456",
      isMasterVerified: true,
      imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837"
    });
  }

  const existingPosts = await storage.getPosts(false);
  if (existingPosts.length === 0) {
    console.log("Seeding posts...");
    const admin = await storage.getUserByUsername(adminEmail);
    if (admin) {
      await storage.createPost({
        title: "Willkommen beim Meisterverbund",
        slug: "willkommen",
        contentMarkdown: "Wir freuen uns, Ihnen das neue Portal für österreichische Meisterbetriebe vorstellen zu dürfen.",
        type: "news",
        published: true,
        authorId: admin.id
      });
    }
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  setupAuth(app, storage);

  // Auth Routes
  app.post(api.auth.register.path, async (req, res, next) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existing = await storage.getUserByUsername(input.email);
      if (existing) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const hashedPassword = await hashPassword(input.password);
      const user = await storage.createUser({
        ...input,
        password: hashedPassword,
        role: "user" // Force user role for public registration
      });
      
      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        next(err);
      }
    }
  });

  app.post(api.auth.login.path, passport.authenticate("local"), (req, res) => {
    res.json(req.user);
  });

  app.post(api.auth.logout.path, (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get(api.auth.me.path, (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });

  // Companies Routes
  app.get(api.companies.list.path, async (req, res) => {
    const filters = {
      search: req.query.search as string,
      state: req.query.state as string,
      category: req.query.category as string,
    };
    const companies = await storage.getCompanies(filters);
    res.json(companies);
  });

  app.get(api.companies.get.path, async (req, res) => {
    const company = await storage.getCompany(Number(req.params.id));
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json(company);
  });

  app.post(api.companies.create.path, requireAdmin, async (req, res) => {
    try {
      const input = api.companies.create.input.parse(req.body);
      const company = await storage.createCompany(input);
      res.status(201).json(company);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
      throw err;
    }
  });

  app.put(api.companies.update.path, requireAdmin, async (req, res) => {
    try {
      const input = api.companies.update.input.parse(req.body);
      const company = await storage.updateCompany(Number(req.params.id), input);
      if (!company) return res.status(404).json({ message: "Company not found" });
      res.json(company);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
      throw err;
    }
  });

  // Reviews Routes
  app.get(api.reviews.list.path, async (req, res) => {
    const companyId = Number(req.query.companyId);
    if (!companyId) return res.status(400).json({ message: "companyId required" });
    const reviews = await storage.getReviews(companyId);
    res.json(reviews);
  });

  app.post(api.reviews.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.reviews.create.input.parse(req.body);
      
      // Check if user already reviewed this company? 
      // Simplified: Allow multiple for now or handled by frontend, strict rule: 1 per user/company logic can be added here
      
      const review = await storage.createReview({
        ...input,
        userId: (req.user as any).id,
        deleted: false
      });
      res.status(201).json(review);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
      throw err;
    }
  });
  
  app.delete(api.reviews.delete.path, requireAdmin, async (req, res) => {
    await storage.deleteReview(Number(req.params.id));
    res.sendStatus(200);
  });

  // Posts Routes
  app.get(api.posts.list.path, async (req, res) => {
    const publishedOnly = req.query.published !== 'false'; // Default to true unless explicitly false (and admin)
    // Actually, only admin should see unpublished.
    const isAdmin = req.isAuthenticated() && (req.user as any).role === 'admin';
    const posts = await storage.getPosts(!isAdmin); 
    res.json(posts);
  });

  app.get(api.posts.get.path, async (req, res) => {
    const post = await storage.getPostBySlug(req.params.slug);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  });

  app.post(api.posts.create.path, requireAdmin, async (req, res) => {
    try {
      const input = api.posts.create.input.parse(req.body);
      const post = await storage.createPost({
        ...input,
        authorId: (req.user as any).id
      });
      res.status(201).json(post);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
      throw err;
    }
  });

  app.put(api.posts.update.path, requireAdmin, async (req, res) => {
    try {
      const input = api.posts.update.input.parse(req.body);
      const post = await storage.updatePost(Number(req.params.id), input);
      if (!post) return res.status(404).json({ message: "Post not found" });
      res.json(post);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
      throw err;
    }
  });

  // Admin User Routes
  app.get(api.admin.users.path, requireAdmin, async (req, res) => {
    const users = await storage.getUsers();
    res.json(users);
  });

  app.patch(api.admin.toggleBlock.path, requireAdmin, async (req, res) => {
    const { blocked } = req.body;
    const user = await storage.toggleUserBlock(Number(req.params.id), blocked);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  });

  // Initialize data
  await seedDatabase();

  return httpServer;
}
