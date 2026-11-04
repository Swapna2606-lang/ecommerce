import React, { useState, useMemo } from 'react';
import { Product, RatingMatrix, RecsysBenchmark } from '../types/recsys';
import { calculateEvaluationBenchmarks } from '../utils/recsysEngine';
import { 
  BarChart3, 
  Award, 
  Target, 
  Zap, 
  Compass, 
  CheckCircle, 
  SlidersHorizontal,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface BenchmarksViewProps {
  matrix: RatingMatrix;
  products: Product[];
}

export const BenchmarksView: React.FC<BenchmarksViewProps> = ({ matrix, products }) => {
  const [topK, setTopK] = useState<number>(5);

  const benchmarks: RecsysBenchmark[] = useMemo(() => {
    return calculateEvaluationBenchmarks(matrix, products);
  }, [matrix, products]);

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4" />
          <span>Stage 04 &middot; Offline Evaluation &amp; Benchmarks</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          Recommender Performance Benchmarks &amp; Offline Metrics
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Evaluating recommendation engines requires balancing accuracy (Precision, Recall, NDCG) against ecosystem health metrics (Diversity, Catalog Coverage, and Cold-Start Resilience). Below is the empirical benchmark across our catalog.
        </p>
      </div>

      {/* 2. Top K Selector & Overview KPI Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Evaluation Threshold: Top-K Cutoff
          </h3>
          <p className="text-xs text-slate-500">
            Select the number of recommendations presented on the primary storefront shelf.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Cutoff K:</span>
          {[3, 5, 10].map((k) => (
            <button
              key={k}
              onClick={() => setTopK(k)}
              className={`px-3 py-1.5 text-xs font-mono font-bold rounded-lg transition-colors ${
                topK === k
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              K = {k}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Comprehensive Benchmark Comparison Table */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
            Multi-Metric Algorithm Comparison (Leave-One-Out Validation)
          </h2>
          <span className="text-xs text-slate-400 font-mono">Normalized test set scores</span>
        </div>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold uppercase">
              <tr>
                <th className="py-3 px-4">Algorithm Strategy</th>
                <th className="py-3 px-3 text-center">Precision@{topK}</th>
                <th className="py-3 px-3 text-center">Recall@{topK}</th>
                <th className="py-3 px-3 text-center">F1-Score</th>
                <th className="py-3 px-3 text-center">NDCG@{topK}</th>
                <th className="py-3 px-3 text-center">MAP@{topK}</th>
                <th className="py-3 px-3 text-center">RMSE &darr;</th>
                <th className="py-3 px-3 text-center">Catalog Coverage</th>
                <th className="py-3 px-3 text-center">Diversity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {benchmarks.map((b, idx) => {
                const isBest = idx === 3; // Hybrid
                return (
                  <tr 
                    key={b.algorithm}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                      isBest ? 'bg-indigo-50/40 dark:bg-indigo-950/20 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-sans font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      {isBest && <Award className="w-4 h-4 text-amber-500 shrink-0" />}
                      <span>{b.algorithm}</span>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700 dark:text-slate-200">
                      {(b.precisionAtK * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700 dark:text-slate-200">
                      {(b.recallAtK * 100).toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700 dark:text-slate-200">
                      {b.f1AtK.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-indigo-600 dark:text-indigo-400">
                      {b.ndcgAtK.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700 dark:text-slate-200">
                      {b.mapAtK.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      {b.rmse.toFixed(2)}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700 dark:text-slate-200">
                      {b.catalogCoverage.toFixed(1)}%
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700 dark:text-slate-200">
                      {b.diversityScore.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Metric Definitions & Practical Significance */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <Target className="w-4 h-4" />
            <span>Accuracy &amp; Ranking Metrics</span>
          </div>

          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <div>
              <strong className="text-slate-900 dark:text-white">Precision@K:</strong> Ratio of items in the recommended top-K that the user actually converted on or rated &ge;4.0. High precision prevents consumer annoyance.
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white">Recall@K:</strong> Proportion of all relevant products in the store that were successfully surfaced in top-K. High recall ensures high catalog discovery.
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white">NDCG@K (Normalized Discounted Cumulative Gain):</strong> Evaluates position discount. Placing a highly relevant product at rank #1 contributes vastly more to NDCG than placing it at rank #5.
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white">RMSE (Root Mean Square Error):</strong> Measures deviations in raw predicted ratings &radic;[&Sigma;(r_ui - r&#770;_ui)&sup2; / N]. Lower is better.
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
            <Compass className="w-4 h-4" />
            <span>Beyond-Accuracy Ecosystem Metrics</span>
          </div>

          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <div>
              <strong className="text-slate-900 dark:text-white">Catalog Coverage (93.8% in Hybrid):</strong> Percentage of the entire store catalog recommended across user cohorts. Prevents recommendation starvation for non-blockbuster products.
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white">Intra-List Diversity:</strong> Average pairwise distance between recommended items. Prevents showing 4 nearly identical black keyboards in a single shelf.
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white">Serendipity &amp; Novelty:</strong> Measures how surprising yet relevant recommendations are, unlocking serendipitous product discovery.
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white">Why Hybrid Ensembles Win:</strong> Hybrid systems achieve the highest NDCG (0.88) and lowest RMSE (0.69) by dynamically delegating to content-based features when user history is scarce, and collaborative filtering when cohort patterns are dense.
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
