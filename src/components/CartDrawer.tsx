/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useECommerce, isValidApiKey } from '../context/ECommerceContext';
import { Map, AdvancedMarker, Pin, useMap, APIProvider } from '@vis.gl/react-google-maps';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Truck, 
  Store, 
  MapPin, 
  ArrowRight, 
  Check, 
  Sparkles,
  CreditCard
} from 'lucide-react';

function PinpointMapInner({
  lat,
  lng,
  onLocationSelect,
}: {
  lat: number;
  lng: number;
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  return (
    <Map
      style={{ width: '100%', height: '100%' }}
      defaultCenter={{ lat, lng }}
      defaultZoom={15}
      gestureHandling="greedy"
      disableDefaultUI={true}
      mapId="DEMO_MAP_ID"
      onClick={(e) => {
        if (e.detail.latLng) {
          const l = e.detail.latLng as any;
          const newLat = typeof l.lat === 'function' ? l.lat() : l.lat;
          const newLng = typeof l.lng === 'function' ? l.lng() : l.lng;
          onLocationSelect(newLat, newLng);
        }
      }}
      internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
    >
      <AdvancedMarker position={{ lat, lng }}>
        <Pin background="#EF4444" borderColor="#991B1B" glyphColor="white" scale={1.2}>
          <MapPin className="w-4 h-4 text-white" />
        </Pin>
      </AdvancedMarker>
    </Map>
  );
}

export default function CartDrawer() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateQuantity, 
    cartTotal, 
    deliveryType, 
    setDeliveryType,
    deliveryLocation,
    setDeliveryLocation,
    selectedStore,
    placeOrder,
    apiKey
  } = useECommerce();

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [mapAuthError, setMapAuthError] = useState<boolean>(false);

  useEffect(() => {
    const handleAuthFailure = () => setMapAuthError(true);
    window.addEventListener('gmp-auth-failure', handleAuthFailure);
    return () => {
      window.removeEventListener('gmp-auth-failure', handleAuthFailure);
    };
  }, []);

  if (!isCartOpen) return null;

  const hasValidKey = Boolean(isValidApiKey(apiKey) && !mapAuthError);

  const handleLocationSelect = (lat: number, lng: number) => {
    setDeliveryLocation({
      ...deliveryLocation,
      lat,
      lng,
      address: `Pinpoint Konum (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div className="bg-white w-full max-w-lg h-full shadow-2xl flex flex-col justify-between relative overflow-hidden border-l border-slate-100">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-400" />
            <h2 className="font-extrabold text-lg">
              {step === 'cart' ? 'Alışveriş Sepetim' : 'Teslimat & Ödeme'}
            </h2>
          </div>
          <button
            onClick={() => {
              setIsCartOpen(false);
              setStep('cart');
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <ShoppingBag className="w-16 h-16 mx-auto mb-3 opacity-30" />
              <p className="font-semibold text-slate-700">Sepetiniz Boş</p>
              <p className="text-xs text-slate-400 mt-1">
                Mağazamızdan harika ürünler seçip sepetinize ekleyebilirsiniz.
              </p>
            </div>
          ) : step === 'cart' ? (
            /* Cart Items List */
            <div className="space-y-4">
              {cart.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-xl border border-slate-200/80 bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{product.title}</h4>
                    <div className="text-xs text-blue-600 font-extrabold mt-0.5">
                      {product.price.toLocaleString('tr-TR')} ₺
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Delivery method selection */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Teslimat Yöntemi Seçin:
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setDeliveryType('express')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      deliveryType === 'express'
                        ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-blue-600 mb-1" />
                    <div className="font-bold text-xs text-slate-900">30 Dk Express Kurye</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Kapınıza Canlı Harita Takibi</div>
                  </button>

                  <button
                    onClick={() => setDeliveryType('pickup')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      deliveryType === 'pickup'
                        ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <Store className="w-4 h-4 text-amber-500 mb-1" />
                    <div className="font-bold text-xs text-slate-900">Gel-Al Mağazadan</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Sıra Beklemeden Hazır (0 ₺)</div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Checkout Step: Map Location Picker & Address Form */
            <div className="space-y-4">
              {deliveryType === 'express' && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Haritadan Teslimat Konumunuzu Seçin:
                  </span>

                  {/* Interactive Pinpoint Map */}
                  <div className="w-full h-48 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative">
                    {hasValidKey ? (
                      <APIProvider apiKey={apiKey}>
                        <PinpointMapInner
                          lat={deliveryLocation.lat}
                          lng={deliveryLocation.lng}
                          onLocationSelect={handleLocationSelect}
                        />
                      </APIProvider>
                    ) : (
                      <div className="w-full h-full bg-slate-900 p-4 flex flex-col items-center justify-center text-center text-white">
                        <MapPin className="w-8 h-8 text-red-500 mb-1 animate-bounce" />
                        <span className="text-xs font-bold">Haritada Konum Seçici</span>
                        <span className="text-[10px] text-slate-300">Google Maps API key girerek haritaya tıklayıp konum seçebilirsiniz.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Address Form Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Açık Adres / Cadde Sokak</label>
                  <input
                    type="text"
                    value={deliveryLocation.address}
                    onChange={(e) => setDeliveryLocation({ ...deliveryLocation, address: e.target.value })}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">İlçe</label>
                    <input
                      type="text"
                      value={deliveryLocation.district}
                      onChange={(e) => setDeliveryLocation({ ...deliveryLocation, district: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Şehir</label>
                    <input
                      type="text"
                      value={deliveryLocation.city}
                      onChange={(e) => setDeliveryLocation({ ...deliveryLocation, city: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Sipariş Notu</label>
                  <input
                    type="text"
                    value={deliveryLocation.note}
                    onChange={(e) => setDeliveryLocation({ ...deliveryLocation, note: e.target.value })}
                    placeholder="Örn: Zile basmayın, kapıya bırakın."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Total & Place Order */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Ara Toplam:</span>
                <span className="font-semibold text-slate-900">
                  {(cartTotal - (deliveryType === 'express' ? 49 : 0)).toLocaleString('tr-TR')} ₺
                </span>
              </div>
              <div className="flex justify-between">
                <span>Teslimat Ücreti:</span>
                <span className="font-semibold text-slate-900">
                  {deliveryType === 'pickup' ? 'Ücretsiz (Gel-Al)' : '49 ₺'}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Toplam Tutar:</span>
                <span className="text-blue-600">{cartTotal.toLocaleString('tr-TR')} ₺</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                onClick={() => setStep('checkout')}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 text-sm"
              >
                <span>Teslimat Adımına Geç</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={placeOrder}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 text-sm"
              >
                <CreditCard className="w-4 h-4" />
                <span>Siparişi Tamamla & Kurye Çağır</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
