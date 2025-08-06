import { apiRequest } from "./queryClient";
import type { Product, ProductListing, Review, Category } from "@shared/schema";

export const api = {
  // Products
  getProducts: async (limit?: number): Promise<Product[]> => {
    const url = limit ? `/api/products?limit=${limit}` : '/api/products';
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  searchProducts: async (query: string): Promise<Product[]> => {
    const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Failed to search products');
    return response.json();
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await fetch(`/api/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },

  // Product Listings
  getProductListings: async (productId: string): Promise<ProductListing[]> => {
    const response = await fetch(`/api/products/${productId}/listings`);
    if (!response.ok) throw new Error('Failed to fetch product listings');
    return response.json();
  },

  // Reviews
  getReviewsForListing: async (listingId: string): Promise<Review[]> => {
    const response = await fetch(`/api/listings/${listingId}/reviews`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    const response = await fetch('/api/categories');
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  getPopularCategories: async (): Promise<Category[]> => {
    const response = await fetch('/api/categories/popular');
    if (!response.ok) throw new Error('Failed to fetch popular categories');
    return response.json();
  },

  // Comparison
  compareProducts: async (productId: string, listingIds: string[]) => {
    const response = await fetch('/api/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, listingIds }),
    });
    if (!response.ok) throw new Error('Failed to create comparison');
    return response.json();
  },
};
