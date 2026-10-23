import React from 'react';
import { motion } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

export const LetterModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md select-none"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.94, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-lg w-full bg-[#fdfbf7] text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-300/70 relative flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-900/10 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-900 border border-amber-400/30">
              <Heart className="w-4 h-4 fill-amber-700 text-amber-700" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-amber-950">
                A Quiet Note for You
              </h2>
              <p className="text-xs text-amber-800/80 font-serif italic">
                From Samreedh • No rush, no deadlines
              </p>
            </div>
          </div>

          <button 
            onClick={() => {
              soundEngine.playPop();
              onClose();
            }}
            aria-label="Close Note"
            className="p-1.5 rounded-full hover:bg-amber-900/10 text-amber-900/70 hover:text-amber-950 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Letter Body - Thoughtful, Warm, Concise */}
        <div className="space-y-3.5 text-slate-700 text-sm sm:text-base leading-relaxed font-sans">
          <p className="font-serif text-lg font-bold text-amber-950">
            Dearest Lin (Talinbon),
          </p>

          <p className="font-light">
            Whenever the hospital postings feel too heavy, the 8:00 AM lectures feel never-ending, and the hostel room feels quiet, I hope you remember to pause and take a slow breath.
          </p>

          <p className="font-light">
            You work so hard, helping patients, studying medicine, and giving so much care to everyone around you. But you don't always have to run at full speed. You don't have to prove anything here, and there are no clinical expectations to meet.
          </p>

          <p className="font-light">
            Remember October 13, when you told me about your day and I promised I'd make something special for you using my skills? This sanctuary is that promise kept. Whenever your brain gets hyperactive at 2 AM or you just need a quiet moment with soft acoustic music, this space is always here for you. Sing as freely as you want—your voice is 11/10 to me.
          </p>

          <div className="pt-2 border-t border-amber-900/10">
            <p className="font-handwritten text-base sm:text-lg text-amber-900 font-semibold leading-normal">
              P.S. Be gentle with yourself, eat some good food, and please get some proper restful sleep tonight, mon cher. ☁️✨
            </p>

            <p className="font-handwritten text-xl font-bold text-amber-950 text-right mt-2">
              — Samreedh
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-amber-900/10 flex items-center justify-between gap-3">
          <span className="font-handwritten text-sm text-amber-900/80 font-medium">
            written with care for lin ☁️
          </span>

          <button 
            onClick={() => {
              soundEngine.playPop();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-amber-950 hover:bg-amber-900 active:scale-95 text-amber-50 font-serif font-bold text-xs shadow-sm transition cursor-pointer"
          >
            Back to Sanctuary ☕
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
