/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useECommerce } from '../context/ECommerceContext';
import { X, Key, ExternalLink, Check, MapPin, Sparkles } from 'lucide-react';

export default function ApiKeyModal() {
  const { isKeyModalOpen, setIsKeyModalOpen, apiKey, saveApiKey } = useECommerce();
  const [inputKey, setInputKey] = useState<string>(apiKey || '');

  if (!isKeyModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveApiKey(inputKey);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 relative">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={() => setIsKeyModalOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-blue-600/30">
            <Key className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-extrabold font-display">Google Maps API Anahtarı</h3>
          <p className="text-xs text-slate-300 mt-1">
            Haritada mağaza bulucu, Street View ve kurye takibi için API anahtarınızı girin.
          </p>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              API Key (Google Cloud Console)
            </label>
            <input
              type="text"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              required
              className="w-full text-xs p-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-blue-600/30 text-xs flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Kaydet & Haritaları Etkinleştir</span>
          </button>

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1.5 bg-slate-50 p-3 rounded-xl">
            <span className="font-bold text-slate-700 block">Ücretsiz Anahtar Nasıl Alınır?</span>
            <ol className="list-decimal list-inside space-y-1 text-slate-600">
              <li>Google Cloud Console hesabı oluşturun.</li>
              <li>"Maps JavaScript API" servisini aktifleştirin.</li>
              <li>Ücretsiz 200$ aylık kredi ile API anahtarınızı kopyalayın.</li>
            </ol>
          </div>
        </form>
      </div>
    </div>
  );
}
