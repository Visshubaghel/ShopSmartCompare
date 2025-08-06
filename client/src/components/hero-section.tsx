import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <section className="pt-24 pb-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-indigo-400/20 to-purple-400/20 rounded-full animate-float"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 rounded-full animate-float-delayed"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-slide-up">
            Compare. Save. Shop Smarter.
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in">
            Find the best deals across Amazon, Flipkart, Myntra & Meesho. Compare prices, shipping, reviews, and ratings in one premium platform.
          </p>
          
          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-sm opacity-50"></div>
              <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-slate-700/20">
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                  <Input
                    type="text"
                    placeholder="Enter product name or paste URL..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                  <Button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-semibold hover:scale-105 transform transition-all duration-200 hover:shadow-lg"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Compare Now
                  </Button>
                </form>
              </div>
            </div>
          </div>

          {/* Platform Logos */}
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <span className="text-sm text-gray-500 dark:text-gray-400">Supported platforms:</span>
            <div className="flex space-x-6">
              <span className="text-2xl font-bold text-orange-500">Amazon</span>
              <span className="text-2xl font-bold text-blue-600">Flipkart</span>
              <span className="text-2xl font-bold text-pink-500">Myntra</span>
              <span className="text-2xl font-bold text-purple-600">Meesho</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
