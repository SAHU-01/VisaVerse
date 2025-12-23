'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BubbleMenu } from '@/components';
import { usePreferencesStore, AssetClass, InvestorType } from '@/store';

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

const countries = [
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
];

const investorTypes: { id: InvestorType; label: string; description: string; icon: string }[] = [
  { id: 'individual', label: 'Individual', description: 'Personal investor', icon: '👤' },
  { id: 'company', label: 'Company', description: 'Corporate entity', icon: '🏢' },
  { id: 'nri', label: 'NRI', description: 'Non-Resident Indian', icon: '🌏' },
  { id: 'huf', label: 'HUF', description: 'Hindu Undivided Family', icon: '👨‍👩‍👧‍👦' },
  { id: 'llp', label: 'LLP', description: 'Limited Liability Partnership', icon: '🤝' },
  { id: 'fund', label: 'Fund', description: 'Investment fund', icon: '📊' },
];

const TOTAL_STEPS = 5;

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const {
    preferred_intents,
    toggleIntent,
    persona,
    setPersona,
    default_countries,
    toggleCountry,
    onboardingStep,
    onboardingComplete,
    nextStep,
    prevStep,
    completeOnboarding,
  } = usePreferencesStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && onboardingComplete) {
      router.push('/app/ask');
    }
  }, [mounted, onboardingComplete, router]);

  const handleItemClick = (item: { label: string }) => {
    const assetClass = labelToAssetClass[item.label];
    if (assetClass) {
      toggleIntent(assetClass);
    }
  };

  const selectedLabels = preferred_intents.map((intent) => {
    return Object.entries(labelToAssetClass).find(([, value]) => value === intent)?.[0] || '';
  });

  const canProceed = () => {
    switch (onboardingStep) {
      case 1: return preferred_intents.length > 0;
      case 2: return !!persona.residency;
      case 3: return !!persona.citizenship;
      case 4: return !!persona.investor_type;
      case 5: return default_countries.length > 0;
      default: return false;
    }
  };

  const handleContinue = () => {
    if (onboardingStep === TOTAL_STEPS) {
      completeOnboarding();
    } else {
      nextStep();
    }
  };

  const getStepTitle = () => {
    switch (onboardingStep) {
      case 1: return { title: 'What brings you here?', subtitle: 'Select the areas you\'d like help with' };
      case 2: return { title: 'Where do you live?', subtitle: 'Select your current country of residence' };
      case 3: return { title: 'What\'s your citizenship?', subtitle: 'Select your passport country' };
      case 4: return { title: 'What type of investor are you?', subtitle: 'Select the category that best describes you' };
      case 5: return { title: 'Which countries interest you?', subtitle: 'Select countries relevant to your investments' };
      default: return { title: '', subtitle: '' };
    }
  };

  if (!mounted) return null;

  const { title, subtitle } = getStepTitle();

  return (
    <main className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 sm:py-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            visa
          </span>
          <span className="text-white/90">verse</span>
        </h1>
      </nav>

      {/* Main content - with proper padding for fixed elements */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-20 sm:pt-24 pb-32 sm:pb-40">
       
        {/* Title - always centered */}
        <div className="w-full max-w-4xl mx-auto text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            {title}
          </h2>
          <p className="mt-2 sm:mt-3 md:mt-4 text-white/50 text-sm sm:text-base md:text-lg lg:text-xl leading-snug">
            {subtitle}
          </p>
        </div>

        {/* Step 1: Interests */}
        {onboardingStep === 1 && (
          <div className="w-full flex justify-center">
            <BubbleMenu
              items={menuItems}
              menuBg="#fff"
              menuContentColor="#111"
              onItemClick={handleItemClick}
              selectedItems={selectedLabels}
            />
          </div>
        )}

        {/* Step 2: Residency */}
        {onboardingStep === 2 && (
          <div className="w-full max-w-3xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {countries.map((country) => {
                const isSelected = persona.residency === country.name;
                return (
                  <button
                    key={country.code}
                    onClick={() => setPersona({ residency: country.name })}
                    className={`group relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl sm:rounded-2xl border transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50 shadow-xl shadow-purple-500/20 scale-105'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05] hover:scale-105'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <span className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 transform transition-transform group-hover:scale-110">
                      {country.flag}
                    </span>
                    <span className={`text-sm sm:text-base font-medium transition-colors text-center ${
                      isSelected ? 'text-white' : 'text-white/70 group-hover:text-white'
                    }`}>
                      {country.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Citizenship */}
        {onboardingStep === 3 && (
          <div className="w-full max-w-3xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {countries.map((country) => {
                const isSelected = persona.citizenship === country.name;
                return (
                  <button
                    key={country.code}
                    onClick={() => setPersona({ citizenship: country.name })}
                    className={`group relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl sm:rounded-2xl border transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-br from-pink-500/20 to-orange-500/20 border-pink-500/50 shadow-xl shadow-pink-500/20 scale-105'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05] hover:scale-105'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 flex items-center justify-center">
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <span className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 transform transition-transform group-hover:scale-110">
                      {country.flag}
                    </span>
                    <span className={`text-sm sm:text-base font-medium transition-colors text-center ${
                      isSelected ? 'text-white' : 'text-white/70 group-hover:text-white'
                    }`}>
                      {country.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Investor Type */}
        {onboardingStep === 4 && (
          <div className="w-full max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {investorTypes.map((type) => {
                const isSelected = persona.investor_type === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setPersona({ investor_type: type.id })}
                    className={`group relative flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl border transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50 shadow-xl shadow-purple-500/20 scale-105'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05] hover:scale-105'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <span className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 md:mb-4 transform transition-transform group-hover:scale-110">
                      {type.icon}
                    </span>
                    <span className={`text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 transition-colors text-center ${
                      isSelected ? 'text-white' : 'text-white/80 group-hover:text-white'
                    }`}>
                      {type.label}
                    </span>
                    <span className={`text-xs sm:text-sm text-center transition-colors ${
                      isSelected ? 'text-white/60' : 'text-white/40'
                    }`}>
                      {type.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Countries of Interest */}
        {onboardingStep === 5 && (
          <div className="w-full max-w-3xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {countries.map((country) => {
                const isSelected = default_countries.includes(country.name);
                return (
                  <button
                    key={country.code}
                    onClick={() => toggleCountry(country.name)}
                    className={`group relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-xl sm:rounded-2xl border transition-all duration-300 ${
                      isSelected
                        ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border-cyan-500/50 shadow-xl shadow-cyan-500/20 scale-105'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05] hover:scale-105'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    )}
                    <span className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 transform transition-transform group-hover:scale-110">
                      {country.flag}
                    </span>
                    <span className={`text-sm sm:text-base font-medium transition-colors text-center ${
                      isSelected ? 'text-white' : 'text-white/70 group-hover:text-white'
                    }`}>
                      {country.name}
                    </span>
                  </button>
                );
              })}
            </div>
            
            {default_countries.length > 0 && (
              <div className="mt-6 sm:mt-8 text-center">
                <p className="text-white/50 text-sm sm:text-base">
                  <span className="text-white font-semibold">{default_countries.length}</span> {default_countries.length === 1 ? 'country' : 'countries'} selected
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Fixed bottom navigation - properly centered and spaced */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[#050508] via-[#050508]/95 to-transparent">
        <div className="flex justify-center px-4 sm:px-6 py-4 sm:py-6">
          <div className="w-full max-w-md flex items-center justify-center gap-3 sm:gap-4">
            {onboardingStep > 1 && (
              <button
                onClick={prevStep}
                className="px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-medium bg-white/5 text-white/70 hover:bg-white/10 transition-all duration-300 border border-white/10 hover:border-white/20"
              >
                ←
              </button>
            )}
            <button
              onClick={handleContinue}
              disabled={!canProceed()}
              className={`flex-1 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold transition-all duration-300 ${
                canProceed()
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white cursor-pointer shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-[1.02]'
                  : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
              }`}
            >
              {onboardingStep === TOTAL_STEPS ? 'Get Started →' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}