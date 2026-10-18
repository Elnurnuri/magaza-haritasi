/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useECommerce } from '../context/ECommerceContext';
import { 
  ShoppingBag, 
  MapPin, 
  Search, 
  Key, 
  Truck, 
  Store, 
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function Header() {
  const { 
    apiKey, 
    activeTab, 
    setActiveTab, 
    searchQuery, 
    setSearchQuery, 
    cartCount, 
    setIsCartOpen,
    setIsKeyModalOpen,
    activeOrder
  } = useECommerce();

  return (
    <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-xl border-b border-slate-800">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-1.5 text-xs text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
        <span>Harita Destekli E-Ticaret Platformu: Siparişinizi 30 Dakikada Canlı Takip Edin veya Mağazadan Teslim Alın!</span>
        <span className="hidden md:inline-block bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-semibold">Özel Kurye Kampanyası</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('store')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent font-display">
                  GeoCommerce
                </span>
                <span className="block text-[10px] text-blue-400 font-medium tracking-wide">
                  E-Ticaret & Harita Çözümleri
                </span>
              </div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ürün adı, marka veya kategori ara..."
                className="w-full bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-400 text-sm rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('store')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'store'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Mağaza</span>
            </button>

            <button
              onClick={() => setActiveTab('stores-map')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'stores-map'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Mağazalar Haritası</span>
            </button>

            {/* Live Order Tracking Button */}
            <button
              onClick={() => setActiveTab('live-tracking')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 relative ${
                activeTab === 'live-tracking'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Truck className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Canlı Kargo Takip</span>
              <span className="sm:hidden">Takip</span>
              {activeOrder && activeOrder.status !== 'delivered' && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
              )}
            </button>
          </nav>

          {/* Right Actions (API Key & Cart) */}
          <div className="flex items-center gap-2">
            {/* API Key Indicator Button */}
            <button
              onClick={() => setIsKeyModalOpen(true)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-all ${
                apiKey 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20' 
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
              }`}
              title="Google Maps API Key Ayarları"
            >
              <Key className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{apiKey ? 'Maps API Aktif' : 'Maps Key Ekle'}</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center"
              aria-label="Sepetim"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-900 font-extrabold text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
