import React from 'react';
import { Product, RecommendationResult } from '../types/recsys';
import { 
  Headphones, 
  Radio, 
  Keyboard, 
  Armchair, 
  Coffee, 
  Flame, 
  LayoutGrid, 
  Sun, 
  Layers, 
  Maximize2, 
  Sliders, 
  Activity, 
  Square, 
  Laptop, 
  Shield, 
  Moon,
  Star,
  ShoppingCart,
  Eye,
  Info
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  recommendation?: RecommendationResult;
  userRating?: number;
  onRate?: (rating: number) => void;
  onAddToCart?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
  onExplain?: (product: Product, rec?: RecommendationResult) => void;
}

export const getProductIcon = (iconName: string, className = "w-12 h-12 text-slate-300") => {
  switch (iconName) {
    case 'Headphones': return <Headphones className={className} />;
    case 'Radio': return <Radio className={className} />;
    case 'Keyboard': return <Keyboard className={className} />;
    case 'Armchair': return <Armchair className={className} />;
    case 'Coffee': return <Coffee className={className} />;
    case 'Flame': return <Flame className={className} />;
    case 'LayoutGrid': return <LayoutGrid className={className} />;
    case 'Sun': return <Sun className={className} />;
    case 'Layers': return <Layers className={className} />;
    case 'Maximize2': return <Maximize2 className={className} />;
    case 'Sliders': return <Sliders className={className} />;
    case 'Activity': return <Activity className={className} />;
    case 'Square': return <Square className={className} />;
    case 'Laptop': return <Laptop className={className} />;
    case 'Shield': return <Shield className={className} />;
    case 'Moon': return <Moon className={className} />;
    default: return <Sliders className={className} />;
  }
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  recommendation,
  userRating,
  onRate,
  onAddToCart,
  onQuickView,
  onExplain
}) => {
  return (
    <div className="group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* Product Image / Vector Hero Graphic */}
      <div 
        onClick={() => onQuickView?.(product)}
        className={`relative h-52 w-full bg-gradient-to-br ${product.bgGradient} flex items-center justify-center p-6 cursor-pointer overflow-hidden`}
      >
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* Central Graphic */}
        <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
          <div 
            className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-xl border border-white/10 backdrop-blur-xs"
            style={{ backgroundColor: `${product.accentColor}25` }}
          >
            {getProductIcon(product.iconName, "w-12 h-12 text-white")}
          </div>
        </div>

        {/* Brand Kicker */}
        <div className="absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-wider text-white/70">
          {product.brand}
        </div>

        {/* Quick View Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView?.(product);
          }}
          className="absolute bottom-3 right-3 px-3 py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white text-xs font-medium rounded-lg flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>
      </div>

      {/* Product Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row: Category and Rating (Clean unboxed text) */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="font-medium">{product.category}</span>
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">{product.rating.toFixed(1)}</span>
              <span className="text-slate-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onQuickView?.(product)}
            className="text-base font-semibold text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer line-clamp-1 transition-colors"
          >
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {product.shortDesc}
          </p>

          {/* Recommendation Match Rationale Banner (if present) */}
          {recommendation && (
            <div className="mt-3 p-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  {Math.round(recommendation.score * 100)}% Match
                </span>
                <button
                  onClick={() => onExplain?.(product, recommendation)}
                  className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-0.5"
                  title="View algorithm math and vector details"
                >
                  <Info className="w-3 h-3" />
                  <span>Why?</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate mt-0.5">
                {recommendation.reason}
              </p>
            </div>
          )}
        </div>

        {/* Footer: Price, User Star Rating, and Add to Cart */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-slate-400 block">Price</span>
            <span className="text-lg font-bold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              ${product.price}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Interactive Star Rating */}
            <div className="flex items-center gap-0.5" title="Rate this product to feed the recommendation engine">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => onRate?.(star)}
                  className="p-0.5 text-slate-300 dark:text-slate-600 hover:text-amber-400 transition-colors"
                >
                  <Star 
                    className={`w-3.5 h-3.5 ${
                      userRating && userRating >= star 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'hover:fill-amber-300'
                    }`} 
                  />
                </button>
              ))}
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={() => onAddToCart?.(product)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
