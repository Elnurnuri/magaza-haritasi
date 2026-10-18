/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Map, AdvancedMarker, Pin, useMap, APIProvider } from '@vis.gl/react-google-maps';
import { useECommerce, isValidApiKey } from '../context/ECommerceContext';
import { StoreLocation } from '../types';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Navigation, 
  CheckCircle2, 
  Store, 
  Star, 
  Sparkles,
  Key,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

function MapInner({
  selectedStore,
  setSelectedStore,
  stores,
}: {
  selectedStore: StoreLocation | null;
  setSelectedStore: (store: StoreLocation) => void;
  stores: StoreLocation[];
}) {
  const map = useMap();

  useEffect(() => {
    if (map && selectedStore) {
      map.panTo({ lat: selectedStore.lat, lng: selectedStore.lng });
      map.setZoom(13);
    }
  }, [map, selectedStore]);

  return (
    <Map
      style={{ width: '100%', height: '100%' }}
      defaultCenter={{ lat: 41.0082, lng: 28.9784 }}
      defaultZoom={11}
      gestureHandling="greedy"
      disableDefaultUI={false}
      mapId="DEMO_MAP_ID"
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
    >
      {stores.map((store) => {
        const isSelected = selectedStore?.id === store.id;
        return (
          <AdvancedMarker
            key={store.id}
            position={{ lat: store.lat, lng: store.lng }}
            onClick={() => setSelectedStore(store)}
          >
            <div className="relative group cursor-pointer">
              <Pin
                background={isSelected ? '#2563EB' : '#0F172A'}
                borderColor={isSelected ? '#1E3A8A' : '#334155'}
                glyphColor="white"
                scale={isSelected ? 1.25 : 1}
              >
                <Store className="w-4 h-4 text-white" />
              </Pin>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-xs px-2.5 py-1 rounded-lg font-bold shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-slate-700">
                {store.name}
              </div>
            </div>
          </AdvancedMarker>
        );
      })}
    </Map>
  );
}

export default function StoreLocatorMap() {
  const { apiKey, stores, selectedStore, setSelectedStore, setIsKeyModalOpen, setActiveTab } = useECommerce();
  const [activeFilterCity, setActiveFilterCity] = useState<string>('Tümü');
  const [mapAuthError, setMapAuthError] = useState<boolean>(false);

  useEffect(() => {
    const handleAuthFailure = () => setMapAuthError(true);
    window.addEventListener('gmp-auth-failure', handleAuthFailure);
    return () => {
      window.removeEventListener('gmp-auth-failure', handleAuthFailure);
    };
  }, []);

  const hasValidKey = Boolean(isValidApiKey(apiKey) && !mapAuthError);
  const cities = ['Tümü', 'İstanbul', 'Ankara', 'İzmir'];
  const filteredStores = activeFilterCity === 'Tümü' 
    ? stores 
    : stores.filter((s) => s.city === activeFilterCity);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Header Info */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
            <Store className="w-4 h-4" />
            Fiziki Mağazalar & Gel-Al Noktaları
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Mağaza Bulucu & Teslimat Haritası
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Size en yakın GeoCommerce mağazasından 30 dakikada siparişinizi teslim alın veya kurye çağırın.
          </p>
        </div>

        {/* City Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setActiveFilterCity(city)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeFilterCity === city
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Map & Store List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[650px]">
        {/* Store List Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col h-full">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              {filteredStores.length} Mağaza Bulundu
            </span>
            <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
              Gel-Al Aktif
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {filteredStores.map((store) => {
              const isSelected = selectedStore?.id === store.id;
              return (
                <div
                  key={store.id}
                  onClick={() => setSelectedStore(store)}
                  className={`p-4 rounded-xl transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">{store.name}</h3>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{store.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span>{store.address}</span>
                  </p>

                  <div className="flex items-center gap-4 mt-2.5 text-[11px] text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-blue-600" />
                      {store.openHours}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {store.phone}
                    </span>
                  </div>

                  {/* Services tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {store.services.map((service, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md"
                      >
                        {service}
                      </span>
                    ))}
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-blue-200/60 flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                        Seçili Gel-Al Mağazanız
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab('store');
                        }}
                        className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1"
                      >
                        <span>Alışverişe Başla</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Google Map Container */}
        <div className="lg:col-span-8 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/80 shadow-md relative h-full">
          {hasValidKey ? (
            <APIProvider apiKey={apiKey}>
              <MapInner
                selectedStore={selectedStore}
                setSelectedStore={setSelectedStore}
                stores={filteredStores}
              />
            </APIProvider>
          ) : (
            /* Fallback preview when no key or auth error */
            <div className="w-full h-full bg-slate-900 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
              
              <div className="relative z-10 max-w-md bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl text-white">
                <div className="w-14 h-14 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-500/30">
                  <ShieldAlert className="w-7 h-7" />
                </div>

                <h3 className="text-xl font-extrabold mb-2">Canlı Harita Görünümü İçin API Anahtarı</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  Google Maps haritasında mağaza konumlarını, Street View görünümlerini ve kurye rotalarını görüntülemek için lütfen geçerli bir Google Maps API anahtarı girin.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => setIsKeyModalOpen(true)}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 text-sm"
                  >
                    <Key className="w-4 h-4" />
                    <span>Google Maps Key Gir / Değiştir</span>
                  </button>
                </div>

                {/* Selected Store Card Preview inside Fallback */}
                {selectedStore && (
                  <div className="mt-6 pt-4 border-t border-white/10 text-left bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                    <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1">
                      Seçili Mağaza Bilgisi
                    </div>
                    <div className="font-bold text-sm text-white">{selectedStore.name}</div>
                    <div className="text-xs text-slate-300 mt-1">{selectedStore.address}</div>
                    <div className="text-xs text-blue-400 font-semibold mt-2">
                      Konum: {selectedStore.lat}, {selectedStore.lng}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
