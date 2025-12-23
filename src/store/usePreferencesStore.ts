// // import { create } from 'zustand';
// // import { persist } from 'zustand/middleware';

// // export type AssetClass = 
// //   | 'real_estate' 
// //   | 'investing' 
// //   | 'crypto' 
// //   | 'startups' 
// //   | 'tax';

// // export interface UserPreferencesState {
// //   preferred_intents: AssetClass[];
// //   default_asset_class_any: AssetClass[];
// //   onboardingComplete: boolean;
  
// //   toggleIntent: (intent: AssetClass) => void;
// //   setIntents: (intents: AssetClass[]) => void;
// //   clearIntents: () => void;
// //   completeOnboarding: () => void;
// //   resetOnboarding: () => void;
// // }

// // export const usePreferencesStore = create<UserPreferencesState>()(
// //   persist(
// //     (set, get) => ({
// //       preferred_intents: [],
// //       default_asset_class_any: [],
// //       onboardingComplete: false,

// //       toggleIntent: (intent: AssetClass) => {
// //         const current = get().preferred_intents;
// //         const exists = current.includes(intent);
        
// //         const newIntents = exists
// //           ? current.filter((i) => i !== intent)
// //           : [...current, intent];
        
// //         set({
// //           preferred_intents: newIntents,
// //           default_asset_class_any: newIntents,
// //         });
// //       },

// //       setIntents: (intents: AssetClass[]) => {
// //         set({
// //           preferred_intents: intents,
// //           default_asset_class_any: intents,
// //         });
// //       },

// //       clearIntents: () => {
// //         set({
// //           preferred_intents: [],
// //           default_asset_class_any: [],
// //         });
// //       },

// //       completeOnboarding: () => {
// //         set({ onboardingComplete: true });
// //       },

// //       resetOnboarding: () => {
// //         set({
// //           preferred_intents: [],
// //           default_asset_class_any: [],
// //           onboardingComplete: false,
// //         });
// //       },
// //     }),
// //     {
// //       name: 'visaverse-preferences',
// //     }
// //   )
// // );

// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// export type AssetClass = 
//   | 'real_estate' 
//   | 'investing' 
//   | 'crypto' 
//   | 'startups' 
//   | 'tax';

// export type InvestorType = 'individual' | 'company' | 'nri' | 'huf' | 'llp' | 'fund';

// export interface Persona {
//   citizenship: string;
//   residency: string;
//   investor_type: InvestorType;
// }

// export interface UserPreferencesState {
//   // Step 1: Interests
//   preferred_intents: AssetClass[];
//   default_asset_class_any: AssetClass[];
  
//   // Step 2: Persona
//   persona: Persona;
  
//   // Step 3: Countries
//   default_countries: string[];
  
//   // Onboarding state
//   onboardingStep: number;
//   onboardingComplete: boolean;
  
//   // Actions
//   toggleIntent: (intent: AssetClass) => void;
//   setIntents: (intents: AssetClass[]) => void;
//   setPersona: (persona: Partial<Persona>) => void;
//   toggleCountry: (country: string) => void;
//   setCountries: (countries: string[]) => void;
//   nextStep: () => void;
//   prevStep: () => void;
//   completeOnboarding: () => void;
//   resetOnboarding: () => void;
// }

// export const usePreferencesStore = create<UserPreferencesState>()(
//   persist(
//     (set, get) => ({
//       preferred_intents: [],
//       default_asset_class_any: [],
//       persona: {
//         citizenship: '',
//         residency: '',
//         investor_type: 'individual',
//       },
//       default_countries: [],
//       onboardingStep: 1,
//       onboardingComplete: false,

//       toggleIntent: (intent: AssetClass) => {
//         const current = get().preferred_intents;
//         const exists = current.includes(intent);
//         const newIntents = exists
//           ? current.filter((i) => i !== intent)
//           : [...current, intent];
//         set({
//           preferred_intents: newIntents,
//           default_asset_class_any: newIntents,
//         });
//       },

