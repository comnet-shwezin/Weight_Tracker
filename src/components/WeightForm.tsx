/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WeightRecord } from '../types';
import { translations, getTranslation, formatBurmeseNumbers } from '../utils/translations';
import { motion, AnimatePresence } from 'motion/react';
import { PlusCircle, Scale, Calendar, FileText, Sparkles, Check, RefreshCw } from 'lucide-react';

interface WeightFormProps {
  lang: 'my' | 'en' | 'ja';
  previousRecord: WeightRecord | null;
  onAddRecord: (weight: number, unit: 'lbs' | 'kg', note: string, dateStr: string, calculatedDiff: number | null) => void;
}

export default function WeightForm({ lang, previousRecord, onAddRecord }: WeightFormProps) {
  const [weight, setWeight] = useState<string>('');
  const [unit, setUnit] = useState<'lbs' | 'kg'>('lbs');
  const [note, setNote] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>(() => {
    // Return yyyy-MM-dd formatted date for default inputs
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
  });

  const [calculationResult, setCalculationResult] = useState<{
    diff: number;
    status: 'dropped' | 'gained' | 'none';
    message: string;
    prevWeightValue: number;
    prevWeightUnit: string;
  } | null>(null);

  const [saveSuccessNotify, setSaveSuccessNotify] = useState<string | null>(null);

  // Clear calculation result when weight changes
  useEffect(() => {
    setCalculationResult(null);
  }, [weight, unit]);

  const handleCalculateChange = () => {
    const rawVal = parseFloat(weight);
    if (isNaN(rawVal) || rawVal <= 0) return;

    if (!previousRecord) {
      // First baseline entry
      setCalculationResult({
        diff: 0,
        status: 'none',
        message: getTranslation(lang, 'firstRecord'),
        prevWeightValue: 0,
        prevWeightUnit: '',
      });
      return;
    }

    // Convert previousWeight if unit differs to calculate accurately
    let prevWeightValueInCurrentUnit = previousRecord.weight;
    if (previousRecord.unit !== unit) {
      if (unit === 'lbs') {
        // Previous was kg, convert to lbs for comparison
        prevWeightValueInCurrentUnit = parseFloat((previousRecord.weight * 2.20462).toFixed(1));
      } else {
        // Previous was lbs, convert to kg for comparison
        prevWeightValueInCurrentUnit = parseFloat((previousRecord.weight / 2.20462).toFixed(1));
      }
    }

    // Calculate diff: prev - current. 
    // Positive diff = weight dropped (e.g. 162 - 160 = 2 dropped)
    // Negative diff = weight gained (e.g. 158 - 160 = -2, which means 2 gained)
    const diff = parseFloat((prevWeightValueInCurrentUnit - rawVal).toFixed(1));

    let status: 'dropped' | 'gained' | 'none' = 'none';
    let message = '';

    const formattedDiff = formatBurmeseNumbers(Math.abs(diff), lang);
    const unitLabel = unit === 'lbs' ? (lang === 'my' ? 'ပေါင်' : 'lbs') : (lang === 'my' ? 'ကီလို' : 'kg');

    if (diff > 0) {
      status = 'dropped';
      message = getTranslation(lang, 'congratsDrop')
        .replace('{diff}', formattedDiff)
        .replace('{unit}', unitLabel);
    } else if (diff < 0) {
      status = 'gained';
      message = getTranslation(lang, 'warnGain')
        .replace('{diff}', formattedDiff)
        .replace('{unit}', unitLabel);
    } else {
      status = 'none';
      message = getTranslation(lang, 'noChange');
    }

    setCalculationResult({
      diff,
      status,
      message,
      prevWeightValue: previousRecord.weight,
      prevWeightUnit: previousRecord.unit,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const rawVal = parseFloat(weight);
    if (isNaN(rawVal) || rawVal <= 0) return;

    // Calculate diff if not already calculated
    let finalDiff: number | null = null;
    if (previousRecord) {
      let prevWeightInCurrentUnit = previousRecord.weight;
      if (previousRecord.unit !== unit) {
        if (unit === 'lbs') {
          prevWeightInCurrentUnit = parseFloat((previousRecord.weight * 2.20462).toFixed(1));
        } else {
          prevWeightInCurrentUnit = parseFloat((previousRecord.weight / 2.20462).toFixed(1));
        }
      }
      finalDiff = parseFloat((prevWeightInCurrentUnit - rawVal).toFixed(1));
    }

    // Save
    onAddRecord(rawVal, unit, note, dateStr, finalDiff);

    // Show success banner
    setSaveSuccessNotify(getTranslation(lang, 'saveSuccess'));
    setTimeout(() => {
      setSaveSuccessNotify(null);
    }, 4000);

    // Reset fields (leave unit and date as-is for easy continuation)
    setWeight('');
    setNote('');
    setCalculationResult(null);
  };

  const isInputValid = parseFloat(weight) > 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-md border border-slate-100 dark:border-slate-800" id="weight-form-card">
      <div className="flex items-center space-x-3 mb-6" id="form-heading">
        <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400" id="form-icon">
          <Scale className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white" id="form-title">
            {getTranslation(lang, 'weightInput')}
          </h2>
          <p className="text-xs text-slate-500" id="form-desc">
            {lang === 'my' ? 'ယနေ့ ကိုယ်အလေးချိန်ကို ထည့်သွင်းတွက်ချက်ပါ' : 'Enter today\'s weight to run analytics'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5" id="weight-form">
        {/* Toggle Lbs / Kg */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl" id="unit-toggle-grid">
          <button
            type="button"
            id="toggle-unit-lbs"
            onClick={() => setUnit('lbs')}
            className={`py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              unit === 'lbs'
                ? 'bg-white text-emerald-600 dark:bg-slate-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {getTranslation(lang, 'lbs')}
          </button>
          <button
            type="button"
            id="toggle-unit-kg"
            onClick={() => setUnit('kg')}
            className={`py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
              unit === 'kg'
                ? 'bg-white text-emerald-600 dark:bg-slate-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            {getTranslation(lang, 'kg')}
          </button>
        </div>

        {/* Weight input amount */}
        <div className="relative" id="input-weight-group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" id="input-weight-icon-wrapper">
            <Scale className="h-5 h-5 text-slate-400" />
          </div>
          <input
            type="number"
            step="0.1"
            required
            id="weight-input-field"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={getTranslation(lang, 'weightPlaceholder')}
            className="block w-full pl-12 pr-16 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-3xl text-lg font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-sm font-bold text-slate-500 uppercase" id="input-weight-unit">
            {unit}
          </div>
        </div>

        {/* Date Selector */}
        <div className="space-y-2" id="date-picker-group">
          <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5" htmlFor="date-picker">
            <Calendar className="w-3.5 h-3.5" />
            {getTranslation(lang, 'dateSelect')}
          </label>
          <div className="flex gap-2" id="date-shortcuts">
            <button
              type="button"
              id="date-shortcut-today"
              onClick={() => {
                const now = new Date();
                setDateStr(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`);
              }}
              className="px-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-800 rounded-xl font-medium transition-all"
            >
              📅 {getTranslation(lang, 'today')}
            </button>
            <button
              type="button"
              id="date-shortcut-yesterday"
              onClick={() => {
                const prev = new Date();
                prev.setDate(prev.getDate() - 1);
                setDateStr(`${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}-${String(prev.getDate()).padStart(2, '0')}`);
              }}
              className="px-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-800 rounded-xl font-medium transition-all"
            >
              📅 {getTranslation(lang, 'yesterday')}
            </button>
            <input
              type="date"
              id="date-picker"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Optional notes */}
        <div className="space-y-1" id="notes-group">
          <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5" htmlFor="notes-field">
            <FileText className="w-3.5 h-3.5" />
            {lang === 'my' ? 'မှတ်စုရေးရန်' : 'Notes'}
          </label>
          <input
            type="text"
            id="notes-field"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={getTranslation(lang, 'notePlaceholder')}
            className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>

        {/* Action button container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2" id="actions-grid">
          {/* Output Process Calculator widget (First Flow) */}
          <button
            type="button"
            id="btn-calculate-diff"
            disabled={!isInputValid}
            onClick={handleCalculateChange}
            className={`w-full py-3 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 select-none ${
              isInputValid
                ? 'bg-slate-900 hover:bg-black text-white cursor-pointer active:scale-98 dark:bg-slate-800 dark:hover:bg-slate-700'
                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isInputValid ? 'animate-spin-slow' : ''}`} />
            <span>{getTranslation(lang, 'calculateDiff')}</span>
          </button>

          {/* Core Save Trigger (Second Flow) */}
          <button
            type="submit"
            id="btn-save-record"
            disabled={!isInputValid}
            className={`w-full py-3 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 shadow-sm ${
              isInputValid
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-98 shadow-emerald-200 dark:shadow-none'
                : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{getTranslation(lang, 'addRecord')}</span>
          </button>
        </div>
      </form>

      {/* Dynamic calculated display alert (Output Flow 1) */}
      <AnimatePresence>
        {calculationResult && (
          <motion.div
            id="calculation-result-alert"
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`mt-6 p-4 rounded-2xl border ${
              calculationResult.status === 'dropped'
                ? 'bg-emerald-50 border-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-300'
                : calculationResult.status === 'gained'
                ? 'bg-amber-50 border-amber-100 text-amber-800 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-300'
                : 'bg-slate-100 border-slate-200 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
            }`}
          >
            <div className="flex items-start space-x-3" id="alert-content">
              <span className="text-xl flex-shrink-0" id="alert-emoji">
                {calculationResult.status === 'dropped' ? '🎉' : calculationResult.status === 'gained' ? '💪' : 'ℹ️'}
              </span>
              <div className="flex-1" id="alert-text">
                <p className="font-bold text-sm tracking-tight" id="alert-msg">
                  {calculationResult.message}
                </p>

                {previousRecord && (
                  <p className="text-[11px] text-slate-500 mt-1 dark:text-slate-400" id="alert-meta">
                    {lang === 'my' ? 'ယခင် ကိုယ်အလေးချိန်: ' : 'Previous recorded weight: '} 
                    <span className="font-bold">
                      {formatBurmeseNumbers(calculationResult.prevWeightValue, lang)} {calculationResult.prevWeightUnit}
                    </span>
                    {calculationResult.diff !== 0 && (
                      <span className="ml-2 font-medium">
                        (
                        {calculationResult.status === 'dropped' ? '-' : '+'}
                        {formatBurmeseNumbers(Math.abs(calculationResult.diff), lang)} {unit}
                        )
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistence feedback status */}
      <AnimatePresence>
        {saveSuccessNotify && (
          <motion.div
            id="save-success-banner"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl text-center text-[11.5px] text-blue-800 dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-300 flex items-center justify-center tracking-tight"
          >
            <Check className="w-3.5 h-3.5 mr-1.5 text-blue-500" />
            <span>{saveSuccessNotify}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
