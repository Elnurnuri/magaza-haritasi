/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useECommerce } from '../context/ECommerceContext';
import { X, Star, ShoppingBag, MapPin, Check, Truck, Store, ShieldCheck } from 'lucide-react';

export default function ProductModal() {
  const { selectedProduct, setSelectedProduct, addToCart, stores, setSelectedStore, setActiveTab } = useECommerce();

  if (!selectedProduct) return null;

  const handleSelectStoreAndPickup = (storeId: string) => {
    const store = stores.find((s) => s.id === storeId);
    if (store) {
      setSelectedStore(store);
      addToCart(selectedProduct, store.id);
      setSelectedProduct(null);
      setActiveTab('stores-map');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-100 my-8 relative flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-slate-900/10 hover:bg-slate-900/20 text-slate-700 rounded-full flex items-center justify-center transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image */}
        <div className="md:w-1/2 bg-slate-50 p-6 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-slate-100">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.title}
            className="max-h-80 w-auto object-contain drop-shadow-md rounded-2xl"
          />
          {selectedProduct.isBestSeller && (
            <span className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-xs font-extrabold px-3 py-1 rounded-xl uppercase tracking-wider">
              En Çok Satılan
            </span>
          )}
        </div>

        {/* Details Content */}
        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">
              <span>GeoCommerce Garantisi</span>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 leading-snug">
              {selectedProduct.title}
            </h2>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <span className="text-sm font-bold text-slate-900">{selectedProduct.rating}</span>
              <span className="text-xs text-slate-400">({selectedProduct.reviewsCount} Değerlendirme)</span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                {selectedProduct.price.toLocaleString('tr-TR')} ₺
              </span>
              {selectedProduct.originalPrice && (
                <span className="text-base text-slate-400 line-through">
                  {selectedProduct.originalPrice.toLocaleString('tr-TR')} ₺
                </span>
              )}
            </div>

            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              {selectedProduct.description}
            </p>

            {/* Specs */}
            <div className="mt-4 space-y-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Öne Çıkan Özellikler:</span>
              <div className="grid grid-cols-2 gap-2">
                {selectedProduct.specs.map((spec, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Store Stock Availability */}
            <div className="mt-5">
              <div className="text-xs font-bold text-slate-900 mb-2 flex items-center justify-between">
                <span>Fiziki Mağaza Stok Durumu:</span>
                <span className="text-blue-600 hover:underline cursor-pointer text-[11px]" onClick={() => { setSelectedProduct(null); setActiveTab('stores-map'); }}>
                  Haritada Tümünü Gör
                </span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {stores.slice(0, 4).map((store) => {
                  const hasStock = selectedProduct.storeStock[store.id];
                  return (
                    <div
                      key={store.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-slate-800">{store.name}</span>
                      </div>
                      {hasStock ? (
                        <button
                          onClick={() => handleSelectStoreAndPickup(store.id)}
                          className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200"
                        >
                          Gel-Al Stokta var
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Stok Yok</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
            <button
              onClick={() => {
                addToCart(selectedProduct);
                setSelectedProduct(null);
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Sepete Ekle & İlerle</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
