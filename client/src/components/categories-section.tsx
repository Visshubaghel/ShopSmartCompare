import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Smartphone, 
  Shirt, 
  Home, 
  BookOpen, 
  Dumbbell, 
  Gamepad2,
  Car,
  Heart,
  Watch,
  Baby
} from "lucide-react";
import { api } from "@/lib/api";
import type { Category } from "@shared/schema";

const iconMap: Record<string, React.ComponentType<any>> = {
  smartphone: Smartphone,
  shirt: Shirt,
  home: Home,
  book: BookOpen,
  dumbbell: Dumbbell,
  gamepad: Gamepad2,
  car: Car,
  heart: Heart,
  watch: Watch,
  baby: Baby,
};

const defaultCategories = [
  { name: "Electronics", icon: "smartphone", gradient: "from-indigo-500 to-purple-500" },
  { name: "Fashion", icon: "shirt", gradient: "from-pink-500 to-rose-500" },
  { name: "Home & Garden", icon: "home", gradient: "from-green-500 to-emerald-500" },
  { name: "Books", icon: "book", gradient: "from-blue-500 to-cyan-500" },
  { name: "Sports", icon: "dumbbell", gradient: "from-purple-500 to-indigo-500" },
  { name: "Gaming", icon: "gamepad", gradient: "from-orange-500 to-red-500" },
];

export function CategoriesSection() {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['/api/categories/popular'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const displayCategories = categories && categories.length > 0 ? categories : defaultCategories;

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Categories
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Explore trending product categories
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-slate-700 rounded-2xl p-6 h-32"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Categories
            </h2>
            <p className="text-red-500 dark:text-red-400">
              Failed to load categories. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Popular Categories
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Explore trending product categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {displayCategories.map((category: Category | any, index: number) => {
            const iconKey = category.icon || defaultCategories[index % defaultCategories.length]?.icon || "smartphone";
            const IconComponent = iconMap[iconKey] || Smartphone;
            const gradient = category.gradient || defaultCategories[index % defaultCategories.length]?.gradient || "from-indigo-500 to-purple-500";

            return (
              <div key={category.id || index} className="group cursor-pointer">
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl hover:scale-105 transform transition-all duration-300 hover:shadow-xl border border-white/20 dark:border-slate-700/20">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
