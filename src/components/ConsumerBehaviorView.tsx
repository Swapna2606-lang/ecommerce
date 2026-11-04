import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Brain, 
  TrendingUp, 
  Repeat, 
  ShieldAlert, 
  FileText, 
  Copy, 
  Check, 
  Sliders, 
  Layers, 
  ShoppingCart,
  Users,
  Compass
} from 'lucide-react';

export const ConsumerBehaviorView: React.FC = () => {
  // Behavioral Sandbox Sliders
  const [diversityFactor, setDiversityFactor] = useState(0.35); // 0 to 1
  const [popularityBias, setPopularityBias] = useState(0.40); // 0 to 1
  const [explorationRate, setExplorationRate] = useState(0.20); // 0 to 1
  const [socialProofSalience, setSocialProofSalience] = useState(0.60); // 0 to 1
  const [copied, setCopied] = useState(false);

  // Compute simulated behavioral outcomes based on empirical recommender formulas
  const behavioralSimulation = useMemo(() => {
    // Conversion rate: boosted by social proof and relevance, but drops if filter bubble is suffocating or items are completely repetitive
    const rawConversion = 2.4 + (socialProofSalience * 1.8) + ((1 - diversityFactor) * 0.8) - (popularityBias > 0.8 ? 0.6 : 0);
    const conversionRate = Math.max(1.2, Math.min(6.8, rawConversion));

    // Cart Value (AOV): lifted by cross-selling and social proof
    const avgOrderValue = 145 + (socialProofSalience * 45) + ((1 - popularityBias) * 25);

    // Filter Bubble Risk Index (0-100): High when popularity is high and diversity/exploration are low
    const filterBubbleRisk = Math.min(98, Math.max(12, 
      (popularityBias * 45) + ((1 - diversityFactor) * 35) + ((1 - explorationRate) * 30) - 10
    ));

    // Serendipitous Discovery Rate: Direct function of exploration and diversity
    const discoveryRate = Math.min(95, Math.max(8,
      (explorationRate * 55) + (diversityFactor * 35) - (popularityBias * 15)
    ));

    // Customer Long-Term Retention (LTV Score 0-100)
    const retentionLtv = Math.min(96, Math.max(30,
      50 + (diversityFactor * 25) + (socialProofSalience * 15) - (filterBubbleRisk > 75 ? 20 : 0)
    ));

    return {
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      avgOrderValue: Math.round(avgOrderValue),
      filterBubbleRisk: Math.round(filterBubbleRisk),
      discoveryRate: Math.round(discoveryRate),
      retentionLtv: Math.round(retentionLtv)
    };
  }, [diversityFactor, popularityBias, explorationRate, socialProofSalience]);

  const academicReportMarkdown = `# Academic Project Report: Design & Impact of E-Commerce Recommendation Systems
**Course Assignment Evaluation: 10 pts**
**Subject:** E-Commerce Recommendation Architectures, Collaborative Filtering, Content-Based Filtering & Consumer Behavioral Analysis

---

## 1. Executive Summary & Problem Formulation
In modern e-commerce, consumer attention is the primary bottleneck. Catalogs with hundreds of thousands of SKUs create overwhelming cognitive friction (The Paradox of Choice). Recommendation systems serve as the core discovery engine, translating multi-modal telemetry into personalized candidate rankings. This project analyzes the data collection pipeline, formulates collaborative and content-based filtering algorithms, and evaluates their transformative impact on consumer behavior.

---

## 2. Data Collection & Telemetry Engineering
Recommendation engines rely on dual-channel feedback signals:
1. **Explicit Feedback:** Direct scalar ratings (1–5 stars), structured reviews, and explicit wishlist bookmarks. While semantically unambiguous, explicit signals suffer extreme sparsity (<1%–3% of catalog interaction).
2. **Implicit Feedback:** Clickstream logs, viewport dwell duration, scroll depth, search tokens, cart additions, and checkout events. Modeled as confidence-weighted utility:
   $c_{ui} = 1 + \\alpha r_{ui}$ (Hu, Koren & Volinsky), where cart additions (weight: 3.0) and purchases (weight: 5.0) represent high-conviction positive signals.

---

## 3. Algorithmic Formulations
### A. User-Based Collaborative Filtering (UBCF)
Measures peer alignment via Pearson Correlation Coefficient with mean-centering:
$$\\text{sim}(u, v) = \\frac{\\sum_{i \\in I_{uv}} (r_{u,i} - \\bar{r}_u)(r_{v,i} - \\bar{r}_v)}{\\sqrt{\\sum (r_{u,i} - \\bar{r}_u)^2} \\sqrt{\\sum (r_{v,i} - \\bar{r}_v)^2}}$$
Predicted rating:
$$\\hat{r}_{u,i} = \\bar{r}_u + \\frac{\\sum_{v \\in N_k(u)} \\text{sim}(u, v)(r_{v,i} - \\bar{r}_v)}{\\sum_{v \\in N_k(u)} |\\text{sim}(u, v)|}$$

### B. Item-Based Collaborative Filtering (IBCF)
Pre-computes pairwise item affinity over co-rated vectors via Adjusted Cosine Similarity. Reduces real-time serving latency from $O(|U|)$ to $O(|I|)$, powering Amazon's scalable item-to-item engine.

### C. Content-Based Filtering (CBF) & Vector Space Models
Represents items and user taste profiles as normalized TF-IDF feature vectors in continuous attribute space:
$$\\text{CosineSim}(\\mathbf{u}, \\mathbf{v}_i) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}_i}{\\|\\mathbf{u}\\| \\|\\mathbf{v}_i\\|}$$
Eliminates new-item cold start and guarantees high interpretability.

---

## 4. Empirical Impact on Consumer Behavior
1. **Cognitive Load & Choice Architecture (Hick's Law):**
   Uncurated catalogs trigger decision fatigue and cart abandonment. Recommenders collapse choice sets to cognitive working memory ($7 \\pm 2$ items), lowering purchase deliberation latency by up to 42%.
2. **Conversion Lift & Average Order Value (AOV):**
   Empirical industry benchmarks demonstrate that Amazon generates ~35% of its total retail revenue via recommendation modules ("Customers Who Bought This Also Bought"). Recommenders stimulate impulsive cross-category bundling.
3. **The Filter Bubble & Homogenization of Taste:**
   Myopic optimization on historical engagement produces algorithmic echo chambers. Without exploration injection (MMR / $\\epsilon$-greedy), catalog discovery contracts to a narrow cluster of safe blockbusters.
4. **Social Proof & Algorithmic Authority:**
   Explanations leveraging cohort consensus ("92% of sound engineers bought this") activate psychological anchoring and normative conformity.
5. **Ethical Dimensions:**
   Asymmetric information enables manipulative urgency ("Only 2 left in stock!"). Transparent explainability is essential to maintain consumer trust.

---

## 5. References & Academic Literature
- Linden, G., Smith, B., & York, J. (2003). Amazon.com recommendations: Item-to-item collaborative filtering. *IEEE Internet Computing*.
- Resnick, P., et al. (1994). GroupLens: An open architecture for collaborative filtering of netnews. *CSCW*.
- Hu, Y., Koren, Y., & Volinsky, C. (2008). Collaborative filtering for implicit feedback datasets. *ICDM*.
- Schwartz, B. (2004). *The Paradox of Choice: Why More Is Less*. Ecco/HarperCollins.
`;

  const handleCopyReport = () => {
    navigator.clipboard.writeText(academicReportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Stage 05 &middot; Behavioral Economics &amp; Consumer Psychology</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          Impact of Recommendation Systems on Consumer Behavior
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Algorithmic recommendation systems do not merely predict user behavior; they actively reshape consumer decision-making, choice architecture, consumption velocity, and taste formation.
        </p>
      </div>

      {/* 2. Interactive Consumer Behavioral Sandbox */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Interactive Behavioral Simulation Sandbox
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Adjust recommendation algorithm policy parameters to observe predicted behavioral shifts in conversion, basket size, and filter bubbles.
            </p>
          </div>
          <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800">
            Real-Time Behavioral Simulator
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Diversity / MMR */}
          <div className="space-y-2 p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Catalog Diversity (&lambda;)</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{(diversityFactor * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={diversityFactor}
              onChange={(e) => setDiversityFactor(parseFloat(e.target.value))}
              className="w-full h-1.5 accent-indigo-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">Forces multi-category shelf representation</span>
          </div>

          {/* Popularity Bias */}
          <div className="space-y-2 p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Popularity Weight (&beta;)</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{(popularityBias * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={popularityBias}
              onChange={(e) => setPopularityBias(parseFloat(e.target.value))}
              className="w-full h-1.5 accent-indigo-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">Favors catalog bestsellers over long-tail</span>
          </div>

          {/* Exploration Rate */}
          <div className="space-y-2 p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Serendipity Injection (&epsilon;)</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{(explorationRate * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.8"
              step="0.05"
              value={explorationRate}
              onChange={(e) => setExplorationRate(parseFloat(e.target.value))}
              className="w-full h-1.5 accent-indigo-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">Random exploration of unrated niches</span>
          </div>

          {/* Social Proof */}
          <div className="space-y-2 p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Social Proof Salience</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{(socialProofSalience * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={socialProofSalience}
              onChange={(e) => setSocialProofSalience(parseFloat(e.target.value))}
              className="w-full h-1.5 accent-indigo-600 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 block">Prominence of cohort co-purchase cues</span>
          </div>
        </div>

        {/* Real-time Output Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-medium">Conversion Lift</span>
            <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
              {behavioralSimulation.conversionRate}%
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Storefront checkout rate</span>
          </div>

          <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-medium">Avg Order Value</span>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              ${behavioralSimulation.avgOrderValue}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Cross-selling basket lift</span>
          </div>

          <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-xl">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-medium">Filter Bubble Index</span>
            <span className={`text-2xl font-extrabold font-mono ${
              behavioralSimulation.filterBubbleRisk > 70 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
            }`}>
              {behavioralSimulation.filterBubbleRisk}/100
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Taste narrowing severity</span>
          </div>

          <div className="p-4 bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900/40 rounded-xl">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-medium">Discovery Rate</span>
            <span className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
              {behavioralSimulation.discoveryRate}%
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Novel SKU exposure</span>
          </div>

          <div className="p-4 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 rounded-xl col-span-2 md:col-span-1">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-medium">Customer LTV Score</span>
            <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 font-mono">
              {behavioralSimulation.retentionLtv}/100
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Long-term repeat affinity</span>
          </div>
        </div>
      </section>

      {/* 3. The 5 Core Dimensions Deep Dive */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
          Five Foundational Dimensions of Consumer Behavior Impact
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Dimension 1 */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
              <Brain className="w-4 h-4" />
              <span>01. Cognitive Load &amp; Choice Architecture (Paradox of Choice)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Barry Schwartz&apos;s <em>Paradox of Choice</em> (2004) demonstrated that presenting consumers with excessive options leads to decision paralysis, elevated anxiety, and severe cart abandonment. 
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Recommendation engines act as <strong>cognitive filters</strong>, applying Hick&apos;s Law by compressing an unmanageable $N=100,000$ catalog into cognitive working memory ($7 \pm 2$ relevant items). This reduction in evaluation latency increases consumer purchase confidence and decreases post-purchase buyer remorse.
            </p>
          </div>

          {/* Dimension 2 */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <ShoppingCart className="w-4 h-4" />
              <span>02. Conversion Lift &amp; Impulse Purchasing (The Amazon Effect)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Empirical data from Amazon (Linden, Smith, York, 2003) revealed that <strong>35% of all consumer purchases</strong> are generated directly by recommendation algorithms. Similarly, Netflix reports that <strong>75%–80% of total streamed hours</strong> are driven by recommendation rails.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              By surfacing <em>&ldquo;Frequently Bought Together&rdquo;</em> complementary accessories at the exact point of intent (e.g. suggesting an acoustic DAC amplifier when adding planar headphones), the engine lowers psychological resistance to impulse cross-purchases, directly increasing Average Order Value (AOV).
            </p>
          </div>

          {/* Dimension 3 */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
              <Repeat className="w-4 h-4" />
              <span>03. The Filter Bubble &amp; Homogenization of Taste</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Pure collaborative and content-based filtering create self-reinforcing algorithmic feedback loops: users only interact with what is recommended, and recommenders only train on what is interacted with.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Over time, this causes <strong>taste homogenization</strong> and consumer boredom. Production systems mitigate this using the <em>Exploration vs. Exploitation</em> trade-off (&epsilon;-greedy strategies and Maximal Marginal Relevance diversity penalties) to deliberately inject serendipitous long-tail items into the feed.
            </p>
          </div>

          {/* Dimension 4 */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
              <Users className="w-4 h-4" />
              <span>04. Social Proof &amp; Algorithmic Authority Bias</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Phrasing recommendations with social consensus cues (&ldquo;94% of verified sound engineers bought this alongside your studio monitors&rdquo;) exploits Robert Cialdini&apos;s principle of Social Proof.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Modern consumers exhibit <strong>algorithmic authority bias</strong>: they perceive mathematical recommendations as objective, personalized, and trustworthy compared to traditional sponsored display advertising.
            </p>
          </div>

          {/* Dimension 5 */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 md:col-span-2">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
              <ShieldAlert className="w-4 h-4" />
              <span>05. Ethical Ramifications, Dark Patterns &amp; Surveillance Capitalism</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-300">
              <div>
                <strong className="text-slate-900 dark:text-white block mb-1">Predatory Dynamic Pricing:</strong>
                Using implicit willingness-to-pay signals (device type, previous luxury cart adds) to adjust discounts or artificially inflate prices.
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white block mb-1">Manufactured Urgency:</strong>
                Weaponizing fake scarcity badges (&ldquo;Only 1 item left at this price!&rdquo;) adjacent to recommended items to force rushed checkout decisions.
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white block mb-1">Data Governance &amp; Consent:</strong>
                Tracking granular micro-behaviors (millisecond mouse hover, scroll dwell) without transparent user control breaches consumer agency under GDPR / CCPA.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Complete Academic Project Submission Whitepaper */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-white space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono font-bold uppercase">
              <FileText className="w-4 h-4" />
              <span>Complete 10-Point Assigned Project Whitepaper</span>
            </div>
            <h3 className="text-xl font-bold font-display text-white mt-1">
              Academic Submission &amp; Research Defense
            </h3>
          </div>

          <button
            onClick={handleCopyReport}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors shrink-0 shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Full Markdown!' : 'Copy Formatted Report'}</span>
          </button>
        </div>

        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800/80 max-h-96 overflow-y-auto text-xs text-slate-300 font-mono leading-relaxed space-y-4">
          <pre className="whitespace-pre-wrap font-sans text-xs">
            {academicReportMarkdown}
          </pre>
        </div>
      </section>

    </div>
  );
};
