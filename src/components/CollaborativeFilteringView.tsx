import React, { useState, useMemo } from 'react';
import { 
  Product, 
  RatingMatrix, 
  UserPersona, 
  PredictionTrace 
} from '../types/recsys';
import { 
  computeUserSimilarity, 
  computeUserUserPrediction, 
  computeItemSimilarity, 
  computeItemItemPrediction, 
  computeUserMean 
} from '../utils/recsysEngine';
import { 
  Users, 
  Calculator, 
  Grid, 
  Layers, 
  Sparkles, 
  HelpCircle, 
  ArrowRight,
  TrendingUp,
  Sliders,
  Check
} from 'lucide-react';

interface CollaborativeFilteringViewProps {
  matrix: RatingMatrix;
  products: Product[];
  users: UserPersona[];
  activeUser: UserPersona;
  onUpdateRating: (userId: string, productId: string, rating: number) => void;
}

export const CollaborativeFilteringView: React.FC<CollaborativeFilteringViewProps> = ({
  matrix,
  products,
  users,
  activeUser,
  onUpdateRating
}) => {
  const [cfMode, setCfMode] = useState<'ubcf' | 'ibcf'>('ubcf');
  const [selectedUserId, setSelectedUserId] = useState<string>(activeUser.id);
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0].id);
  const [kNeighbors, setKNeighbors] = useState<number>(3);
  const [editingCell, setEditingCell] = useState<{ userId: string; productId: string } | null>(null);

  // Calculate prediction trace
  const predictionTrace: PredictionTrace = useMemo(() => {
    if (cfMode === 'ubcf') {
      return computeUserUserPrediction(selectedUserId, selectedProductId, matrix, products, kNeighbors);
    } else {
      return computeItemItemPrediction(selectedUserId, selectedProductId, matrix, products, kNeighbors);
    }
  }, [cfMode, selectedUserId, selectedProductId, matrix, products, kNeighbors]);

  // Matrix Sparsity Calculation
  const sparsityStats = useMemo(() => {
    const totalCells = users.length * products.length;
    let filledCells = 0;
    users.forEach(u => {
      const r = matrix[u.id] || {};
      filledCells += Object.keys(r).length;
    });
    const density = (filledCells / totalCells) * 100;
    const sparsity = 100 - density;
    return { totalCells, filledCells, density, sparsity };
  }, [matrix, users, products]);

  // Pairwise User Similarity Matrix
  const userSimilarityMatrix = useMemo(() => {
    const table: Record<string, Record<string, number>> = {};
    users.forEach(u1 => {
      table[u1.id] = {};
      users.forEach(u2 => {
        if (u1.id === u2.id) {
          table[u1.id][u2.id] = 1.0;
        } else {
          const sim = computeUserSimilarity(u1.id, u2.id, matrix, products).similarity;
          table[u1.id][u2.id] = sim;
        }
      });
    });
    return table;
  }, [users, matrix, products]);

  const targetUserObj = users.find(u => u.id === selectedUserId) || users[0];
  const targetProdObj = products.find(p => p.id === selectedProductId) || products[0];

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
          <Users className="w-4 h-4" />
          <span>Stage 02 &middot; Machine Learning Core</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          Collaborative Filtering &amp; Matrix Factorization Lab
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Collaborative Filtering generates predictions based solely on historical behavioral patterns across cohorts of users and items, requiring no external domain knowledge. Explore the User-Item Rating Matrix, examine pairwise similarities, and compute exact step-by-step predictions.
        </p>
      </div>

      {/* 2. Interactive CF Mode Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Algorithm Variant:</span>
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setCfMode('ubcf')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                cfMode === 'ubcf'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              User-Based (UBCF)
            </button>
            <button
              onClick={() => setCfMode('ibcf')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                cfMode === 'ibcf'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Item-Based (IBCF &middot; Amazon Style)
            </button>
          </div>
        </div>

        {/* Matrix Sparsity Indicator */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-slate-500">
            Density: <span className="text-emerald-600 dark:text-emerald-400 font-bold">{sparsityStats.density.toFixed(1)}%</span>
          </div>
          <div className="text-slate-500">
            Sparsity: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{sparsityStats.sparsity.toFixed(1)}%</span>
          </div>
          <div className="text-slate-500">
            Rated Cells: <span className="font-bold text-slate-800 dark:text-slate-200">{sparsityStats.filledCells} / {sparsityStats.totalCells}</span>
          </div>
        </div>
      </div>

      {/* 3. Mathematical Formula Showcase */}
      <section className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-white space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold font-display">
              {cfMode === 'ubcf' ? 'User-Based Collaborative Filtering (UBCF) Formula' : 'Item-Based Collaborative Filtering (IBCF) Formula'}
            </h2>
          </div>
          <span className="text-xs text-indigo-400 font-mono">Resnick Formula with Mean Centering</span>
        </div>

        {cfMode === 'ubcf' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 font-mono space-y-2">
              <span className="text-indigo-400 font-bold block">1. User Pearson Similarity:</span>
              <p className="text-slate-300 leading-relaxed">
                sim(u, v) = &Sigma; [(r_ui - r&#772;_u)(r_vi - r&#772;_v)] / [ &radic;(&Sigma;(r_ui - r&#772;_u)&sup2;) &middot; &radic;(&Sigma;(r_vi - r&#772;_v)&sup2;) ]
              </p>
              <p className="text-[11px] text-slate-500 font-sans">
                Normalized between -1.0 (opposite preferences) and +1.0 (identical preference deviations).
              </p>
            </div>

            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 font-mono space-y-2">
              <span className="text-emerald-400 font-bold block">2. Predicted Rating with Mean-Centering:</span>
              <p className="text-slate-300 leading-relaxed">
                r&#770;_ui = r&#772;_u + [ &Sigma; (v &isin; N_k) sim(u, v) &middot; (r_vi - r&#772;_v) ] / [ &Sigma; (v &isin; N_k) |sim(u, v)| ]
              </p>
              <p className="text-[11px] text-slate-500 font-sans">
                Adjusts for optimistic vs critical rating bias by adding neighbor deviations onto target user mean r&#772;_u.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 font-mono space-y-2">
              <span className="text-indigo-400 font-bold block">1. Adjusted Cosine Similarity Between Items:</span>
              <p className="text-slate-300 leading-relaxed">
                sim(i, j) = &Sigma; (u &isin; U) [(r_ui - r&#772;_u)(r_uj - r&#772;_u)] / [ &radic;(&Sigma;(r_ui - r&#772;_u)&sup2;) &middot; &radic;(&Sigma;(r_uj - r&#772;_u)&sup2;) ]
              </p>
              <p className="text-[11px] text-slate-500 font-sans">
                Computes cosine angle between item rating vectors while subtracting user average rating r&#772;_u.
              </p>
            </div>

            <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 font-mono space-y-2">
              <span className="text-emerald-400 font-bold block">2. Item-to-Item Prediction:</span>
              <p className="text-slate-300 leading-relaxed">
                r&#770;_ui = [ &Sigma; (j &isin; S_k(i)) sim(i, j) &middot; r_uj ] / [ &Sigma; (j &isin; S_k(i)) |sim(i, j)| ]
              </p>
              <p className="text-[11px] text-slate-500 font-sans">
                Scales exponentially better than UBCF in e-commerce because items change far slower than active user sessions.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* 4. Interactive Step-by-Step Mathematical Calculation Inspector */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Step-by-Step Mathematical Prediction Trace
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select any target user and candidate product to watch the engine compute intermediate values in real-time.
            </p>
          </div>

          {/* User, Product & K Selectors */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">Target User:</span>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-xs font-semibold"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">Candidate Item:</span>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-xs font-semibold max-w-[180px] truncate"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-400">k-Neighbors:</span>
              <select
                value={kNeighbors}
                onChange={(e) => setKNeighbors(parseInt(e.target.value))}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-xs font-mono font-semibold"
              >
                <option value={2}>k = 2</option>
                <option value={3}>k = 3</option>
                <option value={4}>k = 4</option>
                <option value={5}>k = 5</option>
              </select>
            </div>
          </div>
        </div>

        {/* Calculation Summary Card */}
        <div className="p-5 bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-200/50 dark:border-indigo-900/50 pb-3">
            <div>
              <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 block">
                Target: {targetUserObj.name} &rarr; &ldquo;{targetProdObj.name}&rdquo;
              </span>
              <span className="text-[11px] text-slate-500">
                User baseline mean rating r&#772;_{selectedUserId} = <strong className="font-mono">{predictionTrace.targetUserMean.toFixed(2)}</strong>
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xs text-slate-500 uppercase tracking-wider">Predicted Rating r&#770;:</span>
              <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                {predictionTrace.predictedRating.toFixed(2)} / 5.0
              </span>
            </div>
          </div>

          {/* Intermediate Neighbors Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
              Nearest Neighbors &amp; Rating Deviations (Top {kNeighbors}):
            </h4>

            {predictionTrace.neighbors.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">
                No overlapping ratings found for this combination (Cold-Start Condition). Predicted rating falls back to target user mean or catalog baseline.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-slate-400 border-b border-indigo-200/40 uppercase">
                    <tr>
                      <th className="py-2 px-3">Neighbor</th>
                      <th className="py-2 px-3">Similarity sim(u, v)</th>
                      <th className="py-2 px-3">Actual Rating r_vi</th>
                      <th className="py-2 px-3">Neighbor Mean r&#772;_v</th>
                      <th className="py-2 px-3">Deviation (r - r&#772;)</th>
                      <th className="py-2 px-3">Weighted Contribution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-indigo-100/40 dark:divide-indigo-900/40 font-mono">
                    {predictionTrace.neighbors.map((n) => (
                      <tr key={n.id}>
                        <td className="py-2 px-3 font-sans font-semibold text-slate-800 dark:text-slate-200">
                          {n.name}
                        </td>
                        <td className="py-2 px-3 text-indigo-600 dark:text-indigo-400 font-bold">
                          {n.similarity.toFixed(4)}
                        </td>
                        <td className="py-2 px-3">{n.rating}&#9733;</td>
                        <td className="py-2 px-3 text-slate-500">{n.meanRating.toFixed(2)}</td>
                        <td className="py-2 px-3 text-slate-700 dark:text-slate-300">
                          {n.deviation >= 0 ? `+${n.deviation.toFixed(2)}` : n.deviation.toFixed(2)}
                        </td>
                        <td className="py-2 px-3 font-bold text-slate-900 dark:text-white">
                          {n.contribution >= 0 ? `+${n.contribution.toFixed(3)}` : n.contribution.toFixed(3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Mathematical Step Breakdown */}
          {predictionTrace.neighbors.length > 0 && (
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-indigo-100 dark:border-indigo-900/60 font-mono text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <div>
                <strong>Numerator:</strong> &Sigma; [ sim &middot; dev ] = {predictionTrace.numerator.toFixed(3)}
              </div>
              <div>
                <strong>Denominator:</strong> &Sigma; |sim| = {predictionTrace.denominator.toFixed(3)}
              </div>
              <div className="text-indigo-600 dark:text-indigo-400 font-bold pt-1 border-t border-slate-100 dark:border-slate-800">
                Formula Result = {predictionTrace.targetUserMean.toFixed(2)} + ({predictionTrace.numerator.toFixed(3)} / {predictionTrace.denominator.toFixed(3)}) = {predictionTrace.predictedRating.toFixed(2)}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. Interactive User-Item Rating Matrix Heatmap */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Live User-Item Rating Matrix Heatmap
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any cell to edit or add a star rating (1–5). Watch all collaborative predictions dynamically update!
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-xs text-center border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              <tr>
                <th className="py-3 px-3 text-left sticky left-0 bg-slate-50 dark:bg-slate-800/90 z-10">User Persona</th>
                <th className="py-3 px-2 text-slate-400">Mean r&#772;</th>
                {products.map(p => (
                  <th key={p.id} className="py-3 px-2 min-w-[75px]" title={p.name}>
                    <span className="block truncate max-w-[70px] mx-auto text-[11px]">{p.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{p.id}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {users.map(u => {
                const uRatings = matrix[u.id] || {};
                const uMean = computeUserMean(uRatings);
                return (
                  <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 text-left font-sans font-bold text-slate-900 dark:text-white sticky left-0 bg-white dark:bg-slate-900 z-10 whitespace-nowrap border-r border-slate-100 dark:border-slate-800">
                      {u.name} {u.isColdStart ? '(Cold)' : ''}
                    </td>
                    <td className="py-2.5 px-2 text-slate-500 font-semibold border-r border-slate-100 dark:border-slate-800">
                      {uMean > 0 ? uMean.toFixed(1) : '-'}
                    </td>
                    {products.map(p => {
                      const val = uRatings[p.id];
                      const isEditing = editingCell?.userId === u.id && editingCell?.productId === p.id;

                      return (
                        <td 
                          key={p.id}
                          onClick={() => setEditingCell({ userId: u.id, productId: p.id })}
                          className={`py-2 px-1 cursor-pointer transition-colors ${
                            val === 5 ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold' :
                            val === 4 ? 'bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 font-semibold' :
                            val === 3 ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300' :
                            val === 2 ? 'bg-orange-500/15 text-orange-800 dark:text-orange-300' :
                            val === 1 ? 'bg-red-500/15 text-red-800 dark:text-red-300' :
                            'text-slate-300 dark:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {isEditing ? (
                            <select
                              autoFocus
                              value={val || 0}
                              onBlur={() => setEditingCell(null)}
                              onChange={(e) => {
                                onUpdateRating(u.id, p.id, parseInt(e.target.value));
                                setEditingCell(null);
                              }}
                              className="text-xs bg-white dark:bg-slate-800 border rounded px-1 py-0.5"
                            >
                              <option value={0}>-</option>
                              <option value={1}>1&#9733;</option>
                              <option value={2}>2&#9733;</option>
                              <option value={3}>3&#9733;</option>
                              <option value={4}>4&#9733;</option>
                              <option value={5}>5&#9733;</option>
                            </select>
                          ) : (
                            val ? `${val}★` : '·'
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. Pairwise User-User Similarity Matrix */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
          Pairwise User Pearson Correlation Matrix (sim(u, v))
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Calculates the preference correlation angle between users based on co-rated items. Positive values indicate taste alignment; negative values indicate inverse preferences.
        </p>

        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-xs text-center border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              <tr>
                <th className="py-2.5 px-3 text-left">Persona</th>
                {users.map(u => (
                  <th key={u.id} className="py-2.5 px-3 whitespace-nowrap">
                    {u.name.split(' ')[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {users.map(u1 => (
                <tr key={u1.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 text-left font-sans font-bold text-slate-900 dark:text-white">
                    {u1.name}
                  </td>
                  {users.map(u2 => {
                    const sim = userSimilarityMatrix[u1.id]?.[u2.id] ?? 0;
                    return (
                      <td 
                        key={u2.id}
                        className={`py-2 px-3 ${
                          u1.id === u2.id ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 font-bold' :
                          sim > 0.5 ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-bold' :
                          sim > 0.1 ? 'bg-indigo-500/15 text-indigo-800 dark:text-indigo-300 font-semibold' :
                          sim < -0.1 ? 'bg-rose-500/15 text-rose-800 dark:text-rose-300' :
                          'text-slate-400'
                        }`}
                      >
                        {sim.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};
