import { db } from "./db";
import { products, productListings, categories, reviews } from "@shared/schema";

export async function seedDatabase() {
  try {
    console.log("Seeding database with sample data...");

    // Check if data already exists
    const existingProducts = await db.select().from(products).limit(1);
    if (existingProducts.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    // Insert categories
    const categoryData = [
      { name: "Electronics", slug: "electronics", icon: "smartphone", isPopular: true },
      { name: "Fashion", slug: "fashion", icon: "shirt", isPopular: true },
      { name: "Home & Garden", slug: "home-garden", icon: "home", isPopular: true },
      { name: "Books", slug: "books", icon: "book", isPopular: false },
      { name: "Sports", slug: "sports", icon: "dumbbell", isPopular: true },
      { name: "Gaming", slug: "gaming", icon: "gamepad", isPopular: true },
    ];

    await db.insert(categories).values(categoryData);

    // Insert products
    const productData = [
      {
        name: "ASUS VivoBook 14",
        description: "14-inch laptop with Intel Core i5, 8GB RAM, 512GB SSD",
        category: "Electronics",
        brand: "ASUS",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop"
      },
      {
        name: "Samsung Galaxy S24",
        description: "Latest flagship smartphone with AI features and 50MP camera",
        category: "Electronics",
        brand: "Samsung",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop"
      },
      {
        name: "Nike Air Max 270",
        description: "Comfortable running shoes with Air Max technology",
        category: "Fashion",
        brand: "Nike",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop"
      },
      {
        name: "iPhone 15 Pro",
        description: "Premium smartphone with titanium design and A17 Pro chip",
        category: "Electronics",
        brand: "Apple",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop"
      },
      {
        name: "Sony WH-1000XM5",
        description: "Wireless noise-canceling headphones with premium sound quality",
        category: "Electronics",
        brand: "Sony",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop"
      },
      {
        name: "Adidas Ultraboost 22",
        description: "High-performance running shoes with Boost technology",
        category: "Fashion",
        brand: "Adidas",
        image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=300&fit=crop"
      }
    ];

    const insertedProducts = await db.insert(products).values(productData).returning();

    // Insert product listings for each product
    for (const product of insertedProducts) {
      const platforms = ["amazon", "flipkart", "myntra", "meesho"];
      const basePrices = {
        "ASUS VivoBook 14": 45999,
        "Samsung Galaxy S24": 79999,
        "Nike Air Max 270": 8999,
        "iPhone 15 Pro": 134900,
        "Sony WH-1000XM5": 29990,
        "Adidas Ultraboost 22": 16999
      };

      const basePrice = basePrices[product.name as keyof typeof basePrices] || 10000;

      const listingData = platforms.map((platform, index) => {
        const priceVariation = (Math.random() - 0.5) * 0.2; // ±10% price variation
        const currentPrice = Math.round(basePrice * (1 + priceVariation));
        const originalPrice = Math.round(currentPrice * (1 + Math.random() * 0.3)); // 0-30% discount

        return {
          productId: product.id,
          platform,
          platformProductId: `${platform}_${product.id}_${index}`,
          url: `https://${platform}.com/product/${product.id}`,
          price: currentPrice.toString(),
          originalPrice: originalPrice.toString(),
          shippingDays: Math.floor(Math.random() * 7) + 1,
          shippingCost: Math.random() > 0.5 ? "0" : Math.floor(Math.random() * 200).toString(),
          inStock: true,
          rating: (3.5 + Math.random() * 1.5).toFixed(1),
          reviewCount: Math.floor(Math.random() * 5000) + 100,
          features: [
            "Free delivery",
            "1 year warranty",
            "Easy returns",
            platform === "flipkart" ? "Flipkart Assured" : 
            platform === "amazon" ? "Amazon's Choice" :
            platform === "myntra" ? "Myntra Insider" : "Meesho Guarantee"
          ]
        };
      });

      const insertedListings = await db.insert(productListings).values(listingData).returning();

      // Insert sample reviews for each listing
      for (const listing of insertedListings) {
        const reviewData = [
          {
            productListingId: listing.id,
            reviewText: "Great product, exactly as described. Fast delivery and good packaging.",
            rating: 5,
            reviewerName: "Verified Buyer",
            sentiment: "positive",
            helpful: true
          },
          {
            productListingId: listing.id,
            reviewText: "Good value for money. Minor issues but overall satisfied.",
            rating: 4,
            reviewerName: "Customer",
            sentiment: "positive",
            helpful: true
          },
          {
            productListingId: listing.id,
            reviewText: "Average product. Could be better for the price.",
            rating: 3,
            reviewerName: "User123",
            sentiment: "neutral",
            helpful: false
          }
        ];

        await db.insert(reviews).values(reviewData);
      }
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}