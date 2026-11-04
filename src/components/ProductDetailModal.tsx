import React, { useState } from 'react';
import { Product, RecommendationResult, UserPersona } from '../types/recsys';
import { getProductIcon } from './ProductCard';
import { 
  X, 
  Star, 
  ShoppingCart, 
  Clock, 
  Check, 
  Sparkles, 
  Users, 
  SlidersHorizontal, 
  Tag
} from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  recommendation?: RecommendationResult;
  activeUser: UserPersona;
  userRating?: number;
  onRate: (productId: string, rating: number) => void;
  onAddToCart: (product: Product) => void;
  onSimulateDwell: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  recommendation,
  activeUser,
  userRating,
  onRate,
  onAddToCart,
  onSimulateDwell
}) => {
  const [dwellSimulated, setDwellSimulated] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleDwell = () => {
    onSimulateDwell(product.id);
    setDwellSimulated(true);
    setTimeout(() => setDwellSimulated(false), 3000);
  };

  const handleAdd = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-white/80 dark:bg-slate-800/80 rounded-full backdrop-blur-xs transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Visual Showcase & Spec Table */}
          <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-950/50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
            {/* Visual Header */}
            <div>
              <div 
                className={`relative w-full h-64 rounded-xl bg-gradient-to-br ${product.bgGradient} flex items-center justify-center p-6 shadow-inner overflow-hidden mb-6`}
              >
                <div 
                  className="w-32 h-32 rounded-3xl flex items-center justify-center shadow-2xl border border-white/20 backdrop-blur-xs"
                  style={{ backgroundColor: `${product.accentColor}30` }}
                >
                  {getProductIcon(product.iconName, "w-16 h-16 text-white")}
                </div>
                <div className="absolute top-4 left-4 text-xs font-semibold uppercase tracking-wider text-white/80">
                  {product.brand}
                </div>
              </div>

              {/* Technical Specifications Sheet */}
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Hardware Specifications
              </h4>
              <div className="space-y-2 text-xs">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-slate-800/60">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">{key}</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags list */}
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
              {product.tags.map(t => (
                <span key={t} className="inline-flex items-center gap-1">
                  <Tag className="w-3 h-3 text-slate-400" />
                  <span>#{t}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module & Recommendation Intelligence */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span className="font-medium uppercase tracking-wider">{product.category}</span>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{product.rating.toFixed(1)}</span>
                  <span>({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Product Title */}
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display tracking-tight">
                {product.name}
              </h2>

              {/* Price Banner */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  ${product.price}
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  In Stock &middot; Immediate Dispatch
                </span>
              </div>

              {/* Full Description */}
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description}
              </p>

              {/* Recommendation Rationale Intelligence Box */}
              <div className="mt-6 p-4 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                    Recommendation Engine Explainability
                  </span>
                </div>
                
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {recommendation?.reason || `Synthesized for ${activeUser.name} based on category affinity (${product.category}) and collaborative cluster signals.`}
                </p>

                {recommendation?.metrics && (
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-indigo-200/50 dark:border-indigo-900/50">
                    {recommendation.metrics.contentCosine !== undefined && (
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block">Vector Cosine Similarity</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {(recommendation.metrics.contentCosine * 100).toFixed(1)}%
                        </span>
                      </div>
                    )}
                    {recommendation.metrics.cfScore !== undefined && (
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block">Predicted CF Rating</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {recommendation.metrics.cfScore.toFixed(2)} / 5.0
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Interactive Rating Input */}
              <div className="mt-6 p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                    Your Rating as {activeUser.name}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Provides explicit training signal to Collaborative Filtering
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => onRate(product.id, star)}
                      className="p-1 hover:scale-110 transition-transform"
                      title={`Rate ${star} stars`}
                    >
                      <Star 
                        className={`w-5 h-5 ${
                          userRating && userRating >= star 
                            ? 'fill-amber-400 text-amber-400' 
                            : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions: Simulate Implicit Signal & Add to Cart */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                {/* Dwell Simulation Button */}
                <button
                  onClick={handleDwell}
                  disabled={dwellSimulated}
                  className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                    dwellSimulated
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 text-emerald-700 dark:text-emerald-300'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                  }`}
                  title="Simulate 30-second dwell time to generate an implicit event signal (weight: 1.5)"
                >
                  {dwellSimulated ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Logged 30s Dwell</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Simulate Dwell Event</span>
                    </>
                  )}
                </button>

                {/* Add to Cart Primary CTA */}
                <button
                  onClick={handleAdd}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs ${
                    added
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart &middot; ${product.price}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <span className="text-[11px] text-slate-400">
                  Every click, rating, and dwell updates the live collaborative &amp; content-based matrices.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
