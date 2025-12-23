// 'use client';

// import { motion, AnimatePresence } from 'framer-motion';
// import { usePreferencesStore, AssetClass } from '@/store';

// const labelMap: Record<AssetClass, string> = {
//   real_estate: 'Real Estate',
//   investing: 'Investing',
//   crypto: 'Crypto',
//   startups: 'Startups',
//   tax: 'Taxes & Compliance',
// };

// interface SelectionSummaryProps {
//   onContinue: () => void;
// }

// export function SelectionSummary({ onContinue }: SelectionSummaryProps) {
//   const { preferred_intents, default_asset_class_any } = usePreferencesStore();

//   const hasSelections = preferred_intents.length > 0;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: 0.5, duration: 0.5 }}
//       className="w-full max-w-xl mx-auto mt-8"
//     >
//       <AnimatePresence mode="popLayout">
//         {hasSelections && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: 'auto' }}
//             exit={{ opacity: 0, height: 0 }}
//             className="mb-6"
//           >
//             <p className="text-white/50 text-sm mb-3 text-center">Selected interests:</p>
//             <div className="flex flex-wrap justify-center gap-2">
//               {preferred_intents.map((intent, index) => (
//                 <motion.span
//                   key={intent}
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0, scale: 0.8 }}
//                   transition={{ delay: index * 0.05 }}
//                   className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm"
//                 >
//                   {labelMap[intent]}
//                 </motion.span>
//               ))}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {hasSelections && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 p-4 mb-6"
//           >
//             <p className="text-xs text-white/40 mb-2 font-mono">// Store state preview</p>
//             <pre className="text-xs text-green-400/80 font-mono overflow-x-auto">
// {`{
//   preferred_intents: ${JSON.stringify(preferred_intents, null, 2)},
//   default_asset_class_any: ${JSON.stringify(default_asset_class_any, null, 2)}
// }`}
//             </pre>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <motion.button
//         whileHover={{ scale: hasSelections ? 1.02 : 1 }}
//         whileTap={{ scale: hasSelections ? 0.98 : 1 }}
//         onClick={hasSelections ? onContinue : undefined}
//         disabled={!hasSelections}
//         className={`
//           w-full py-4 rounded-2xl font-display text-lg font-medium tracking-wide
//           transition-all duration-300
//           ${hasSelections
//             ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white cursor-pointer shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
//             : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
//           }
//         `}
//       >
//         {hasSelections ? 'Continue' : 'Select at least one interest'}
//       </motion.button>
//     </motion.div>
//   );
// }


'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePreferencesStore, AssetClass } from '@/store';

const labelMap: Record<AssetClass, string> = {
  real_estate: 'Real Estate',
  investing: 'Investing',
  crypto: 'Crypto',
  startups: 'Startups',
  tax: 'Taxes & Compliance',
};

interface SelectionSummaryProps {
  onContinue: () => void;
}

export function SelectionSummary({ onContinue }: SelectionSummaryProps) {
  const { preferred_intents, default_asset_class_any } = usePreferencesStore();

  const hasSelections = preferred_intents.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="w-full max-w-xl mx-auto mt-6 sm:mt-8 px-4 sm:px-0"
    >
      <AnimatePresence mode="popLayout">
        {hasSelections && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 sm:mb-6"
          >
            <p className="text-white/50 text-xs sm:text-sm mb-2 sm:mb-3 text-center">Selected interests:</p>
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
              {preferred_intents.map((intent, index) => (
                <motion.span
                  key={intent}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05 }}
                  className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs sm:text-sm"
                >
                  {labelMap[intent]}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hasSelections && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-black/40 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10 p-3 sm:p-4 mb-4 sm:mb-6 overflow-hidden"
          >
            <p className="text-[10px] sm:text-xs text-white/40 mb-1.5 sm:mb-2 font-mono">// Store state preview</p>
            <pre className="text-[10px] sm:text-xs text-green-400/80 font-mono overflow-x-auto whitespace-pre-wrap break-all">
{`{
  preferred_intents: ${JSON.stringify(preferred_intents, null, 2)},
  default_asset_class_any: ${JSON.stringify(default_asset_class_any, null, 2)}
}`}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: hasSelections ? 1.02 : 1 }}
        whileTap={{ scale: hasSelections ? 0.98 : 1 }}
        onClick={hasSelections ? onContinue : undefined}
        disabled={!hasSelections}
        className={`
          w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-display text-base sm:text-lg font-medium tracking-wide
          transition-all duration-300
          ${hasSelections
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white cursor-pointer shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50'
            : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
          }
        `}
      >
        {hasSelections ? 'Continue' : 'Select at least one interest'}
      </motion.button>
    </motion.div>
  );
}