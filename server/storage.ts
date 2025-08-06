import { 
  products, 
  productListings, 
  reviews, 
  comparisons, 
  categories,
  type Product, 
  type InsertProduct,
  type ProductListing,
  type InsertProductListing,
  type Review,
  type InsertReview,
  type Comparison,
  type InsertComparison,
  type Category,
  type InsertCategory
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql, and, ilike } from "drizzle-orm";

export interface IStorage {
  // Products
  getProducts(limit?: number): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductByName(name: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  searchProducts(query: string): Promise<Product[]>;

  // Product Listings
  getProductListings(productId: string): Promise<ProductListing[]>;
  getProductListing(id: string): Promise<ProductListing | undefined>;
  createProductListing(listing: InsertProductListing): Promise<ProductListing>;
  updateProductListing(id: string, listing: Partial<ProductListing>): Promise<ProductListing | undefined>;

  // Reviews
  getReviewsForListing(listingId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Comparisons
  getComparison(id: string): Promise<Comparison | undefined>;
  createComparison(comparison: InsertComparison): Promise<Comparison>;
  getUserComparisons(userId: string): Promise<Comparison[]>;

  // Categories
  getCategories(): Promise<Category[]>;
  getPopularCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
}

export class DatabaseStorage implements IStorage {
  // Products
  async getProducts(limit = 50): Promise<Product[]> {
    return await db.select().from(products).limit(limit).orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductByName(name: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.name, name));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async searchProducts(query: string): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(
        sql`${products.name} ILIKE ${`%${query}%`} OR ${products.description} ILIKE ${`%${query}%`} OR ${products.brand} ILIKE ${`%${query}%`}`
      )
      .limit(20);
  }

  // Product Listings
  async getProductListings(productId: string): Promise<ProductListing[]> {
    return await db
      .select()
      .from(productListings)
      .where(eq(productListings.productId, productId))
      .orderBy(productListings.price);
  }

  async getProductListing(id: string): Promise<ProductListing | undefined> {
    const [listing] = await db.select().from(productListings).where(eq(productListings.id, id));
    return listing || undefined;
  }

  async createProductListing(listing: InsertProductListing): Promise<ProductListing> {
    const [newListing] = await db
      .insert(productListings)
      .values(listing)
      .returning();
    return newListing;
  }

  async updateProductListing(id: string, listing: Partial<ProductListing>): Promise<ProductListing | undefined> {
    const [updated] = await db
      .update(productListings)
      .set({ ...listing, lastUpdated: new Date() })
      .where(eq(productListings.id, id))
      .returning();
    return updated || undefined;
  }

  // Reviews
  async getReviewsForListing(listingId: string): Promise<Review[]> {
    return await db
      .select()
      .from(reviews)
      .where(eq(reviews.productListingId, listingId))
      .orderBy(desc(reviews.createdAt))
      .limit(10);
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db
      .insert(reviews)
      .values(review)
      .returning();
    return newReview;
  }

  // Comparisons
  async getComparison(id: string): Promise<Comparison | undefined> {
    const [comparison] = await db.select().from(comparisons).where(eq(comparisons.id, id));
    return comparison || undefined;
  }

  async createComparison(comparison: InsertComparison): Promise<Comparison> {
    const [newComparison] = await db
      .insert(comparisons)
      .values(comparison)
      .returning();
    return newComparison;
  }

  async getUserComparisons(userId: string): Promise<Comparison[]> {
    return await db
      .select()
      .from(comparisons)
      .where(eq(comparisons.userId, userId))
      .orderBy(desc(comparisons.createdAt));
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async getPopularCategories(): Promise<Category[]> {
    return await db
      .select()
      .from(categories)
      .where(eq(categories.isPopular, true))
      .orderBy(categories.name);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }
}

export const storage = new DatabaseStorage();
