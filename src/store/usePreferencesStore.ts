import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AssetClass = 
  | 'real_estate' 
  | 'investing' 
  | 'crypto' 
  | 'startups' 
  | 'tax';

export interface UserPreferencesState {
  preferred_intents: AssetClass[];
  default_asset_class_any: AssetClass[];
  onboardingComplete: boolean;
  
  toggleIntent: (intent: AssetClass) => void;
  setIntents: (intents: AssetClass[]) => void;
  clearIntents: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const usePreferencesStore = create<UserPreferencesState>()(
  persist(
    (set, get) => ({
      preferred_intents: [],
      default_asset_class_any: [],
      onboardingComplete: false,

      toggleIntent: (intent: AssetClass) => {
        const current = get().preferred_intents;
        const exists = current.includes(intent);
        
        const newIntents = exists
          ? current.filter((i) => i !== intent)
          : [...current, intent];
        
        set({
          preferred_intents: newIntents,
          default_asset_class_any: newIntents,
        });
      },

      setIntents: (intents: AssetClass[]) => {
        set({
          preferred_intents: intents,
          default_asset_class_any: intents,
        });
      },

      clearIntents: () => {
        set({
          preferred_intents: [],
          default_asset_class_any: [],
        });
      },

      completeOnboarding: () => {
        set({ onboardingComplete: true });
      },

      resetOnboarding: () => {
        set({
          preferred_intents: [],
          default_asset_class_any: [],
          onboardingComplete: false,
        });
      },
    }),
    {
      name: 'visaverse-preferences',
    }
  )
);