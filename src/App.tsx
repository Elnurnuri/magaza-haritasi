/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ECommerceProvider, useECommerce } from './context/ECommerceContext';
import Header from './components/Header';
import ProductList from './components/ProductList';
import StoreLocatorMap from './components/StoreLocatorMap';
import LiveTrackingMap from './components/LiveTrackingMap';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import ApiKeyModal from './components/ApiKeyModal';

function MainLayout() {
  const { activeTab } = useECommerce();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col antialiased">
      <Header />

      <main className="flex-1">
        {activeTab === 'store' && <ProductList />}
        {activeTab === 'stores-map' && <StoreLocatorMap />}
        {activeTab === 'live-tracking' && <LiveTrackingMap />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-white font-display text-sm">GeoCommerce</span>
            <p className="mt-1 text-slate-400">
              Google Maps Platform destekli akıllı e-ticaret, mağaza bulucu ve kurye takip platformu.
            </p>
          </div>
          <div className="text-slate-400 text-center md:text-right">
            © 2026 GeoCommerce. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>

      {/* Global Drawers & Modals */}
      <ProductModal />
      <CartDrawer />
      <ApiKeyModal />
    </div>
  );
}

export default function App() {
  return (
    <ECommerceProvider>
      <MainLayout />
    </ECommerceProvider>
  );
}
