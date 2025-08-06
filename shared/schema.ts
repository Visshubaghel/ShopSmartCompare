import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  image: text("image"),
  brand: text("brand"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productListings = pgTable("product_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productId: varchar("product_id").notNull().references(() => products.id),
  platform: text("platform").notNull(), // 'amazon', 'flipkart', 'myntra', 'meesho'
  platformProductId: text("platform_product_id").notNull(),
  url: text("url").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  shippingDays: integer("shipping_days"),
  shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }),
  inStock: boolean("in_stock").default(true),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  reviewCount: integer("review_count").default(0),
  features: jsonb("features").$type<string[]>(),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productListingId: varchar("product_listing_id").notNull().references(() => productListings.id),
  reviewText: text("review_text").notNull(),
  rating: integer("rating").notNull(),
  reviewerName: text("reviewer_name"),
  sentiment: text("sentiment"), // 'positive', 'negative', 'neutral'
  helpful: boolean("helpful").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comparisons = pgTable("comparisons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  productId: varchar("product_id").notNull().references(() => products.id),
  selectedListings: jsonb("selected_listings").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
  description: text("description"),
  isPopular: boolean("is_popular").default(false),
});

// Relations
export const productsRelations = relations(products, ({ many }) => ({
  listings: many(productListings),
  comparisons: many(comparisons),
}));

export const productListingsRelations = relations(productListings, ({ one, many }) => ({
  product: one(products, {
    fields: [productListings.productId],
    references: [products.id],
  }),
  reviews: many(reviews),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  listing: one(productListings, {
    fields: [reviews.productListingId],
    references: [productListings.id],
  }),
}));

export const comparisonsRelations = relations(comparisons, ({ one }) => ({
  user: one(users, {
    fields: [comparisons.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [comparisons.productId],
    references: [products.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertProductListingSchema = createInsertSchema(productListings).omit({
  id: true,
  lastUpdated: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertComparisonSchema = createInsertSchema(comparisons).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type ProductListing = typeof productListings.$inferSelect;
export type InsertProductListing = z.infer<typeof insertProductListingSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type Comparison = typeof comparisons.$inferSelect;
export type InsertComparison = z.infer<typeof insertComparisonSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
