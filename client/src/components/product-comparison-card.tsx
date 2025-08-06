import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Truck, RotateCcw, Shield, Tags, Crown, ExternalLink } from "lucide-react";
import type { ProductListing } from "@shared/schema";

interface ProductComparisonCardProps {
  listing: ProductListing;
  productName: string;
  productImage?: string;
  isRecommended?: boolean;
  onViewProduct?: () => void;
}

const platformConfig = {
  amazon: {
    name: "Amazon",
    color: "orange",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    textColor: "text-orange-600 dark:text-orange-400",
    gradient: "from-orange-500 to-orange-600",
    hoverGradient: "from-orange-400 to-orange-600",
  },
  flipkart: {
    name: "Flipkart",
    color: "blue",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-600 dark:text-blue-400",
    gradient: "from-blue-500 to-blue-600",
    hoverGradient: "from-blue-400 to-blue-600",
  },
  myntra: {
    name: "Myntra",
    color: "pink",
    bgColor: "bg-pink-100 dark:bg-pink-900/30",
    textColor: "text-pink-600 dark:text-pink-400",
    gradient: "from-pink-500 to-pink-600",
    hoverGradient: "from-pink-400 to-pink-600",
  },
  meesho: {
    name: "Meesho",
    color: "purple",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    textColor: "text-purple-600 dark:text-purple-400",
    gradient: "from-purple-500 to-purple-600",
    hoverGradient: "from-purple-400 to-purple-600",
  },
};

export function ProductComparisonCard({
  listing,
  productName,
  productImage,
  isRecommended = false,
  onViewProduct,
}: ProductComparisonCardProps) {
  const [imageError, setImageError] = useState(false);
  const config = platformConfig[listing.platform as keyof typeof platformConfig] || platformConfig.amazon;

  const formatPrice = (price: string) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const getShippingText = () => {
    if (!listing.shippingDays) return "Shipping info unavailable";
    if (listing.shippingDays === 1) return "Ships in 1 day";
    return `Ships in ${listing.shippingDays} days`;
  };

  const getShippingColor = () => {
    if (!listing.shippingDays) return "text-gray-500";
    if (listing.shippingDays <= 2) return "text-green-600 dark:text-green-400";
    if (listing.shippingDays <= 4) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="group relative">
      {isRecommended && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1">
            🏆 Best Deal
          </Badge>
        </div>
      )}
      
      <div className={`absolute inset-0 bg-gradient-to-r ${config.hoverGradient} rounded-2xl blur-sm opacity-0 group-hover:opacity-30 transition-all duration-300`}></div>
      
      <Card className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-2xl border border-white/20 dark:border-slate-700/20 hover:scale-105 transform transition-all duration-300 hover:shadow-2xl">
        <CardContent className="p-6">
          {/* Platform Badge */}
          <div className="flex justify-between items-start mb-4">
            <Badge className={`${config.bgColor} ${config.textColor} px-3 py-1 rounded-full text-sm font-medium`}>
              {config.name}
            </Badge>
            {listing.rating && (
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{parseFloat(listing.rating).toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Product Image */}
          <div className="w-full h-48 mb-4 bg-gray-100 dark:bg-slate-700 rounded-xl overflow-hidden">
            {productImage && !imageError ? (
              <img
                src={productImage}
                alt={productName}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-200 dark:bg-slate-600 rounded-lg"></div>
                  <span className="text-sm">No image</span>
                </div>
              </div>
            )}
          </div>

          {/* Product Title */}
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
            {productName}
          </h3>

          {/* Price & Shipping (Prominent Display) */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatPrice(listing.price)}
              </span>
              {listing.originalPrice && parseFloat(listing.originalPrice) > parseFloat(listing.price) && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(listing.originalPrice)}
                </span>
              )}
            </div>
            <div className={`flex items-center text-sm ${getShippingColor()}`}>
              <Truck className="w-4 h-4 mr-2" />
              <span>{getShippingText()}</span>
            </div>
          </div>

          {/* Reviews Section */}
          {listing.rating && listing.reviewCount && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Customer Reviews</span>
                <span className="text-sm text-gray-500">({listing.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center space-x-1 mb-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.floor(parseFloat(listing.rating || "0"))
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {parseFloat(listing.rating).toFixed(1)}/5
                </span>
              </div>
            </div>
          )}

          {/* Additional Features */}
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            {listing.shippingCost === null || parseFloat(listing.shippingCost || "0") === 0 ? (
              <div className="flex items-center">
                <Truck className="w-4 h-4 text-green-500 mr-2" />
                <span>Free shipping</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Truck className="w-4 h-4 text-orange-500 mr-2" />
                <span>Shipping: {formatPrice(listing.shippingCost || "0")}</span>
              </div>
            )}
            
            <div className="flex items-center">
              <RotateCcw className="w-4 h-4 text-blue-500 mr-2" />
              <span>
                {listing.platform === "flipkart" ? "7-day replacement" : "30-day returns"}
              </span>
            </div>

            {listing.platform === "myntra" && (
              <div className="flex items-center">
                <Crown className="w-4 h-4 text-yellow-500 mr-2" />
                <span>Myntra insider benefits</span>
              </div>
            )}

            {listing.platform === "flipkart" && (
              <div className="flex items-center">
                <Tags className="w-4 h-4 text-orange-500 mr-2" />
                <span>Bank offers available</span>
              </div>
            )}

            <div className="flex items-center">
              <Shield className="w-4 h-4 text-purple-500 mr-2" />
              <span>1-year warranty</span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={onViewProduct}
            className={`w-full py-3 bg-gradient-to-r ${config.gradient} text-white rounded-xl font-semibold hover:scale-105 transform transition-all duration-200 hover:shadow-lg`}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on {config.name}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
