/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { getTranslation, formatBurmeseNumbers } from '../utils/translations';
import { Activity, ShieldCheck, HeartPulse } from 'lucide-react';

interface BmiCalculatorProps {
  lang: 'my' | 'en' | 'ja';
  latestWeight: number | null; // latest weight value
  latestUnit: 'lbs' | 'kg';
}

export default function BmiCalculator({ lang, latestWeight, latestUnit }: BmiCalculatorProps) {
  const [heightMode, setHeightMode] = useState<'cm' | 'ftIn'>('ftIn');
  const [cmValue, setCmValue] = useState<string>('170');
  const [ftValue, setFtValue] = useState<string>('5');
  const [inValue, setInValue] = useState<string>('6');
  
  // Custom weight override (defaults to latest recorded weight, or a placeholder if none)
  const [weightInput, setWeightInput] = useState<string>('');
  const [bmiResult, setBmiResult] = useState<{
    score: number;
    category: 'under' | 'normal' | 'over' | 'obese';
    label: string;
    tip: string;
    gaugePercent: number; // For rendering visual meter marker
  } | null>(null);

  // Auto-sync custom weight input with whatever is the latest log
  useEffect(() => {
    if (latestWeight) {
      setWeightInput(String(latestWeight));
    } else {
      setWeightInput(latestUnit === 'lbs' ? '150' : '65');
    }
  }, [latestWeight, latestUnit]);

  const handleCalculateBmi = () => {
    const rawWeight = parseFloat(weightInput);
    if (isNaN(rawWeight) || rawWeight <= 0) return;

    // Convert weight to kg
    let weightInKg = rawWeight;
    if (latestUnit === 'lbs') {
      weightInKg = rawWeight * 0.45359237;
    }

    // Convert height to meters
    let heightInMeters = 0;
    if (heightMode === 'cm') {
      const cm = parseFloat(cmValue);
      if (isNaN(cm) || cm <= 0) return;
      heightInMeters = cm / 100;
    } else {
      const feet = parseFloat(ftValue);
      const inches = parseFloat(inValue);
      const totalInches = (isNaN(feet) ? 0 : feet * 12) + (isNaN(inches) ? 0 : inches);
      if (totalInches <= 0) return;
      heightInMeters = (totalInches * 2.54) / 100;
    }

    // BMI formula: kg / m^2
    const bmiScore = parseFloat((weightInKg / (heightInMeters * heightInMeters)).toFixed(1));

    if (isNaN(bmiScore) || bmiScore <= 0 || bmiScore > 100) return;

    // Category
    let category: 'under' | 'normal' | 'over' | 'obese' = 'normal';
    let label = '';
    let tip = '';
    let gaugePercent = 50;

    if (bmiScore < 18.5) {
      category = 'under';
      label = getTranslation(lang, 'bmiUnderweight');
      tip = getTranslation(lang, 'bmiTipUnderweight');
      // map 10 - 18.5 to 0% - 25%
      gaugePercent = Math.max(5, Math.min(27, ((bmiScore - 10) / 8.5) * 25));
    } else if (bmiScore >= 18.5 && bmiScore < 25.0) {
      category = 'normal';
      label = getTranslation(lang, 'bmiNormal');
      tip = getTranslation(lang, 'bmiTipNormal');
      // map 18.5 - 25.0 to 25% - 50%
      gaugePercent = 25 + ((bmiScore - 18.5) / 6.5) * 25;
    } else if (bmiScore >= 25.0 && bmiScore < 30.0) {
      category = 'over';
      label = getTranslation(lang, 'bmiOverweight');
      tip = getTranslation(lang, 'bmiTipOverweight');
      // map 25.0 - 30.0 to 50% - 75%
      gaugePercent = 51 + ((bmiScore - 25.0) / 5.0) * 25;
    } else {
      category = 'obese';
      label = getTranslation(lang, 'bmiObese');
      tip = getTranslation(lang, 'bmiTipObese');
      // map 30.0 - 45.0 to 75% - 95%
      gaugePercent = Math.min(95, 75 + ((bmiScore - 30.5) / 14.5) * 20);
    }

    setBmiResult({
      score: bmiScore,
      category,
      label,
      tip,
      gaugePercent,
    });
  };

  // Recalculate whenever inputs change
  useEffect(() => {
    handleCalculateBmi();
  }, [heightMode, cmValue, ftValue, inValue, weightInput, lang, latestUnit]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-md border border-slate-100 dark:border-slate-800" id="bmi-calculator-container">
      <div className="flex items-center space-x-3 mb-5" id="bmi-header">
        <div className="p-3 bg-rose-50 rounded-2xl text-rose-600 dark:bg-rose-950/30 dark:text-rose-400" id="bmi-icon">
          <Activity className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white" id="bmi-title">
            {getTranslation(lang, 'bmiTitle')}
          </h2>
        </div>
      </div>

      <div className="space-y-4" id="bmi-form-body">
        {/* Unit preference selector */}
        <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl" id="bmi-height-mode-toggle">
          <button
            type="button"
            id="bmi-height-mode-ft"
            onClick={() => setHeightMode('ftIn')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              heightMode === 'ftIn'
                ? 'bg-white text-rose-600 dark:bg-slate-700 dark:text-rose-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {getTranslation(lang, 'heightModeFtIn')}
          </button>
          <button
            type="button"
            id="bmi-height-mode-cm"
            onClick={() => setHeightMode('cm')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              heightMode === 'cm'
                ? 'bg-white text-rose-600 dark:bg-slate-700 dark:text-rose-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {getTranslation(lang, 'heightModeCm')}
          </button>
        </div>

        {/* Dynamic height dimensions */}
        <div className="grid grid-cols-12 gap-3" id="height-inputs">
          <div className="col-span-6 space-y-1" id="height-col">
            <label className="text-[11px] font-semibold text-slate-500" htmlFor="bmi-height">
              {getTranslation(lang, 'heightLabel')}
            </label>
            {heightMode === 'cm' ? (
              <div className="relative" id="cm-input-wrapper">
                <input
                  type="number"
                  id="bmi-height-cm"
                  value={cmValue}
                  onChange={(e) => setCmValue(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
                <span className="absolute inset-y-0 right-3 flex items-center text-[10px] text-slate-400 font-bold uppercase" id="cm-suffix">cm</span>
              </div>
            ) : (
              <div className="flex gap-2" id="ft-in-wrapper">
                <div className="relative flex-1" id="ft-input-wrapper">
                  <input
                    type="number"
                    id="bmi-height-ft"
                    value={ftValue}
                    onChange={(e) => setFtValue(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <span className="absolute inset-y-0 right-2 flex items-center text-[10px] text-slate-400 font-bold" id="ft-suffix">{getTranslation(lang, 'heightHeightFt')}</span>
                </div>
                <div className="relative flex-1" id="in-input-wrapper">
                  <input
                    type="number"
                    id="bmi-height-in"
                    value={inValue}
                    onChange={(e) => setInValue(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <span className="absolute inset-y-0 right-2 flex items-center text-[10px] text-slate-400 font-bold" id="in-suffix">{getTranslation(lang, 'heightHeightIn')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Current Weight Override (Synchronized automatically, but editable) */}
          <div className="col-span-6 space-y-1" id="weight-col">
            <label className="text-[11px] font-semibold text-slate-500" htmlFor="bmi-weight">
              {getTranslation(lang, 'bmiUnitWeight')} ({latestUnit})
            </label>
            <input
              type="number"
              step="0.1"
              id="bmi-weight"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>
        </div>

        {/* Visual score display */}
        {bmiResult && (
          <div className="mt-5 p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4" id="bmi-result-card">
            <div className="flex justify-between items-center" id="result-text-summary">
              <div>
                <span className="text-[10px] text-slate-450 uppercase block font-medium tracking-wider">
                  {getTranslation(lang, 'bmiValue')}
                </span>
                <span className="text-3xl font-extrabold text-slate-850 dark:text-white" id="bmi-score-big">
                  {formatBurmeseNumbers(bmiResult.score, lang)}
                </span>
              </div>
              <div className="text-right" id="result-category-summary">
                <span className="text-[10px] text-slate-450 uppercase block font-medium tracking-wider">
                  {getTranslation(lang, 'bmiStatusLabel')}
                </span>
                <span
                  id="bmi-category-badge"
                  className={`inline-block mt-0.5 text-xs font-bold leading-none px-2.5 py-1.5 rounded-lg ${
                    bmiResult.category === 'under'
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/30'
                      : bmiResult.category === 'normal'
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30'
                      : bmiResult.category === 'over'
                      ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/30'
                      : 'bg-rose-50 text-rose-600 dark:bg-rose-950/30'
                  }`}
                >
                  {bmiResult.label}
                </span>
              </div>
            </div>

            {/* Slider visual gauge */}
            <div className="space-y-1.5 pt-1" id="slider-gauge">
              <div className="relative w-full h-2.5 bg-gradient-to-r from-blue-400 via-emerald-400 via-yellow-400 to-rose-400 rounded-full" id="gauge-bar">
                {/* Visual marker tick */}
                <div
                  id="gauge-indicator"
                  className="absolute top-1/2 -ml-2.5 w-5 h-5 bg-white border-2 border-slate-800 dark:border-slate-200 rounded-full shadow-md transform -translate-y-1/2 transition-all duration-300"
                  style={{ left: `${bmiResult.gaugePercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-slate-400 px-1 font-bold" id="gauge-ticks">
                <span id="tick-under">&lt; 18.5</span>
                <span id="tick-norm">18.5 - 24.9</span>
                <span id="tick-over">25 - 29.9</span>
                <span id="tick-obese">30+</span>
              </div>
            </div>

            {/* Custom tailored health suggestion */}
            <div className="text-[11.5px] p-3 leading-relaxed bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 flex items-start gap-1.5" id="bmi-health-tip">
              <HeartPulse className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <p>{bmiResult.tip}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
