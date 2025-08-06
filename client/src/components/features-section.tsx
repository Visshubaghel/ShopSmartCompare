import { BarChart3, Truck, Star, Smartphone } from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Real-time Price Tracking",
    description: "Get instant notifications when prices drop across all platforms",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Truck,
    title: "Shipping Comparison",
    description: "Compare delivery times and costs across all platforms",
    gradient: "from-cyan-500 to-emerald-500",
  },
  {
    icon: Star,
    title: "Review Analytics",
    description: "Smart review analysis with sentiment scoring and highlights",
    gradient: "from-amber-500 to-yellow-500",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Perfect mobile experience with touch-friendly interactions",
    gradient: "from-red-500 to-pink-500",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose CompareIt?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Smart comparison features that save you time and money
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transform transition-all duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
