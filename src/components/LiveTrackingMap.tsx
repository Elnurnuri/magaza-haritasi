/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Map, AdvancedMarker, Pin, useMap, APIProvider } from '@vis.gl/react-google-maps';
import { useECommerce, isValidApiKey } from '../context/ECommerceContext';
import { 
  Truck, 
  MapPin, 
  Clock, 
  PhoneCall, 
  CheckCircle2, 
  Sparkles, 
  Store, 
  PackageCheck, 
  Key, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

function LiveTrackingInner({
  courierLat,
  courierLng,
  destLat,
  destLng,
  storeLat,
  storeLng,
}: {
  courierLat: number;
  courierLng: number;
  destLat: number;
  destLng: number;
  storeLat: number;
  storeLng: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      map.panTo({ lat: courierLat, lng: courierLng });
      map.setZoom(14);
    }
  }, [map, courierLat, courierLng]);

  return (
    <Map
      style={{ width: '100%', height: '100%' }}
      defaultCenter={{ lat: courierLat, lng: courierLng }}
      defaultZoom={14}
      gestureHandling="greedy"
      disableDefaultUI={false}
      mapId="DEMO_MAP_ID"
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
    >
      {/* Store Location Pin */}
      <AdvancedMarker position={{ lat: storeLat, lng: storeLng }}>
        <Pin background="#3B82F6" borderColor="#1D4ED8" glyphColor="white">
          <Store className="w-4 h-4 text-white" />
        </Pin>
      </AdvancedMarker>

      {/* Live Courier Pin */}
      <AdvancedMarker position={{ lat: courierLat, lng: courierLng }}>
        <div className="relative">
          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl border-2 border-white animate-bounce">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded font-extrabold whitespace-nowrap shadow-md">
            Canlı Kurye
          </div>
        </div>
      </AdvancedMarker>

      {/* Destination Location Pin */}
      <AdvancedMarker position={{ lat: destLat, lng: destLng }}>
        <Pin background="#EF4444" borderColor="#991B1B" glyphColor="white">
          <MapPin className="w-4 h-4 text-white" />
        </Pin>
      </AdvancedMarker>
    </Map>
  );
}

export default function LiveTrackingMap() {
  const { apiKey, activeOrder, cancelOrder, setIsKeyModalOpen, setActiveTab } = useECommerce();
  const [mapAuthError, setMapAuthError] = useState<boolean>(false);

  useEffect(() => {
    const handleAuthFailure = () => setMapAuthError(true);
    window.addEventListener('gmp-auth-failure', handleAuthFailure);
    return () => {
      window.removeEventListener('gmp-auth-failure', handleAuthFailure);
    };
  }, []);

  const hasValidKey = Boolean(isValidApiKey(apiKey) && !mapAuthError);

  if (!activeOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-in fade-in">
        <div className="bg-white rounded-3xl p-10 border border-slate-200/80 shadow-xl max-w-lg mx-auto">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-inner">
            <Truck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">Aktif Sipariş Bulunmuyor</h2>
          <p className="text-slate-500 text-sm mt-2 mb-6 leading-relaxed">
            Canlı kurye takibini deneyimlemek için mağazamızdan bir ürün seçip sipariş oluşturabilirsiniz.
          </p>
          <button
            onClick={() => setActiveTab('store')}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
          >
            <span>Alışverişe Başla</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  const { status, courier, deliveryLocation, selectedStore, estimatedMinutes, id } = activeOrder;
  const storeLat = selectedStore?.lat || 40.9856;
  const storeLng = selectedStore?.lng || 29.0268;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Top Header Card */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl mb-6 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full filter blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 w-fit mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Sipariş No: #{id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
            {status === 'preparing' && 'Siparişiniz Mağazada Hazırlanıyor'}
            {status === 'on_the_way' && 'Kurye Yolda! Siparişiniz Geliyor'}
            {status === 'delivered' && 'Siparişiniz Teslim Edildi!'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Teslimat Adresi: {deliveryLocation.address}, {deliveryLocation.district}/{deliveryLocation.city}
          </p>
        </div>

        {/* ETA Badge */}
        <div className="relative z-10 bg-slate-800/90 border border-slate-700 p-4 rounded-2xl text-center min-w-[160px]">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider font-extrabold">Tahmini Varış</div>
          <div className="text-3xl font-black text-emerald-400 mt-0.5">
            {status === 'delivered' ? '0 dk' : `${estimatedMinutes} dk`}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">Canlı Harita Takibi</div>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm mb-6">
        <div className="grid grid-cols-3 gap-4 text-center relative">
          {/* Step 1 */}
          <div className={`flex flex-col items-center gap-2 ${status === 'preparing' ? 'text-blue-600 font-extrabold' : 'text-slate-700'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
              status === 'preparing' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-emerald-500 text-white'
            }`}>
              <PackageCheck className="w-5 h-5" />
            </div>
            <span className="text-xs">1. Mağazada Hazırlanıyor</span>
          </div>

          {/* Step 2 */}
          <div className={`flex flex-col items-center gap-2 ${status === 'on_the_way' ? 'text-blue-600 font-extrabold' : status === 'delivered' ? 'text-slate-700' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
              status === 'on_the_way' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 animate-pulse' : status === 'delivered' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-xs">2. Kurye Yolda</span>
          </div>

          {/* Step 3 */}
          <div className={`flex flex-col items-center gap-2 ${status === 'delivered' ? 'text-emerald-600 font-extrabold' : 'text-slate-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
              status === 'delivered' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'bg-slate-100 text-slate-400'
            }`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-xs">3. Kapıda Teslimat</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Map & Courier Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[550px]">
        {/* Live Map */}
        <div className="lg:col-span-8 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200/80 shadow-md relative h-full">
          {hasValidKey ? (
            <APIProvider apiKey={apiKey}>
              <LiveTrackingInner
                courierLat={courier.lat}
                courierLng={courier.lng}
                destLat={deliveryLocation.lat}
                destLng={deliveryLocation.lng}
                storeLat={storeLat}
                storeLng={storeLng}
              />
            </APIProvider>
          ) : (
            <div className="w-full h-full bg-slate-900 p-8 flex flex-col items-center justify-center text-center text-white relative">
              <Truck className="w-12 h-12 text-emerald-400 mb-3 animate-pulse" />
              <h3 className="text-lg font-bold mb-1">Harita Takibi İçin API Anahtarı</h3>
              <p className="text-xs text-slate-300 max-w-sm mb-4">
                Kuryenin harita üzerindeki anlık hareketini takip etmek için Google Maps API anahtarı ekleyebilirsiniz.
              </p>
              <button
                onClick={() => setIsKeyModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 px-5 rounded-xl shadow-md"
              >
                API Key Ekle
              </button>
            </div>
          )}
        </div>

        {/* Courier Details Card */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">Kurye Bilgileri</div>
            
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                MY
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 text-base">{courier.name}</h4>
                <p className="text-xs text-slate-500">{courier.vehicle}</p>
                <span className="inline-block mt-1 bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  Plaka: {courier.plate}
                </span>
              </div>
            </div>

            <a
              href={`tel:${courier.phone}`}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 text-xs"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Kuryeyi Ara ({courier.phone})</span>
            </a>

            {/* Delivery address review */}
            <div className="mt-6 space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div className="font-bold text-slate-800">Teslimat Notu & Adres:</div>
              <div>{deliveryLocation.address}</div>
              <div className="text-slate-400 italic">"{deliveryLocation.note}"</div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={cancelOrder}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors"
            >
              Simülasyonu Sıfırla & Yeni Sipariş Ver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
