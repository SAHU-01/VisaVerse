'use client';

import { useState } from 'react';
import { usePreferencesStore, InvestorType } from '@/store';

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
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
];

const investorTypes: { id: InvestorType; label: string; description: string; icon: string }[] = [
  { id: 'individual', label: 'Individual', description: 'Personal investor', icon: '👤' },
  { id: 'company', label: 'Company', description: 'Corporate entity', icon: '🏢' },
  { id: 'nri', label: 'NRI', description: 'Non-Resident Indian', icon: '🌏' },
  { id: 'huf', label: 'HUF', description: 'Hindu Undivided Family', icon: '👨‍👩‍👧‍👦' },
  { id: 'llp', label: 'LLP', description: 'Limited Liability Partnership', icon: '🤝' },
  { id: 'fund', label: 'Fund', description: 'Investment fund', icon: '📊' },
];

export function PersonaForm() {
  const { persona, setPersona } = usePreferencesStore();
  const [citizenshipOpen, setCitizenshipOpen] = useState(false);
  const [residencyOpen, setResidencyOpen] = useState(false);

  const selectedCitizenship = countries.find((c) => c.name === persona.citizenship);
  const selectedResidency = countries.find((c) => c.name === persona.residency);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
      {/* Two column layout for dropdowns - stacks on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-10 mb-8 sm:mb-12">
        
        {/* Citizenship Card */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-xl sm:rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
          <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <label className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-medium text-white/90 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm sm:text-base">Citizenship</p>
                <p className="text-xs sm:text-sm text-white/40 font-normal">Your passport country</p>
              </div>
            </label>
            
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setCitizenshipOpen(!citizenshipOpen);
                  setResidencyOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 rounded-lg sm:rounded-xl bg-black/30 border border-white/10 hover:border-purple-500/50 focus:border-purple-500 transition-all duration-300 text-left"
              >
                {selectedCitizenship ? (
                  <span className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl">{selectedCitizenship.flag}</span>
                    <span className="text-white text-base sm:text-lg">{selectedCitizenship.name}</span>
                  </span>
                ) : (
                  <span className="text-white/40 text-sm sm:text-base">Select country</span>
                )}
                <svg
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-white/40 transition-transform duration-300 ${citizenshipOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {citizenshipOpen && (
                <div className="absolute z-50 w-full mt-2 py-2 bg-gray-900/98 backdrop-blur-xl border border-white/10 rounded-lg sm:rounded-xl shadow-2xl shadow-black/50 max-h-60 sm:max-h-72 overflow-y-auto">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => {
                        setPersona({ citizenship: country.name });
                        setCitizenshipOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-5 sm:py-3 hover:bg-white/10 transition-colors text-sm sm:text-base ${
                        persona.citizenship === country.name ? 'bg-purple-500/20 text-purple-300' : 'text-white/80'
                      }`}
                    >
                      <span className="text-xl sm:text-2xl">{country.flag}</span>
                      <span>{country.name}</span>
                      {persona.citizenship === country.name && (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-auto text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Residency Card */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600/30 to-orange-600/30 rounded-xl sm:rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
          <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <label className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base font-medium text-white/90 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-pink-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm sm:text-base">Residency</p>
                <p className="text-xs sm:text-sm text-white/40 font-normal">Where you currently live</p>
              </div>
            </label>
            
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setResidencyOpen(!residencyOpen);
                  setCitizenshipOpen(false);
                }}
                className="w-full flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 rounded-lg sm:rounded-xl bg-black/30 border border-white/10 hover:border-pink-500/50 focus:border-pink-500 transition-all duration-300 text-left"
              >
                {selectedResidency ? (
                  <span className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl">{selectedResidency.flag}</span>
                    <span className="text-white text-base sm:text-lg">{selectedResidency.name}</span>
                  </span>
                ) : (
                  <span className="text-white/40 text-sm sm:text-base">Select country</span>
                )}
                <svg
                  className={`w-4 h-4 sm:w-5 sm:h-5 text-white/40 transition-transform duration-300 ${residencyOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {residencyOpen && (
                <div className="absolute z-50 w-full mt-2 py-2 bg-gray-900/98 backdrop-blur-xl border border-white/10 rounded-lg sm:rounded-xl shadow-2xl shadow-black/50 max-h-60 sm:max-h-72 overflow-y-auto">
                  {countries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => {
                        setPersona({ residency: country.name });
                        setResidencyOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:px-5 sm:py-3 hover:bg-white/10 transition-colors text-sm sm:text-base ${
                        persona.residency === country.name ? 'bg-pink-500/20 text-pink-300' : 'text-white/80'
                      }`}
                    >
                      <span className="text-xl sm:text-2xl">{country.flag}</span>
                      <span>{country.name}</span>
                      {persona.residency === country.name && (
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-auto text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Investor Type Section */}
      <div className="mb-6 sm:mb-8">
        <div className="text-center mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">What type of investor are you?</h3>
          <p className="text-white/40 text-sm sm:text-base">Select the category that best describes you</p>
        </div>
        
        {/* Responsive grid: 2 cols mobile, 3 cols tablet, 6 cols desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {investorTypes.map((type) => {
            const isSelected = persona.investor_type === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setPersona({ investor_type: type.id })}
                className={`group relative flex flex-col items-center justify-center p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl border transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-500/50 shadow-xl shadow-purple-500/20 scale-105'
                    : 'bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.05] hover:scale-[1.02]'
                }`}
              >
                {/* Selection ring */}
                {isSelected && (
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl opacity-20 blur" />
                )}
                
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
                
                <span className="text-2xl sm:text-3xl mb-2 sm:mb-3 transform transition-transform group-hover:scale-110">
                  {type.icon}
                </span>
                <span className={`text-sm sm:text-base font-semibold mb-0.5 sm:mb-1 transition-colors text-center ${
                  isSelected ? 'text-white' : 'text-white/70 group-hover:text-white'
                }`}>
                  {type.label}
                </span>
                <span className={`text-[10px] sm:text-xs transition-colors text-center leading-tight ${
                  isSelected ? 'text-white/60' : 'text-white/40'
                }`}>
                  {type.description}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}