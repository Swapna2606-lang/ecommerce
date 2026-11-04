import React, { useState, useEffect } from 'react';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_USERS, 
  INITIAL_RATINGS_MATRIX 
} from './data/mockData';
import { 
  Product, 
  UserPersona, 
  RatingMatrix, 
  InteractionEvent, 
  RecommendationResult 
} from './types/recsys';
import { Navigation, NavTab } from './components/Navigation';
import { StorefrontView } from './components/StorefrontView';
import { DataPipelineView } from './components/DataPipelineView';
import { CollaborativeFilteringView } from './components/CollaborativeFilteringView';
import { ContentBasedView } from './components/ContentBasedView';
import { BenchmarksView } from './components/BenchmarksView';
import { ConsumerBehaviorView } from './components/ConsumerBehaviorView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { DEFAULT_FEATURE_WEIGHTS, FeatureWeights, generateRecommendations } from './utils/recsysEngine';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('storefront');
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [users] = useState<UserPersona[]>(INITIAL_USERS);
  const [activeUser, setActiveUser] = useState<UserPersona>(INITIAL_USERS[0]);
  const [matrix, setMatrix] = useState<RatingMatrix>(INITIAL_RATINGS_MATRIX);
  const [featureWeights, setFeatureWeights] = useState<FeatureWeights>(DEFAULT_FEATURE_WEIGHTS);
  
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Sync dark class on documentElement
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Modals state
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activeRecommendation, setActiveRecommendation] = useState<RecommendationResult | undefined>(undefined);

  // Interaction Events stream
  const [events, setEvents] = useState<InteractionEvent[]>([
    {
      id: 'ev-seed-01',
      timestamp: Date.now() - 320000,
      userId: 'user-01',
      productId: 'prod-01',
      productName: 'AURA Planar Studio Headphones',
      type: 'rating',
      ratingValue: 5,
      implicitScore: 5.0,
      details: 'Explicit 5-star review logged'
    },
    {
      id: 'ev-seed-02',
      timestamp: Date.now() - 240000,
      userId: 'user-01',
      productId: 'prod-11',
      productName: 'AURA SoundStage Balanced DAC & Amp',
      type: 'purchase',
      implicitScore: 5.0,
      details: 'Checkout completed with accessories'
    },
    {
      id: 'ev-seed-03',
      timestamp: Date.now() - 150000,
      userId: 'user-02',
      productId: 'prod-04',
      productName: 'Apex Pro Ergonomic Mesh Task Chair',
      type: 'cart_add',
      implicitScore: 3.0,
      details: 'Added from ergonomics collection'
    },
    {
      id: 'ev-seed-04',
      timestamp: Date.now() - 60000,
      userId: 'user-03',
      productId: 'prod-05',
      productName: 'Kuro Artisan Ceramic Pour-Over Dripper',
      type: 'dwell',
      dwellSeconds: 45,
      implicitScore: 1.5,
      details: 'High page dwell time observed (45s)'
    }
  ]);

  // Add event helper
  const logEvent = (
    type: InteractionEvent['type'],
    productId: string,
    implicitScore: number,
    extra?: Partial<InteractionEvent>
  ) => {
    const prod = products.find(p => p.id === productId);
    const newEvent: InteractionEvent = {
      id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
      userId: activeUser.id,
      productId,
      productName: prod ? prod.name : productId,
      type,
      implicitScore,
      ...extra
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  // Explicit Rating Action
  const handleRateProduct = (productId: string, rating: number) => {
    setMatrix(prev => ({
      ...prev,
      [activeUser.id]: {
        ...(prev[activeUser.id] || {}),
        [productId]: rating
      }
    }));

    logEvent('rating', productId, rating, {
      ratingValue: rating,
      details: `User rated ${rating} stars`
    });
  };

  // Add to Cart Action
  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });

    logEvent('cart_add', product.id, 3.0, {
      details: 'Added product to shopping bag'
    });
  };

  // Dwell Simulation
  const handleSimulateDwell = (productId: string) => {
    logEvent('dwell', productId, 1.5, {
      dwellSeconds: 30,
      details: 'Simulated 30-second viewport inspection dwell'
    });
  };

  // Quick View Inspection
  const handleOpenQuickView = (product: Product, rec?: RecommendationResult) => {
    setQuickViewProduct(product);
    setActiveRecommendation(rec);
    logEvent('view', product.id, 0.5, {
      details: 'Opened product quick view modal'
    });
  };

  // Explain Action
  const handleExplainProduct = (product: Product, rec?: RecommendationResult) => {
    setQuickViewProduct(product);
    setActiveRecommendation(rec);
  };

  // Checkout Action
  const handleCheckout = () => {
    cartItems.forEach(item => {
      logEvent('purchase', item.product.id, 5.0, {
        details: `Purchased quantity: ${item.quantity}`
      });
      // Impute into rating matrix if not already explicitly rated
      setMatrix(prev => {
        const uRatings = prev[activeUser.id] || {};
        if (!(item.product.id in uRatings)) {
          return {
            ...prev,
            [activeUser.id]: {
              ...uRatings,
              [item.product.id]: 5 // high satisfaction proxy
            }
          };
        }
        return prev;
      });
    });

    setCartItems([]);
  };

  // Update Cart Quantity
  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter((item): item is CartItem => item !== null);
    });
  };

  // Remove from Cart
  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(i => i.product.id !== productId));
  };

  // Generate synthetic traffic burst
  const handleGenerateSyntheticBurst = () => {
    const burstEvents: InteractionEvent[] = [];
    const randomUsers = users.filter(u => !u.isColdStart);

    for (let i = 0; i < 6; i++) {
      const u = randomUsers[Math.floor(Math.random() * randomUsers.length)];
      const p = products[Math.floor(Math.random() * products.length)];
      const types: InteractionEvent['type'][] = ['view', 'click', 'dwell', 'cart_add'];
      const t = types[Math.floor(Math.random() * types.length)];
      const score = t === 'cart_add' ? 3.0 : t === 'dwell' ? 1.5 : 0.8;

      burstEvents.push({
        id: `ev-burst-${Date.now()}-${i}`,
        timestamp: Date.now() - (i * 12000),
        userId: u.id,
        productId: p.id,
        productName: p.name,
        type: t,
        implicitScore: score,
        details: `Simulated concurrent cohort session signal`
      });
    }

    setEvents(prev => [...burstEvents, ...prev]);
  };

  // Clear Events
  const handleClearEvents = () => {
    setEvents([]);
  };

  // Cross-sell recommendations for Cart Drawer
  const crossSellRecommendations = React.useMemo(() => {
    if (cartItems.length === 0) return [];
    const anchorId = cartItems[0].product.id;
    return generateRecommendations(
      activeUser.id,
      'collaborative_item',
      matrix,
      events,
      products,
      {
        topK: 2,
        referenceProductId: anchorId,
        excludeInteracted: false
      }
    ).filter(rec => !cartItems.some(i => i.product.id === rec.product.id));
  }, [cartItems, activeUser.id, matrix, events, products]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Universal Navigation Header */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        cartCount={cartItems.reduce((s, i) => s + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        activeUser={activeUser}
        allUsers={users}
        onSelectUser={setActiveUser}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {activeTab === 'storefront' && (
          <StorefrontView
            products={products}
            activeUser={activeUser}
            allUsers={users}
            onSelectUser={setActiveUser}
            matrix={matrix}
            events={events}
            onRateProduct={handleRateProduct}
            onAddToCart={handleAddToCart}
            onOpenQuickView={handleOpenQuickView}
            onExplainProduct={handleExplainProduct}
            onSwitchToLab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'pipeline' && (
          <DataPipelineView
            events={events}
            products={products}
            activeUser={activeUser}
            onClearEvents={handleClearEvents}
            onGenerateSyntheticBurst={handleGenerateSyntheticBurst}
          />
        )}

        {activeTab === 'collaborative' && (
          <CollaborativeFilteringView
            matrix={matrix}
            products={products}
            users={users}
            activeUser={activeUser}
            onUpdateRating={(uId, pId, r) => {
              setMatrix(prev => ({
                ...prev,
                [uId]: {
                  ...(prev[uId] || {}),
                  [pId]: r
                }
              }));
              logEvent('rating', pId, r, {
                details: `Matrix cell updated for ${uId}`
              });
            }}
          />
        )}

        {activeTab === 'content_based' && (
          <ContentBasedView
            products={products}
            activeUser={activeUser}
            matrix={matrix}
            events={events}
            featureWeights={featureWeights}
            onUpdateWeights={setFeatureWeights}
          />
        )}

        {activeTab === 'benchmarks' && (
          <BenchmarksView
            matrix={matrix}
            products={products}
          />
        )}

        {activeTab === 'behavior' && (
          <ConsumerBehaviorView />
        )}
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        recommendation={activeRecommendation}
        activeUser={activeUser}
        userRating={quickViewProduct ? (matrix[activeUser.id]?.[quickViewProduct.id]) : undefined}
        onRate={handleRateProduct}
        onAddToCart={handleAddToCart}
        onSimulateDwell={handleSimulateDwell}
      />

      {/* Slide-Over Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
        crossSellRecommendations={crossSellRecommendations}
        onAddRecommendation={handleAddToCart}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">AURA Recommendation Lab</span>
            <span>&middot;</span>
            <span>Collaborative, Content-Based &amp; Behavioral Systems</span>
          </div>
          <div className="flex items-center gap-6">
            <span>Course Project (10 pts)</span>
            <span>&middot;</span>
            <button 
              onClick={() => setActiveTab('behavior')}
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Academic Submission Whitepaper
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
