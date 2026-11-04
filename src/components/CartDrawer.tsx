import React, { useState } from 'react';
import { Product, RecommendationResult } from '../types/recsys';
import { getProductIcon } from './ProductCard';
import { X, Trash2, ShoppingBag, Plus, Minus, CheckCircle, Sparkles } from 'lucide-react';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  crossSellRecommendations: RecommendationResult[];
  onAddRecommendation: (product: Product) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  crossSellRecommendations,
  onAddRecommendation
}) => {
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 15;
  const total = subtotal + shipping;

  const handleCompleteOrder = () => {
    onCheckout();
    setCheckoutSuccess(true);
    setTimeout(() => {
      setCheckoutSuccess(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-slate-800 dark:text-slate-200" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Your Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Contents */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {checkoutSuccess ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Order Confirmed!</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Purchase interaction logged to event stream. Recommender weight of +5.0 assigned to all ordered items!
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Your bag is empty</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Add items from the store to experience live personalized basket recommendations.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map(({ product, quantity }) => (
                  <div 
                    key={product.id}
                    className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 rounded-xl"
                  >
                    {/* Thumbnail */}
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${product.bgGradient} flex items-center justify-center shrink-0`}>
                      {getProductIcon(product.iconName, "w-8 h-8 text-white")}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(product.id)}
                          className="text-slate-400 hover:text-red-500 ml-2"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[11px] text-slate-400 block">{product.brand}</span>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs font-bold font-mono tabular-nums text-slate-900 dark:text-slate-200">
                          ${product.price * quantity}
                        </span>

                        {/* Stepper */}
                        <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 px-1.5 py-0.5">
                          <button
                            onClick={() => onUpdateQuantity(product.id, -1)}
                            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-semibold tabular-nums px-1 text-slate-800 dark:text-slate-200">
                            {quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(product.id, 1)}
                            className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Cross-Sell Recommendations (Item-Item Collaborative Filtering in Action) */}
            {items.length > 0 && crossSellRecommendations.length > 0 && !checkoutSuccess && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 mb-3">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Frequently Bought Together
                  </h4>
                </div>
                <div className="space-y-2.5">
                  {crossSellRecommendations.slice(0, 2).map((rec) => (
                    <div 
                      key={rec.product.id}
                      className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-xl flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${rec.product.bgGradient} flex items-center justify-center shrink-0`}>
                          {getProductIcon(rec.product.iconName, "w-5 h-5 text-white")}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                            {rec.product.name}
                          </p>
                          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 truncate">
                            {rec.reason}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold font-mono tabular-nums text-slate-800 dark:text-slate-200">
                          ${rec.product.price}
                        </span>
                        <button
                          onClick={() => onAddRecommendation(rec.product)}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-md shadow-xs"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Summary & Checkout CTA */}
          {items.length > 0 && !checkoutSuccess && (
            <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-medium tabular-nums text-slate-800 dark:text-slate-200">${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="font-mono font-medium tabular-nums text-slate-800 dark:text-slate-200">
                    {shipping === 0 ? 'FREE' : `$${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total Due</span>
                  <span className="font-mono tabular-nums text-base">${total}</span>
                </div>
              </div>

              <button
                onClick={handleCompleteOrder}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Checkout &middot; Log Purchase Event</span>
              </button>

              <p className="text-[11px] text-center text-slate-400">
                Completing checkout triggers implicit feedback (+5.0 score) into the recommendation pipeline.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
