import React, { useState, useMemo } from 'react';
import { Product, UserPersona, RatingMatrix, InteractionEvent } from '../types/recsys';
import { 
  FeatureWeights, 
  DEFAULT_FEATURE_WEIGHTS, 
  computeContentBasedScore 
} from '../utils/recsysEngine';
import { 
  Sliders, 
  Layers, 
  Tag, 
  Sparkles, 
  Compass, 
  ArrowRight, 
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface ContentBasedViewProps {
  products: Product[];
  activeUser: UserPersona;
  matrix: RatingMatrix;
  events: InteractionEvent[];
  featureWeights: FeatureWeights;
  onUpdateWeights: (weights: FeatureWeights) => void;
}

export const ContentBasedView: React.FC<ContentBasedViewProps> = ({
  products,
  activeUser,
  matrix,
  events,
  featureWeights,
  onUpdateWeights
}) => {
  const [selectedProdA, setSelectedProdA] = useState<string>(products[0].id);
  const [selectedProdB, setSelectedProdB] = useState<string>(products[1].id);

  const userRatings = matrix[activeUser.id] || {};

  // Build aggregated user interaction weights
  const userInteractions = useMemo(() => {
    const weights: Record<string, number> = { ...userRatings };
    events.filter(e => e.userId === activeUser.id).forEach(e => {
      weights[e.productId] = Math.max(weights[e.productId] || 0, e.implicitScore);
    });
    return weights;
  }, [userRatings, events, activeUser.id]);

  // Compute rank-ordered content matches for active user
  const contentRankings = useMemo(() => {
    return products.map(product => {
      const match = computeContentBasedScore(userInteractions, product, products, featureWeights);
      return {
        product,
        score: match.score,
        topFeature: match.topMatchingFeature,
        breakdown: match.breakdown
      };
    }).sort((a, b) => b.score - a.score);
  }, [products, userInteractions, featureWeights]);

  // Compare two selected products
  const productA = products.find(p => p.id === selectedProdA) || products[0];
  const productB = products.find(p => p.id === selectedProdB) || products[1];

  const pairwiseComparison = useMemo(() => {
    return computeContentBasedScore({ [productA.id]: 5 }, productB, products, featureWeights);
  }, [productA, productB, products, featureWeights]);

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4" />
          <span>Stage 03 &middot; Vector Space Modeling</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          Content-Based Filtering &amp; Attribute Vector Lab
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Content-Based Filtering recommends items by computing multidimensional vector proximity between a user&apos;s synthesized taste profile and candidate item attributes (TF-IDF tags, categories, design styles, and price elasticity).
        </p>
      </div>

      {/* 2. Mathematical Vector Theory */}
      <section className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-white space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-display text-white">
            Vector Space Model (VSM) &amp; Cosine Affinity Formulation
          </h2>
          <span className="text-xs text-indigo-400 font-mono">Normalized High-Dimensional Feature Space</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
            <span className="text-indigo-400 font-bold font-mono block">1. Item Vector v_i</span>
            <p className="text-slate-300 leading-relaxed">
              Every item is represented as a composite vector v_i = [w_cat, w_tag1..n, w_style, w_price] derived from metadata and TF-IDF tokenization.
            </p>
          </div>

          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
            <span className="text-cyan-400 font-bold font-mono block">2. User Taste Vector u</span>
            <p className="text-slate-300 leading-relaxed">
              Synthesized by taking the weighted sum of vectors of all items user u interacted with: u = &Sigma; (r_ui &middot; v_i) / ||&Sigma; (r_ui &middot; v_i)||.
            </p>
          </div>

          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-2">
            <span className="text-emerald-400 font-bold font-mono block">3. Cosine Proximity</span>
            <p className="text-slate-300 leading-relaxed font-mono">
              cos(&theta;) = (u &middot; v_i) / (||u|| ||v_i||)
            </p>
            <p className="text-[11px] text-slate-400">
              Measures the angle between taste and candidate attributes regardless of magnitude.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Interactive Feature Weight Tuner */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Real-Time Attribute Weight Tuner
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Adjust the algorithmic importance of different content dimensions and observe real-time rank adjustments below.
            </p>
          </div>

          <button
            onClick={() => onUpdateWeights(DEFAULT_FEATURE_WEIGHTS)}
            className="text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Reset to Default Weights
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Category Weight */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Category Weight</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                {(featureWeights.category * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={featureWeights.category}
              onChange={(e) => onUpdateWeights({ ...featureWeights, category: parseFloat(e.target.value) })}
              className="w-full h-1.5 accent-indigo-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">
              Enforces strict taxonomic genre alignment
            </span>
          </div>

          {/* Tags Weight */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Tags &amp; Specs Weight</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                {(featureWeights.tags * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={featureWeights.tags}
              onChange={(e) => onUpdateWeights({ ...featureWeights, tags: parseFloat(e.target.value) })}
              className="w-full h-1.5 accent-indigo-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">
              TF-IDF keywords (aluminum, hifi, ergonomic)
            </span>
          </div>

          {/* Style Weight */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Aesthetic / Style</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                {(featureWeights.style * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={featureWeights.style}
              onChange={(e) => onUpdateWeights({ ...featureWeights, style: parseFloat(e.target.value) })}
              className="w-full h-1.5 accent-indigo-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">
              Minimalist, artisanal, luxury profile
            </span>
          </div>

          {/* Price Weight */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Price Elasticity Match</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">
                {(featureWeights.price * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={featureWeights.price}
              onChange={(e) => onUpdateWeights({ ...featureWeights, price: parseFloat(e.target.value) })}
              className="w-full h-1.5 accent-indigo-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">
              Aligns with user willingness-to-pay bracket
            </span>
          </div>
        </div>
      </section>

      {/* 4. Active User Synthesized Profile & Ranked Matches */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Synthesized Taste Profile: {activeUser.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Generated from {Object.keys(userInteractions).length} explicit and implicit interaction signals.
            </p>
          </div>
        </div>

        {/* Content-Based Rankings Table */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Cosine Match Score</th>
                <th className="py-2.5 px-3">Top Matching Dimension</th>
                <th className="py-2.5 px-3">Category / Tag / Style / Price Breakdown</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {contentRankings.map((item, idx) => (
                <tr key={item.product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-bold text-slate-400">
                    #{idx + 1}
                  </td>
                  <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 dark:text-white">
                    {item.product.name}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-600 dark:text-slate-300">
                    {item.product.category}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                      {(item.score * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-500">
                    {item.topFeature}
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span title="Category similarity" className="text-indigo-600">C:{(item.breakdown.category * 100).toFixed(0)}%</span>
                      <span>&middot;</span>
                      <span title="Tag TF-IDF match" className="text-cyan-600">T:{(item.breakdown.tags * 100).toFixed(0)}%</span>
                      <span>&middot;</span>
                      <span title="Style affinity" className="text-amber-600">S:{(item.breakdown.style * 100).toFixed(0)}%</span>
                      <span>&middot;</span>
                      <span title="Price elasticity" className="text-emerald-600">P:{(item.breakdown.price * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Pairwise Item-to-Item Content Vector Comparison */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
            Pairwise Item-to-Item Vector Proximity
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compare two items in feature vector space to understand why &ldquo;Because you viewed X, you might like Y&rdquo; operates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
            <span className="text-xs text-slate-400 block mb-1">Source Item (X):</span>
            <select
              value={selectedProdA}
              onChange={(e) => setSelectedProdA(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} (${p.price} &middot; {p.category})</option>
              ))}
            </select>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
            <span className="text-xs text-slate-400 block mb-1">Target Item (Y):</span>
            <select
              value={selectedProdB}
              onChange={(e) => setSelectedProdB(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} (${p.price} &middot; {p.category})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Pairwise Result */}
        <div className="p-5 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
              Cosine Similarity between &ldquo;{productA.name}&rdquo; and &ldquo;{productB.name}&rdquo;:
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Top Alignment: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{pairwiseComparison.topMatchingFeature}</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Vector Affinity</span>
            <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
              {(pairwiseComparison.score * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </section>

      {/* 6. Trade-off Analysis */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Key Advantages of Content-Based Filtering</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
            <li><strong>Item Cold-Start Resilience:</strong> New products can be recommended immediately without waiting for any initial customer purchases or ratings.</li>
            <li><strong>High Explainability:</strong> Recommendations can be attributed to concrete physical attributes (&ldquo;Recommended because you bought 90mm planar headphones with open-back acoustic chambers&rdquo;).</li>
            <li><strong>Immunity to Popularity Bias:</strong> Niche, long-tail products with strong spec alignment have equal opportunity to be surfaced alongside bestsellers.</li>
          </ul>
        </div>

        <div className="p-6 bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Inherent Limitations &amp; Pitfalls</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed list-disc list-inside">
            <li><strong>The Serendipity / Filter Bubble Trap:</strong> Overspecialization prevents discovering products outside the user&apos;s established feature footprint (e.g. recommending only coffee gear to coffee lovers).</li>
            <li><strong>User Cold-Start Problem:</strong> For an anonymous visitor with no prior history, a taste vector cannot be synthesized without onboarding questions.</li>
            <li><strong>Feature Engineering Overhead:</strong> Demands rich, curated metadata, taxonomic ontologies, or multimodal neural embeddings for all catalog items.</li>
          </ul>
        </div>
      </section>

    </div>
  );
};