//       setIntents: (intents: AssetClass[]) => {
//         set({
//           preferred_intents: intents,
//           default_asset_class_any: intents,
//         });
//       },

//       setPersona: (persona: Partial<Persona>) => {
//         set({
//           persona: { ...get().persona, ...persona },
//         });
//       },

//       toggleCountry: (country: string) => {
//         const current = get().default_countries;
//         const exists = current.includes(country);
//         const newCountries = exists
//           ? current.filter((c) => c !== country)
//           : [...current, country];
//         set({ default_countries: newCountries });
//       },

//       setCountries: (countries: string[]) => {
//         set({ default_countries: countries });
//       },

//       nextStep: () => {
//         set({ onboardingStep: get().onboardingStep + 1 });
//       },

//       prevStep: () => {
//         set({ onboardingStep: Math.max(1, get().onboardingStep - 1) });
//       },

//       completeOnboarding: () => {
//         set({ onboardingComplete: true });
//       },

//       resetOnboarding: () => {
//         set({
//           preferred_intents: [],
//           default_asset_class_any: [],
//           persona: {
//             citizenship: '',
//             residency: '',
//             investor_type: 'individual',
//           },
//           default_countries: [],
//           onboardingStep: 1,
//           onboardingComplete: false,
//         });
//       },
//     }),
//     {
//       name: 'visaverse-preferences',
//     }
//   )
// );

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AssetClass = 
  | 'real_estate' 
  | 'investing' 
  | 'crypto' 
  | 'startups' 
  | 'tax';

export type InvestorType = 'individual' | 'company' | 'nri' | 'huf' | 'llp' | 'fund';

export interface Persona {
  citizenship: string;
  residency: string;
  investor_type: InvestorType;
}

export interface UserPreferencesState {
  // Step 1: Interests
  preferred_intents: AssetClass[];
  default_asset_class_any: AssetClass[];
  
  // Step 2: Persona
  persona: Persona;
  
  // Step 3: Countries
  default_countries: string[];
  
  // Onboarding state - now 5 steps total
  // 1 = interests, 2 = residency, 3 = citizenship, 4 = investor type, 5 = countries
  onboardingStep: number;
  onboardingComplete: boolean;
  
  // Actions
  toggleIntent: (intent: AssetClass) => void;
  setIntents: (intents: AssetClass[]) => void;
  setPersona: (persona: Partial<Persona>) => void;
  toggleCountry: (country: string) => void;
  setCountries: (countries: string[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const usePreferencesStore = create<UserPreferencesState>()(
  persist(
    (set, get) => ({
      preferred_intents: [],
      default_asset_class_any: [],
      persona: {
        citizenship: '',
        residency: '',
        investor_type: 'individual',
      },
      default_countries: [],
      onboardingStep: 1,
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

      setPersona: (persona: Partial<Persona>) => {
        set({
          persona: { ...get().persona, ...persona },
        });
      },

      toggleCountry: (country: string) => {
        const current = get().default_countries;
        const exists = current.includes(country);
        const newCountries = exists
          ? current.filter((c) => c !== country)
          : [...current, country];
        set({ default_countries: newCountries });
      },

      setCountries: (countries: string[]) => {
        set({ default_countries: countries });
      },

      nextStep: () => {
        const current = get().onboardingStep;
        if (current < 5) {
          set({ onboardingStep: current + 1 });
        }
      },

      prevStep: () => {
        set({ onboardingStep: Math.max(1, get().onboardingStep - 1) });
      },

      completeOnboarding: () => {
        set({ onboardingComplete: true });
      },

      resetOnboarding: () => {
        set({
          preferred_intents: [],
          default_asset_class_any: [],
          persona: {
            citizenship: '',
            residency: '',
            investor_type: 'individual',
          },
          default_countries: [],
          onboardingStep: 1,
          onboardingComplete: false,
        });
      },
    }),
    {
      name: 'visaverse-preferences',
    }
  )
);