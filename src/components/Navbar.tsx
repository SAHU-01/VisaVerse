'use client';

import { motion } from 'framer-motion';
import { usePreferencesStore } from '@/store';

export function Navbar() {
  const { resetOnboarding, onboardingComplete } = usePreferencesStore();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2"
        >
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-50" />
            
            <h1 className="relative font-display text-2xl md:text-3xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                visa
              </span>
              <span className="text-white/90">verse</span>
            </h1>
          </div>
        </motion.div>

        {onboardingComplete && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={resetOnboarding}
            className="text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            Reset preferences
          </motion.button>
        )}
      </div>
    </motion.nav>
  );
}