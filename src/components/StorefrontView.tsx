import React, { useState, useMemo } from 'react';
import { 
  Product, 
  ProductCategory, 
  UserPersona, 
  RecommendationResult, 
  RatingMatrix,
  InteractionEvent
} from '../types/recsys';
import { CATEGORIES } from '../data/mockData';
import { ProductCard } from './ProductCard';
import { 
  generateRecommendations, 
  FeatureWeights, 
  DEFAULT_FEATURE_WEIGHTS 
} from '../utils/recsysEngine';
import { 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  ArrowRight, 
  Layers, 
  UserCheck, 
  AlertCircle,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface StorefrontViewProps {
  products: Product[];
  activeUser: UserPersona;
  allUsers: UserPersona[];
  onSelectUser: (user: UserPersona) => void;
  matrix: RatingMatrix;
  events: InteractionEvent[];
  onRateProduct: (productId: string, rating: number) => void;
  onAddToCart: (product: Product) => void;
  onOpenQuickView: (product: Product, rec?: RecommendationResult) => void;
  onExplainProduct: (product: Product, rec?: RecommendationResult) => void;
  onSwitchToLab: (tab: 'collaborative' | 'content_based' | 'pipeline' | 'behavior') => void;
}

export const StorefrontView: React.FC<StorefrontViewProps> = ({
  products,
  activeUser,
  allUsers,
  onSelectUser,
  matrix,
  events,
  onRateProduct,
  onAddToCart,
  onOpenQuickView,
  onExplainProduct,
  onSwitchToLab
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAlgorithm, setActiveAlgorithm] = useState<'hybrid' | 'collaborative_user' | 'collaborative_item' | 'content_based'>('hybrid');
  const [diversityWeight, setDiversityWeight] = useState(0.25);

  const userRatings = matrix[activeUser.id] || {};

  // Find the user's most recent interaction or top rated product for "Because You Liked..."
  const topRatedProduct = useMemo(() => {
    const ratedEntries = Object.entries(userRatings);
    if (ratedEntries.length > 0) {
      ratedEntries.sort((a, b) => b[1] - a[1]);
      return products.find(p => p.id === ratedEntries[0][0]);
    }
    // Check recent view events
    const userEvents = events.filter(e => e.userId === activeUser.id);
    if (userEvents.length > 0) {
      const lastEvent = userEvents[userEvents.length - 1];
      return products.find(p => p.id === lastEvent.productId);
    }
    return undefined;
  }, [userRatings, events, activeUser.id, products]);

  // Primary Personalized Recommendation Shelf
  const primaryRecommendations = useMemo(() => {
    return generateRecommendations(
      activeUser.id,
      activeAlgorithm,
      matrix,
      events,
      products,
      {
        topK: 4,
        diversityWeight,
        excludeInteracted: true
      }
    );
  }, [activeUser.id, activeAlgorithm, matrix, events, products, diversityWeight]);

  // Secondary Content-Based Shelf ("Because you liked X")
  const contentBasedShelf = useMemo(() => {
    if (!topRatedProduct) return [];
    return generateRecommendations(
      activeUser.id,
      'content_based',
      matrix,
      events,
      products,
      {
        topK: 4,
        referenceProductId: topRatedProduct.id,
        excludeInteracted: true
      }
    );
  }, [activeUser.id, topRatedProduct, matrix, events, products]);

  // Tertiary Item-Item Collaborative Shelf ("Customers Also Bought")
  const itemItemShelf = useMemo(() => {
    return generateRecommendations(
      activeUser.id,
      'collaborative_item',
      matrix,
      events,
      products,
      {
        topK: 4,
        excludeInteracted: true
      }
    );
  }, [activeUser.id, matrix, events, products]);

  // Filtered Catalog
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch = searchQuery.trim() === '' || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. Campaign Hero Showcase Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 text-white p-8 sm:p-12">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <Cpu className="w-4 h-4" />
            <span>Real-Time E-Commerce Recommendation Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-white text-balance leading-tight">
            Curated Acoustics &amp; Workspace Architecture.
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Experience how modern collaborative filtering, vector cosine matching, and dynamic event telemetry adapt catalog rankings in real time as you browse, rate, and cart products.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSwitchToLab('collaborative')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Explore Matrix Math</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onSwitchToLab('behavior')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            >
              Consumer Behavior Impact
            </button>
          </div>
        </div>
      </section>

      {/* 2. Active Persona Telemetry Bar */}
      <section className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
              {activeUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Active Persona: {activeUser.name}
                </h3>
                {activeUser.isColdStart ? (
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    &middot; Cold-Start Visitor (0 Prior Ratings)
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    &middot; {Object.keys(userRatings).length} explicit ratings &middot; {activeUser.title}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                {activeUser.bio}
              </p>
            </div>
          </div>

          {/* Quick Persona Selector Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 mr-1 hidden lg:inline">Switch Persona:</span>
            {allUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => onSelectUser(u)}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  activeUser.id === u.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {u.name.split(' ')[0]} {u.isColdStart ? '(Cold)' : ''}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Personalized Recommendation Shelf with Algorithm Controls */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Personalized For You</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-display mt-1">
              Recommended for {activeUser.name.split(' ')[0]}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Powered by real-time ranking algorithms. Try changing the algorithm below to inspect differences!
            </p>
          </div>

          {/* Algorithm Mode Switcher & Diversity Slider */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Algorithm Switcher */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                onClick={() => setActiveAlgorithm('hybrid')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeAlgorithm === 'hybrid'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Combines Collaborative Filtering and Content-Based matching with cold-start fallbacks"
              >
                Hybrid Ensemble
              </button>
              <button
                onClick={() => setActiveAlgorithm('collaborative_user')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeAlgorithm === 'collaborative_user'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="User-User Pearson correlation based on co-rated item similarities"
              >
                User-User CF
              </button>
              <button
                onClick={() => setActiveAlgorithm('collaborative_item')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeAlgorithm === 'collaborative_item'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Item-Item adjusted cosine similarity across item rating patterns"
              >
                Item-Item CF
              </button>
              <button
                onClick={() => setActiveAlgorithm('content_based')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  activeAlgorithm === 'content_based'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Vector cosine similarity between user taste vector and candidate product features"
              >
                Content-Based
              </button>
            </div>

            {/* Diversity Slider */}
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span>Diversity MMR:</span>
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.1"
                value={diversityWeight}
                onChange={(e) => setDiversityWeight(parseFloat(e.target.value))}
                className="w-16 h-1 accent-indigo-600 cursor-pointer"
                title="Maximal Marginal Relevance penalty for repetitive categories"
              />
              <span className="font-mono text-slate-700 dark:text-slate-300 w-6">
                {(diversityWeight * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        {/* Cold Start Notice if user has no interactions */}
        {activeUser.isColdStart && Object.keys(userRatings).length === 0 && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-300">
              <span className="font-bold block mb-0.5">Cold-Start State Active</span>
              Since {activeUser.name} has zero ratings and interaction history, pure Collaborative Filtering cannot calculate neighbor overlap ($K=0$). The Hybrid Engine smoothly falls back to catalog popularity and domain baseline features. Rate any item below to immediately seed their profile!
            </div>
          </div>
        )}

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {primaryRecommendations.map((rec) => (
            <ProductCard
              key={rec.product.id}
              product={rec.product}
              recommendation={rec}
              userRating={userRatings[rec.product.id]}
              onRate={(val) => onRateProduct(rec.product.id, val)}
              onAddToCart={onAddToCart}
              onQuickView={(p) => onOpenQuickView(p, rec)}
              onExplain={(p, r) => onExplainProduct(p, r)}
            />
          ))}
        </div>
      </section>

      {/* 4. Secondary Shelf: "Because You Viewed / Liked [Item]" (Content-Based) */}
      {topRatedProduct && contentBasedShelf.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>Vector Cosine Affinity</span>
                <span aria-hidden="true">&middot;</span>
                <span>Content-Based Filtering</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Because You Interacted with &ldquo;{topRatedProduct.name}&rdquo;
              </h3>
            </div>
            <button
              onClick={() => onSwitchToLab('content_based')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Inspect Vector Spaces</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contentBasedShelf.map((rec) => (
              <ProductCard
                key={rec.product.id}
                product={rec.product}
                recommendation={rec}
                userRating={userRatings[rec.product.id]}
                onRate={(val) => onRateProduct(rec.product.id, val)}
                onAddToCart={onAddToCart}
                onQuickView={(p) => onOpenQuickView(p, rec)}
                onExplain={(p, r) => onExplainProduct(p, r)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 5. Tertiary Shelf: "Customers Also Bought" (Item-Item Collaborative Filtering) */}
      {itemItemShelf.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>Item-Item Adjusted Cosine</span>
                <span aria-hidden="true">&middot;</span>
                <span>Amazon-Style Association</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Frequently Paired &amp; Co-Purchased
              </h3>
            </div>
            <button
              onClick={() => onSwitchToLab('collaborative')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Inspect Item Co-ratings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {itemItemShelf.map((rec) => (
              <ProductCard
                key={rec.product.id}
                product={rec.product}
                recommendation={rec}
                userRating={userRatings[rec.product.id]}
                onRate={(val) => onRateProduct(rec.product.id, val)}
                onAddToCart={onAddToCart}
                onQuickView={(p) => onOpenQuickView(p, rec)}
                onExplain={(p, r) => onExplainProduct(p, r)}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. Full Catalog Exploration with Search & Filter Tabs */}
      <section className="space-y-6 pt-10 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
              Browse Entire Catalog ({products.length} Products)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Rate or click any item to instantly generate explicit and implicit training data.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search gear, tags, specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Category Segmented Controls (Interactive Filter Buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'All'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Products ({products.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              userRating={userRatings[p.id]}
              onRate={(val) => onRateProduct(p.id, val)}
              onAddToCart={onAddToCart}
              onQuickView={(prod) => onOpenQuickView(prod)}
            />
          ))}
        </div>
      </section>

    </div>
  );
};
