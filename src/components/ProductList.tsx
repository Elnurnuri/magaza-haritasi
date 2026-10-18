/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useECommerce } from '../context/ECommerceContext';
import { CATEGORIES } from '../constants';
import ProductCard from './ProductCard';
import { 
  Store, 
  MapPin, 
  Truck, 
  Sparkles, 
  Grid, 
  Laptop, 
  ShoppingBag, 
  Home, 
  Coffee, 
  CheckCircle2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function ProductList() {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    selectedStore, 
    setSelectedStore,
    stores,
    setActiveTab
  } = useECommerce();

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laptop': return <Laptop className="w-4 h-4" />;
      case 'ShoppingBag': return <ShoppingBag className="w-4 h-4" />;
      case 'Home': return <Home className="w-4 h-4" />;
      case 'Coffee': return <Coffee className="w-4 h-4" />;
      default: return <Grid className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in space-y-8">
      {/* Hero Banner with Store Selector */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Fiziki Mağaza & Kurye Entegrasyonu</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight font-display bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
            Haritada Seç, Kapına Gelsin ya da Gel-Al!
          </h1>

          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            Mümkün olan en hızlı teslimat için konumunuza en yakın GeoCommerce mağazasını seçin veya 30 dakikada özel kuryemiz teslim etsin.
          </p>

          {/* Store Selector Bar */}
          <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold block">
                  Seçili Gel-Al / Stok Mağazası:
                </span>
                <span className="font-extrabold text-sm text-white">
                  {selectedStore ? selectedStore.name : 'Tüm Mağazalar'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('stores-map')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-lg transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Haritada Değiştir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {getCategoryIcon(cat.icon)}
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Öne Çıkan Ürünler ({filteredProducts.length})
          </h2>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-500 font-bold">Aradığınız kriterlere uygun ürün bulunamadı.</p>
            <button
              onClick={() => { setSelectedCategory('all'); }}
              className="mt-3 text-xs text-blue-600 font-bold underline"
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
