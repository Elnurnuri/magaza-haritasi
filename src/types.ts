/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
  storeStock: Record<string, boolean>; // storeId -> available
  specs: string[];
}

export interface StoreLocation {
  id: string;
  name: string;
  district: string;
  city: string;
  address: string;
  phone: string;
  openHours: string;
  isOpen: boolean;
  lat: number;
  lng: number;
  image: string;
  rating: number;
  services: string[]; // e.g. ['Gel-Al (Click & Collect)', 'Hızlı Kurye (Express)', 'Otopark', 'Teknik Servis']
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedStoreId?: string;
}

export interface DeliveryLocation {
  lat: number;
  lng: number;
  address: string;
  city: string;
  district: string;
  neighborhood: string;
  buildingNo?: string;
  apartmentNo?: string;
  note?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  deliveryType: 'express' | 'pickup' | 'standard';
  deliveryLocation: DeliveryLocation;
  selectedStore?: StoreLocation;
  status: 'preparing' | 'on_the_way' | 'delivered';
  courier: {
    name: string;
    phone: string;
    vehicle: string;
    plate: string;
    lat: number;
    lng: number;
  };
  createdAt: string;
  estimatedMinutes: number;
}
