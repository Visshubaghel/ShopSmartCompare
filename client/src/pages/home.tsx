import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { ProductComparisonCard } from "@/components/product-comparison-card";
import { FeaturesSection } from "@/components/features-section";
import { CategoriesSection } from "@/components/categories-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Download, Search } from "lucide-react";
import { api } from "@/lib/api";
import type { Product, ProductListing } from "@shared/schema";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch products for demo
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['/api/products'],
    queryFn: () => api.getProducts(3),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch listings for selected product
  const { data: listings, isLoading: listingsLoading } = useQuery({
    queryKey: ['/api/products', selectedProduct?.id, 'listings'],
    queryFn: () => selectedProduct ? api.getProductListings(selectedProduct.id) : Promise.resolve([]),
    enabled: !!selectedProduct,
    staleTime: 2 * 60 * 1000,
  });

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['/api/products/search', searchQuery],
    queryFn: () => api.searchProducts(searchQuery),
    enabled: searchQuery.length >= 2,
    staleTime: 1 * 60 * 1000,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedProduct(null);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSearchQuery("");
  };

  const displayProducts = searchQuery ? searchResults : products;
  const isLoading = searchQuery ? searchLoading : productsLoading;

  const getBestDeal = (listings: ProductListing[]) => {
    if (!listings || listings.length === 0) return null;
    return listings.reduce((best, current) => 
      !best || parseFloat(current.price) < parseFloat(best.price) ? current : best
    );
  };

  const bestDeal = listings ? getBestDeal(listings) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navigation onSearch={handleSearch} />
      
      <HeroSection onSearch={handleSearch} />

      {/* Search Results or Product Comparison */}
      {searchQuery && (
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Search Results for "{searchQuery}"
            </h2>
            
            {isLoading ? (
              <div className="grid md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
                      <div className="h-48 bg-gray-200 dark:bg-slate-700 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : displayProducts && displayProducts.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                {displayProducts.map((product) => (
                  <Card 
                    key={product.id} 
                    className="cursor-pointer hover:shadow-lg transition-all duration-200"
                    onClick={() => handleProductSelect(product)}
                  >
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {product.description}
                      </p>
                      <Badge variant="secondary">{product.category}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Try searching with different keywords
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Product Comparison Section */}
      {selectedProduct && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Comparing: {selectedProduct.name}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Compare prices, shipping, reviews, and ratings across platforms
              </p>
            </div>

            {listingsLoading ? (
              <div className="grid md:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 dark:bg-slate-700 rounded-2xl h-96"></div>
                  </div>
                ))}
              </div>
            ) : listings && listings.length > 0 ? (
              <>
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                  {listings.map((listing) => (
                    <ProductComparisonCard
                      key={listing.id}
                      listing={listing}
                      productName={selectedProduct.name}
                      productImage={selectedProduct.image || undefined}
                      isRecommended={bestDeal?.id === listing.id}
                      onViewProduct={() => window.open(listing.url, '_blank')}
                    />
                  ))}
                </div>

                {bestDeal && (
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 px-6 py-3 rounded-full">
                      <span className="text-2xl">🏆</span>
                      <span className="font-semibold text-green-700 dark:text-green-400">
                        Best Deal: {bestDeal.platform} - ₹{parseFloat(bestDeal.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">📦</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No listings available
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We couldn't find this product on our supported platforms
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Demo Section (only show when no search/product selected) */}
      {!searchQuery && !selectedProduct && (
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Smart Product Comparison
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                See how we compare products across multiple platforms
              </p>
            </div>

            <div className="text-center py-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl">
              <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Start by searching for a product
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Enter a product name in the search bar above to see real-time comparisons
              </p>
              <Button 
                onClick={() => document.querySelector('input[placeholder*="Search"]')?.focus()}
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
              >
                Try searching now
              </Button>
            </div>
          </div>
        </section>
      )}

      <FeaturesSection />
      <CategoriesSection />

      {/* Call-to-Action Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Start Saving?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of smart shoppers who save money with CompareIt
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:scale-105 transform transition-all duration-200 hover:shadow-xl">
              <Search className="w-4 h-4 mr-2" />
              Start Comparing Now
            </Button>
            <Button 
              variant="outline"
              className="px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:scale-105 transform transition-all duration-200 border border-gray-200 dark:border-slate-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Download App
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-gray-200/20 dark:border-gray-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  CompareIt
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                The ultimate platform for smart e-commerce price comparison across India's top shopping sites.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li><a href="#" className="hover:text-indigo-500 transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-indigo-500 transition-colors">Price Alerts</a></li>
                <li><a href="#" className="hover:text-indigo-500 transition-colors">Mobile App</a></li>
                <li><a href="#" className="hover:text-indigo-500 transition-colors">Browser Extension</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li><a href="#" className="hover:text-indigo-500 transition-colors">Electronics</a></li>
                <li><a href="#" className="hover:text-indigo-500 transition-colors">Fashion</a></li>
                <li><a href="#" className="hover:text-indigo-500 transition-colors">Home & Garden</a></li>
                <li><a href="#" className="hover:text-indigo-500 transition-colors">Books & Media</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li><a href="#" className="hover:text-indigo-500 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-indigo-500 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-indigo-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-500 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              © 2024 CompareIt. All rights reserved. | Making smart shopping decisions easier.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          size="icon"
          className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow-lg hover:scale-110 transform transition-all duration-300 hover:shadow-xl animate-float"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
