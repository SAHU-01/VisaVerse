'use client';

import { useEffect, useState } from 'react';
import {BubbleMenu} from '@/components';
import { usePreferencesStore, AssetClass } from '@/store';

const menuItems = [
  { label: 'Real Estate', rotation: -9, hoverStyles: { bgColor: '#f97316', textColor: '#fff' } },
  { label: 'Investing', rotation: 5, hoverStyles: { bgColor: '#14b8a6', textColor: '#fff' } },
  { label: 'Crypto', rotation: -3, hoverStyles: { bgColor: '#8b5cf6', textColor: '#fff' } },
  { label: 'Startups', rotation: 7, hoverStyles: { bgColor: '#ec4899', textColor: '#fff' } },
  { label: 'Taxes & Compliance', rotation: -5, hoverStyles: { bgColor: '#06b6d4', textColor: '#fff' } },
];

const labelToAssetClass: Record<string, AssetClass> = {
  'Real Estate': 'real_estate',
  'Investing': 'investing',
  'Crypto': 'crypto',
  'Startups': 'startups',
  'Taxes & Compliance': 'tax',
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { preferred_intents, toggleIntent } = usePreferencesStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleItemClick = (item: { label: string }) => {
    const assetClass = labelToAssetClass[item.label];
    if (assetClass) {
      toggleIntent(assetClass);
    }
  };

  const selectedLabels = preferred_intents.map((intent) => {
    return Object.entries(labelToAssetClass).find(([, value]) => value === intent)?.[0] || '';
  });

  if (!mounted) return null;

  return (
    <main className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            visa
          </span>
          <span className="text-white/90">verse</span>
        </h1>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-20">
        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-3 text-center font-display">
          What brings you here?
        </h2>
        <p className="text-white/50 text-lg max-w-md mx-auto text-center mb-8">
          Select the areas you'd like help with. Choose as many as you need.
        </p>

        {/* Bubble Menu */}
        <BubbleMenu
          items={menuItems}
          menuBg="#fff"
          menuContentColor="#111"
          onItemClick={handleItemClick}
          selectedItems={selectedLabels}
        />

        {/* Continue button */}
        <button
          disabled={preferred_intents.length === 0}
          className={`mt-10 w-full max-w-xl py-4 rounded-2xl text-lg font-medium transition-all duration-300 ${
            preferred_intents.length > 0
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white cursor-pointer shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
              : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
          }`}
        >
          {preferred_intents.length > 0 ? 'Continue' : 'Select at least one interest'}
        </button>
      </div>
    </main>
  );
}