/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from '../types';
import { motion } from 'motion/react';
import { Languages } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="flex items-center space-x-1 sm:space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shadow-inner" id="language-selector-container">
      <div className="flex items-center px-2 py-1 text-slate-500 text-xs font-medium" id="lang-info">
        <Languages className="w-3.5 h-3.5 mr-1 text-slate-400" />
        <span className="hidden sm:inline">Language:</span>
      </div>
      <button
        id="btn-lang-my"
        onClick={() => onLanguageChange('my')}
        className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold z-10 transition-colors duration-200 ${
          currentLanguage === 'my'
            ? 'text-white'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        {currentLanguage === 'my' && (
          <motion.div
            layoutId="activeLang"
            className="absolute inset-0 bg-emerald-600 rounded-lg -z-10"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
        မြန်မာ
      </button>
      <button
        id="btn-lang-en"
        onClick={() => onLanguageChange('en')}
        className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold z-10 transition-colors duration-200 ${
          currentLanguage === 'en'
            ? 'text-white'
            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
      >
        {currentLanguage === 'en' && (
          <motion.div
            layoutId="activeLang"
            className="absolute inset-0 bg-emerald-600 rounded-lg -z-10"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
        English
      </button>
      <button
        id="btn-lang-ja"
        onClick={() => onLanguageChange('ja')}
        className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold z-10 transition-colors duration-200 ${
          currentLanguage === 'ja'
            ? 'text-white'
            : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
        }`}
      >
        {currentLanguage === 'ja' && (
          <motion.div
            layoutId="activeLang"
            className="absolute inset-0 bg-emerald-600 rounded-lg -z-10"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
        日本語
      </button>
    </div>
  );
}
