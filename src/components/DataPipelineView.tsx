import React, { useState } from 'react';
import { InteractionEvent, Product, UserPersona } from '../types/recsys';
import { 
  Database, 
  Activity, 
  Download, 
  RotateCcw, 
  Sparkles, 
  Eye, 
  MousePointer, 
  Clock, 
  ShoppingCart, 
  CheckCircle, 
  Star,
  Layers,
  ArrowRight
} from 'lucide-react';

interface DataPipelineViewProps {
  events: InteractionEvent[];
  products: Product[];
  activeUser: UserPersona;
  onClearEvents: () => void;
  onGenerateSyntheticBurst: () => void;
}

export const DataPipelineView: React.FC<DataPipelineViewProps> = ({
  events,
  products,
  activeUser,
  onClearEvents,
  onGenerateSyntheticBurst
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<InteractionEvent | null>(null);

  const filteredEvents = events.filter(e => {
    if (filterType === 'all') return true;
    return e.type === filterType;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'view': return <Eye className="w-3.5 h-3.5 text-blue-500" />;
      case 'click': return <MousePointer className="w-3.5 h-3.5 text-cyan-500" />;
      case 'dwell': return <Clock className="w-3.5 h-3.5 text-amber-500" />;
      case 'cart_add': return <ShoppingCart className="w-3.5 h-3.5 text-purple-500" />;
      case 'purchase': return <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />;
      case 'rating': return <Star className="w-3.5 h-3.5 text-amber-400" />;
      default: return <Activity className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const handleDownloadCSV = () => {
    const headers = ['id', 'timestamp', 'userId', 'productId', 'productName', 'type', 'implicitScore', 'ratingValue', 'dwellSeconds'];
    const rows = events.map(e => [
      e.id,
      new Date(e.timestamp).toISOString(),
      e.userId,
      e.productId,
      `"${e.productName.replace(/"/g, '""')}"`,
      e.type,
      e.implicitScore,
      e.ratingValue || '',
      e.dwellSeconds || ''
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `recsys_interaction_events_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(events, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `recsys_events_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. Header Section */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
          <Database className="w-4 h-4" />
          <span>Stage 01 &middot; Architecture &amp; Telemetry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          Data Collection &amp; Signal Ingestion Pipeline
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
          Recommendation systems depend completely on high-fidelity user interaction data. In production e-commerce, systems ingest both explicit ratings and continuous streams of implicit behavioral signals to construct the User-Item matrix.
        </p>
      </div>

      {/* 2. Conceptual Foundation: Explicit vs Implicit Feedback */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-4">
          Comparative Analysis: Explicit vs. Implicit Feedback
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-4">Dimension</th>
                <th className="py-3 px-4 text-indigo-600 dark:text-indigo-400">Explicit Feedback</th>
                <th className="py-3 px-4 text-cyan-600 dark:text-cyan-400">Implicit Feedback</th>
                <th className="py-3 px-4">Engineering Trade-off</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">Examples in E-Commerce</td>
                <td className="py-3.5 px-4">1–5 Star ratings, written reviews, thumbs up/down, survey responses.</td>
                <td className="py-3.5 px-4">Page clicks, dwell time, scroll depth, search queries, cart additions, purchases.</td>
                <td className="py-3.5 px-4 text-slate-500">Explicit actions require intentional cognitive effort; implicit occurs passively.</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">Signal Volume &amp; Sparsity</td>
                <td className="py-3.5 px-4 font-mono">Sparse (&lt;1%–3% of catalog)</td>
                <td className="py-3.5 px-4 font-mono text-emerald-600 dark:text-emerald-400">Massive (100x–1000x volume)</td>
                <td className="py-3.5 px-4 text-slate-500">Collaborative filtering without implicit signals suffers extreme cold start.</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">Noise &amp; Ambiguity</td>
                <td className="py-3.5 px-4">Low noise; high semantic clarity.</td>
                <td className="py-3.5 px-4">High noise (accidental clicks, left browser tab open, gift browsing).</td>
                <td className="py-3.5 px-4 text-slate-500">Implicit data requires heuristic weighting and decay functions.</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">Negative Feedback Capture</td>
                <td className="py-3.5 px-4">Direct 1-star or 2-star ratings.</td>
                <td className="py-3.5 px-4">Absence of interaction or fast bounce (&lt;2s dwell).</td>
                <td className="py-3.5 px-4 text-slate-500">Implicit systems face One-Class Collaborative Filtering (OCCF) challenges.</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">Implicit Score Mapping</td>
                <td className="py-3.5 px-4 font-mono">Ground truth: 1.0 to 5.0</td>
                <td className="py-3.5 px-4 font-mono text-indigo-600 dark:text-indigo-400">View: 0.5 &middot; Cart: 3.0 &middot; Buy: 5.0</td>
                <td className="py-3.5 px-4 text-slate-500">Mapped via confidence functions c_ui = 1 + &alpha; &middot; r_ui (Hu, Koren &amp; Volinsky).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Pipeline Architecture Diagram */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-white">
        <h2 className="text-lg font-bold font-display text-white mb-6">
          End-to-End E-Commerce Telemetry Architecture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
            <div className="text-xs font-mono font-bold text-indigo-400 uppercase">01. Client Ingestion</div>
            <h3 className="text-sm font-bold text-white">Event Telemetry SDK</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Captures beacon payloads with session ID, device token, product metadata, and viewport dwell timers.
            </p>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase">02. Streaming Buffer</div>
            <h3 className="text-sm font-bold text-white">Kafka / PubSub Stream</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decouples high-throughput clickstream bursts from processing engines. Buffers 50,000+ events/sec.
            </p>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
            <div className="text-xs font-mono font-bold text-amber-400 uppercase">03. Feature Store</div>
            <h3 className="text-sm font-bold text-white">Interaction Matrix Aggregator</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Synthesizes sparse interaction vectors, calculates TF-IDF profiles, and persists real-time user state.
            </p>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
            <div className="text-xs font-mono font-bold text-emerald-400 uppercase">04. Re-Ranking Engine</div>
            <h3 className="text-sm font-bold text-white">Hybrid Serving Layer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Calculates top-K candidates via ANN index (HNSW) and blends collaborative with content-based scores.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Live Event Stream Viewer & Interactive Tools */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Live Interaction Event Stream ({events.length} Events Logged)
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Logged in real-time as you navigate, rate, and purchase in the Live Storefront.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onGenerateSyntheticBurst}
              className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Simulates 10 synthetic browsing and carting actions from other cohort users"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate Traffic Burst</span>
            </button>
            <button
              onClick={handleDownloadCSV}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handleDownloadJSON}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>JSON</span>
            </button>
            <button
              onClick={onClearEvents}
              className="px-2.5 py-1.5 text-slate-400 hover:text-red-500 text-xs transition-colors"
              title="Clear logged events"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-1.5 flex-wrap border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="text-xs text-slate-400 mr-1">Filter by signal:</span>
          {['all', 'rating', 'purchase', 'cart_add', 'dwell', 'click', 'view'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-2.5 py-1 text-xs rounded-md font-medium uppercase tracking-wider transition-colors ${
                filterType === type
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Events Table */}
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Signal Type</th>
                <th className="py-2.5 px-3">Product Name</th>
                <th className="py-2.5 px-3">Implicit Weight</th>
                <th className="py-2.5 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No events recorded for signal &ldquo;{filterType}&rdquo;. Interact with items in the Storefront to log live events!
                  </td>
                </tr>
              ) : (
                filteredEvents.slice(0, 20).map((ev) => (
                  <tr 
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-3 text-slate-400">
                      {new Date(ev.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {ev.userId}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="inline-flex items-center gap-1.5 font-sans font-semibold">
                        {getEventIcon(ev.type)}
                        <span className="capitalize">{ev.type}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-700 dark:text-slate-300 max-w-[200px] truncate">
                      {ev.productName}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        ev.implicitScore >= 4 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                          : ev.implicitScore >= 2 
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300' 
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        +{ev.implicitScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-sans text-slate-500">
                      {ev.details || `${ev.type} action recorded`}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Selected Event Payload Viewer */}
        {selectedEvent && (
          <div className="p-4 bg-slate-900 rounded-xl text-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-mono text-indigo-400">
                Payload Inspection: {selectedEvent.id}
              </span>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
            <pre className="text-xs font-mono bg-slate-950 p-3 rounded-lg overflow-x-auto text-emerald-400">
              {JSON.stringify(selectedEvent, null, 2)}
            </pre>
          </div>
        )}
      </section>

    </div>
  );
};
