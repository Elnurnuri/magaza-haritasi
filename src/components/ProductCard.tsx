/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product } from '../types';
import { useECommerce } from '../context/ECommerceContext';
import { Star, ShoppingBag, MapPin, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  key?: React.Key;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, setSelectedProduct, selectedStore } = useECommerce();
  const isAvailableInSelectedStore = selectedStore ? product.storeStock[selectedStore.id] : true;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="bg-amber-500 text-slate-950 font-bold text-[10px] uppercase px-2.5 py-1 rounded-lg shadow-md tracking-wider">
              Çok Satılan
            </span>
          )}
          {product.isNew && (
            <span className="bg-blue-600 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-lg shadow-md tracking-wider">
              Yeni
            </span>
          )}
          {product.originalPrice && (
            <span className="bg-emerald-600 text-white font-bold text-[10px] px-2.5 py-1 rounded-lg shadow-md">
              %{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)} İndirim
            </span>
          )}
        </div>

        {/* Quick View Button */}
        <button
          onClick={() => setSelectedProduct(product)}
          className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-sm backdrop-blur-[2px]"
        >
          <div className="bg-white text-slate-900 px-4 py-2 rounded-xl font-semibold shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-4 h-4 text-blue-600" />
            <span>Detaylı İncele</span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Category & Store Stock */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-medium text-blue-600 uppercase tracking-wider text-[11px]">
              {product.category === 'electronics' && 'Elektronik'}
              {product.category === 'fashion' && 'Moda & Giyim'}
              {product.category === 'home' && 'Ev & Yaşam'}
              {product.category === 'gourmet' && 'Gurme'}
            </span>
            {selectedStore && (
              <span className={`inline-flex items-center gap-1 font-semibold text-[11px] ${
                isAvailableInSelectedStore ? 'text-emerald-600' : 'text-slate-400'
              }`}>
                <MapPin className="w-3 h-3" />
                {isAvailableInSelectedStore ? 'Mağazada Stokta' : 'Stok Yok'}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 
            onClick={() => setSelectedProduct(product)}
            className="font-bold text-slate-900 text-base hover:text-blue-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-800">{product.rating}</span>
            <span className="text-xs text-slate-400">({product.reviewsCount} değerlendirme)</span>
          </div>
        </div>

        {/* Footer Price & Add Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="text-xs text-slate-400 line-through">
              {product.originalPrice ? `${product.originalPrice.toLocaleString('tr-TR')} ₺` : ''}
            </div>
            <div className="text-lg font-extrabold text-slate-900">
              {product.price.toLocaleString('tr-TR')} <span className="text-sm font-semibold text-slate-600">₺</span>
            </div>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="bg-slate-900 hover:bg-blue-600 text-white font-medium text-xs py-2.5 px-4 rounded-xl transition-all flex items-center gap-2 shadow-sm hover:shadow-md active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Sepete Ekle</span>
          </button>
        </div>
      </div>
    </div>
  );
}
