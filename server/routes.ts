import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertProductListingSchema, insertReviewSchema, insertCategorySchema } from "@shared/schema";
import { z } from "zod";
import { ValidationError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const products = await storage.getProducts(limit);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Search products
  app.get("/api/products/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.trim().length < 2) {
        return res.status(400).json({ message: "Search query must be at least 2 characters long" });
      }
      const products = await storage.searchProducts(query.trim());
      res.json(products);
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  // Get product by ID
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Create product
  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = ValidationError.fromZodError(error);
        return res.status(400).json({ message: validationError.toString() });
      }
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Get product listings
  app.get("/api/products/:id/listings", async (req, res) => {
    try {
      const listings = await storage.getProductListings(req.params.id);
      res.json(listings);
    } catch (error) {
      console.error("Error fetching product listings:", error);
      res.status(500).json({ message: "Failed to fetch product listings" });
    }
  });

  // Create product listing
  app.post("/api/products/:id/listings", async (req, res) => {
    try {
      const validatedData = insertProductListingSchema.parse({
        ...req.body,
        productId: req.params.id
      });
      const listing = await storage.createProductListing(validatedData);
      res.status(201).json(listing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = ValidationError.fromZodError(error);
        return res.status(400).json({ message: validationError.toString() });
      }
      console.error("Error creating product listing:", error);
      res.status(500).json({ message: "Failed to create product listing" });
    }
  });

  // Get reviews for a listing
  app.get("/api/listings/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviewsForListing(req.params.id);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  // Create review
  app.post("/api/listings/:id/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse({
        ...req.body,
        productListingId: req.params.id
      });
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = ValidationError.fromZodError(error);
        return res.status(400).json({ message: validationError.toString() });
      }
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Get categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get popular categories
  app.get("/api/categories/popular", async (req, res) => {
    try {
      const categories = await storage.getPopularCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching popular categories:", error);
      res.status(500).json({ message: "Failed to fetch popular categories" });
    }
  });

  // Create category
  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = ValidationError.fromZodError(error);
        return res.status(400).json({ message: validationError.toString() });
      }
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Compare products endpoint
  app.post("/api/compare", async (req, res) => {
    try {
      const { productId, listingIds } = req.body;
      
      if (!productId || !listingIds || !Array.isArray(listingIds)) {
        return res.status(400).json({ message: "Invalid comparison data" });
      }

      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const listings = await Promise.all(
        listingIds.map(async (id: string) => {
          const listing = await storage.getProductListing(id);
          if (!listing) return null;
          
          const reviews = await storage.getReviewsForListing(id);
          return { ...listing, reviews };
        })
      );

      const validListings = listings.filter(listing => listing !== null);
      
      res.json({
        product,
        listings: validListings,
        bestDeal: validListings.reduce((best, current) => 
          !best || parseFloat(current.price) < parseFloat(best.price) ? current : best
        , null)
      });
    } catch (error) {
      console.error("Error creating comparison:", error);
      res.status(500).json({ message: "Failed to create comparison" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
