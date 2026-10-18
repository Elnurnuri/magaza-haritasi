/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, StoreLocation, CartItem, DeliveryLocation, Order } from '../types';
import { PRODUCTS, STORES } from '../constants';

export function isValidApiKey(key: unknown): boolean {
  if (typeof key !== 'string') return false;
  const trimmed = key.trim();
  return (
    trimmed.length >= 30 &&
    trimmed.startsWith('AIza') &&
    !trimmed.includes('YOUR_') &&
    !trimmed.includes('...')
  );
}

interface ECommerceContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  saveApiKey: (key: string) => void;
  activeTab: 'store' | 'stores-map' | 'live-tracking' | 'checkout';
  setActiveTab: (tab: 'store' | 'stores-map' | 'live-tracking' | 'checkout') => void;
  
  // Products
  products: Product[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, storeId?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  
  // Map & Delivery
  stores: StoreLocation[];
  selectedStore: StoreLocation | null;
  setSelectedStore: (store: StoreLocation | null) => void;
  deliveryLocation: DeliveryLocation;
  setDeliveryLocation: (loc: DeliveryLocation) => void;
  deliveryType: 'express' | 'pickup' | 'standard';
  setDeliveryType: (type: 'express' | 'pickup' | 'standard') => void;
  
  // Active Order & Live Courier Tracking
  activeOrder: Order | null;
  placeOrder: () => void;
  cancelOrder: () => void;
  
  // Modals & UI
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isKeyModalOpen: boolean;
  setIsKeyModalOpen: (open: boolean) => void;
}

const defaultDeliveryLoc: DeliveryLocation = {
  lat: 41.0082,
  lng: 28.9784,
  address: 'Sultanahmet Mah. Divanyolu Cad. No:12',
  city: 'İstanbul',
  district: 'Fatih',
  neighborhood: 'Sultanahmet',
  buildingNo: '12',
  apartmentNo: '4',
  note: 'Zile basıp kapıya bırakabilirsiniz.',
};

const ECommerceContext = createContext<ECommerceContextType | undefined>(undefined);

export function ECommerceProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'store' | 'stores-map' | 'live-tracking' | 'checkout'>('store');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [stores] = useState<StoreLocation[]>(STORES);
  const [selectedStore, setSelectedStore] = useState<StoreLocation | null>(STORES[0]);
  const [deliveryLocation, setDeliveryLocation] = useState<DeliveryLocation>(defaultDeliveryLoc);
  const [deliveryType, setDeliveryType] = useState<'express' | 'pickup' | 'standard'>('express');
  
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('google_maps_api_key');
    const envKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (isValidApiKey(storedKey)) {
      setApiKeyState(storedKey!.trim());
    } else if (isValidApiKey(envKey)) {
      setApiKeyState(envKey!.trim());
    }
  }, []);

  const saveApiKey = (key: string) => {
    const trimmed = key.trim();
    if (isValidApiKey(trimmed)) {
      localStorage.setItem('google_maps_api_key', trimmed);
      setApiKeyState(trimmed);
      setIsKeyModalOpen(false);
    }
  };

  const addToCart = (product: Product, storeId?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1, selectedStoreId: storeId || item.selectedStoreId }
            : item
        );
      }
      return [...prev, { product, quantity: 1, selectedStoreId: storeId || selectedStore?.id }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = deliveryType === 'pickup' ? 0 : deliveryType === 'express' ? 49 : 29;
  const cartTotal = cartSubtotal > 0 ? cartSubtotal + deliveryFee : 0;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Simulation courier movements for active order
  useEffect(() => {
    if (!activeOrder || activeOrder.status === 'delivered') return;

    const startLat = activeOrder.selectedStore?.lat || 40.9856;
    const startLng = activeOrder.selectedStore?.lng || 29.0268;
    const endLat = activeOrder.deliveryLocation.lat;
    const endLng = activeOrder.deliveryLocation.lng;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.05;
      if (progress >= 1) {
        progress = 1;
        setActiveOrder((prev) => (prev ? { ...prev, status: 'delivered' } : null));
        clearInterval(interval);
      } else {
        const curLat = startLat + (endLat - startLat) * progress;
        const curLng = startLng + (endLng - startLng) * progress;
        const currentStatus = progress > 0.15 ? 'on_the_way' : 'preparing';

        setActiveOrder((prev) =>
          prev
            ? {
                ...prev,
                status: currentStatus,
                courier: { ...prev.courier, lat: curLat, lng: curLng },
                estimatedMinutes: Math.max(1, Math.round((1 - progress) * 25)),
              }
            : null
        );
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activeOrder?.id, activeOrder?.status]);

  const placeOrder = () => {
    if (cart.length === 0) return;

    const store = selectedStore || STORES[0];
    const newOrder: Order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cart],
      totalAmount: cartTotal,
      subtotal: cartSubtotal,
      deliveryFee: deliveryFee,
      discount: 0,
      deliveryType: deliveryType,
      deliveryLocation: { ...deliveryLocation },
      selectedStore: store,
      status: 'preparing',
      courier: {
        name: 'Murat Yılmaz',
        phone: '+90 532 890 1234',
        vehicle: 'Sessiz Elektrikli Kurye Motoru',
        plate: '34 GEO 891',
        lat: store.lat,
        lng: store.lng,
      },
      createdAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      estimatedMinutes: 25,
    };

    setActiveOrder(newOrder);
    clearCart();
    setIsCartOpen(false);
    setActiveTab('live-tracking');
  };

  const cancelOrder = () => {
    setActiveOrder(null);
  };

  return (
    <ECommerceContext.Provider
      value={{
        apiKey,
        setApiKey: setApiKeyState,
        saveApiKey,
        activeTab,
        setActiveTab,
        products: PRODUCTS,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        stores,
        selectedStore,
        setSelectedStore,
        deliveryLocation,
        setDeliveryLocation,
        deliveryType,
        setDeliveryType,
        activeOrder,
        placeOrder,
        cancelOrder,
        isCartOpen,
        setIsCartOpen,
        isKeyModalOpen,
        setIsKeyModalOpen,
      }}
    >
      {children}
    </ECommerceContext.Provider>
  );
}

export function useECommerce() {
  const context = useContext(ECommerceContext);
  if (!context) {
    throw new Error('useECommerce must be used within an ECommerceProvider');
  }
  return context;
}
