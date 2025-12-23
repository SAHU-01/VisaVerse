'use client';

import { usePreferencesStore } from '@/store';

const availableCountries = [
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
];

export function CountrySelect() {
  const { default_countries, toggleCountry } = usePreferencesStore();

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-0">
      {/* Responsive grid: 2 cols on mobile, 3 cols on tablet+ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {availableCountries.map((country) => {
          const isSelected = default_countries.includes(country.name);
          return (
            <button
              key={country.code}
              onClick={() => toggleCountry(country.name)}
              className={`flex items-center gap-2 sm:gap-3 px-3 py-3 sm:px-5 sm:py-4 rounded-lg sm:rounded-xl transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500 shadow-lg shadow-purple-500/20'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <span className="text-xl sm:text-2xl">{country.flag}</span>
              <span className={`font-medium text-sm sm:text-base truncate ${isSelected ? 'text-white' : 'text-white/70'}`}>
                {country.name}
              </span>
              {isSelected && (
                <span className="ml-auto text-green-400 text-sm sm:text-base flex-shrink-0">✓</span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Selection count - responsive text */}
      {default_countries.length > 0 && (
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-white/50 text-sm sm:text-base">
            <span className="text-white font-semibold">{default_countries.length}</span>{' '}
            {default_countries.length === 1 ? 'country' : 'countries'} selected
          </p>
        </div>
      )}
    </div>
  );
}