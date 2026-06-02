/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { WeightRecord, WeightGoal, Language } from './types';
import { getTranslation, formatBurmeseNumbers } from './utils/translations';
import LanguageSelector from './components/LanguageSelector';
import WeightForm from './components/WeightForm';
import WeightChart from './components/WeightChart';
import GoalCard from './components/GoalCard';
import BmiCalculator from './components/BmiCalculator';
import HistoryLogs from './components/HistoryLogs';
import { Scale, Heart, Shield, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

// Sample baseline records representing past days leading up to June 2, 2026 (additional metadata)
const baselineSampleRecords = (unit: 'lbs' | 'kg'): Omit<WeightRecord, 'diff'>[] => {
  const baseDate = new Date('2026-06-02T03:35:40Z');
  
  const daysOffset = (days: number) => {
    const d = new Date(baseDate.getTime());
    d.setDate(d.getDate() - days);
    return d.toISOString();
  };

  const weights = unit === 'lbs' ? [166, 164.5, 163.8, 162.2, 161.5] : [75.3, 74.6, 74.3, 73.5, 73.2];

  return [
    { id: 'sample-1', date: daysOffset(5), weight: weights[0], unit, note: 'Started dieting & treadmill running' },
    { id: 'sample-2', date: daysOffset(4), weight: weights[1], unit, note: 'Heavy gym cardio workout' },
    { id: 'sample-3', date: daysOffset(3), weight: weights[2], unit, note: 'Reduced sugar intake' },
    { id: 'sample-4', date: daysOffset(2), weight: weights[3], unit, note: 'Morning run 5km' },
    { id: 'sample-5', date: daysOffset(1), weight: weights[4], unit, note: 'Fasting day' },
  ];
};

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const cached = localStorage.getItem('weight_tracker_lang');
    return (cached === 'en' || cached === 'my' || cached === 'ja') ? cached : 'my';
  });

  const [records, setRecords] = useState<WeightRecord[]>(() => {
    const cached = localStorage.getItem('weight_tracker_records');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error('Failed parsing weight records', e);
      }
    }
    // Return baseline mock data initially so the user has beautiful charts to look at
    return recalculateDifferences(baselineSampleRecords('lbs'));
  });

  const [goal, setGoal] = useState<WeightGoal>(() => {
    const cached = localStorage.getItem('weight_tracker_goal');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        console.error('Failed parsing weight goal', e);
      }
    }
    return {
      targetWeight: 155, // default target
      startWeight: 166,
      unit: 'lbs'
    };
  });

  // Keep track of the current selected unit in the log history (defaults to latest recorded record's unit)
  const [activeUnit, setActiveUnit] = useState<'lbs' | 'kg'>(() => {
    if (records.length > 0) {
      return records[records.length - 1].unit;
    }
    return 'lbs';
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('weight_tracker_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('weight_tracker_records', JSON.stringify(records));
    if (records.length > 0) {
      setActiveUnit(records[records.length - 1].unit);
    }
  }, [records]);

  useEffect(() => {
    localStorage.setItem('weight_tracker_goal', JSON.stringify(goal));
  }, [goal]);

  // Comprehensive chronological difference calculator
  function recalculateDifferences(rawItems: Omit<WeightRecord, 'diff'>[]): WeightRecord[] {
    // Sort oldest to newest chronologically
    const sorted = [...rawItems].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const updated: WeightRecord[] = [];
    for (let i = 0; i < sorted.length; i++) {
      const current = sorted[i];
      if (i === 0) {
        // baseline
        updated.push({ ...current, diff: null });
      } else {
        const prev = updated[i - 1];
        let prevWeightInCurrentUnit = prev.weight;
        
        if (prev.unit !== current.unit) {
          if (current.unit === 'lbs') {
            // convert kg to lbs
            prevWeightInCurrentUnit = parseFloat((prev.weight * 2.20462).toFixed(1));
          } else {
            // convert lbs to kg
            prevWeightInCurrentUnit = parseFloat((prev.weight / 2.20462).toFixed(1));
          }
        }

        // Difference = yesterday - today
        // Weight dropped = positive value
        // Weight gained = negative value
        const diff = parseFloat((prevWeightInCurrentUnit - current.weight).toFixed(1));
        updated.push({ ...current, diff });
      }
    }
    return updated;
  }

  // Adding weight from form
  const handleAddRecord = (weight: number, unit: 'lbs' | 'kg', note: string, dateStr: string) => {
    // Construct local timestamp based on user selected day
    const timeOfDay = new Date();
    const [year, month, day] = dateStr.split('-').map(Number);
    
    const recordDate = new Date();
    recordDate.setFullYear(year, month - 1, day);
    recordDate.setHours(timeOfDay.getHours(), timeOfDay.getMinutes(), timeOfDay.getSeconds());

    const newRawRecord: Omit<WeightRecord, 'diff'> = {
      id: `record-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: recordDate.toISOString(),
      weight,
      unit,
      note: note.trim() || undefined
    };

    setRecords((prev) => {
      const unfiltered = [...prev, newRawRecord];
      return recalculateDifferences(unfiltered);
    });

    // Automatically update starting weight in goal if not set yet
    if (!goal.startWeight) {
      setGoal((prevGoal) => ({
        ...prevGoal,
        startWeight: weight,
        unit: unit
      }));
    }
  };

  // Erasing individual log
  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      return recalculateDifferences(filtered);
    });
  };

  // Safe wipe
  const handleClearAll = () => {
    setRecords([]);
    setGoal({
      targetWeight: null,
      startWeight: null,
      unit: 'lbs'
    });
  };

  // Goal modifiers
  const handleUpdateGoal = (targetWeight: number | null, startWeight: number | null) => {
    setGoal({
      targetWeight,
      startWeight,
      unit: activeUnit
    });
  };

  const latestRecord = records.length > 0 
    ? [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] 
    : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased" id="app-root">
      
      {/* Top clean navigation bar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800" id="app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between" id="header-container">
          
          {/* Logo visual */}
          <div className="flex items-center space-x-3" id="logo-block">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-2xl shadow-md cursor-pointer hover:rotate-6 transition-all" id="logo-icon-container">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5" id="header-title">
                {getTranslation(language, 'appTitle')}
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium hidden sm:block" id="header-subtitle">
                {getTranslation(language, 'appSubtitle')}
              </p>
            </div>
          </div>

          {/* Bilingual selector controller */}
          <div className="flex items-center space-x-2" id="header-controls">
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full" id="app-main">
        
        {/* Intro Alert: Device only secure confirmation banner */}
        <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/60 dark:border-emerald-900/40 p-4 rounded-3xl mb-8 flex items-start gap-3.5" id="security-alert">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-xl mt-0.5" id="security-shield">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-350" id="security-title">
              {language === 'my' 
                ? '၁၀၀% လုံခြုံစိတ်ချရသော ကိုယ်ပိုင် အော့ဖ်လိုင်းဂိတ် (Local Storage)' 
                : '100% Secure & On-Device Local Sandbox'}
            </h3>
            <p className="text-xs text-emerald-800/80 dark:text-emerald-400/80 mt-1 leading-relaxed" id="security-body">
              {language === 'my'
                ? 'သင်၏ ကိုယ်အလေးချိန် အချက်အလက်များကို မည်သည့်အွန်လိုင်းဆာဗာသို့မျှ မပို့ဘဲ သင့်ဖုန်း/ဘရောက်ဇာအတွင်း၌သာ လုံခြုံစွာ အမြဲတမ်းသိမ်းဆည်းပေးထားပါသည်။ ကွန်ရက်မလိုအပ်ဘဲ အပြည့်အဝအသုံးပြုနိုင်ပါသည်။'
                : 'Your data resides safely within this browsers local database. No servers ever receive your weight logs. Fully accessible offline.'}
            </p>
          </div>
        </div>

        {/* Dashboard Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="dashboard-columns">
          
          {/* Left Column: Form & Goal Tracking */}
          <div className="col-span-1 lg:col-span-12 xl:col-span-5 space-y-8" id="col-actions">
            
            {/* 1. Input Section */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              id="form-card-animation"
            >
              <WeightForm
                lang={language}
                previousRecord={latestRecord}
                onAddRecord={handleAddRecord}
              />
            </motion.div>

            {/* 2. Target Goal Area */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              id="goal-card-animation"
            >
              <GoalCard
                lang={language}
                currentWeight={latestRecord ? latestRecord.weight : null}
                currentUnit={activeUnit}
                goal={goal}
                onUpdateGoal={handleUpdateGoal}
              />
            </motion.div>
          </div>

          {/* Right Column: Analytics & Health status */}
          <div className="col-span-1 lg:col-span-12 xl:col-span-7 space-y-8" id="col-visuals">
            
            {/* 1. Recharts Trend Graph */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              id="chart-card-animation"
            >
              <WeightChart
                lang={language}
                records={records}
                currentUnit={activeUnit}
              />
            </motion.div>

            {/* 2. BMI Index Health Assessor */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              id="bmi-card-animation"
            >
              <BmiCalculator
                lang={language}
                latestWeight={latestRecord ? latestRecord.weight : null}
                latestUnit={activeUnit}
              />
            </motion.div>
          </div>
        </div>

        {/* History Records Logs - Full Width Footer-shelf segment */}
        <div className="mt-8" id="logs-row">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            id="history-card-animation"
          >
            <HistoryLogs
              lang={language}
              records={records}
              onDeleteRecord={handleDeleteRecord}
              onClearAll={handleClearAll}
            />
          </motion.div>
        </div>
      </main>

      {/* Elegant minimalist human centered footer */}
      <footer className="bg-white border-t border-slate-100 py-8 mt-12 dark:bg-slate-900 dark:border-slate-800" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2 text-xs text-slate-400 font-medium" id="footer-container">
          <div className="flex items-center justify-center space-x-1" id="footer-love">
            <span>ကိုယ်အလေးချိန်စောင့်ကြည့်စနစ်</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current animate-pulse" />
            <span>ကျန်းမာပျော်ရွှင်သော ဘဝအတွက်</span>
          </div>
          <p id="footer-disclaimer">
            {language === 'my' 
              ? 'တွက်ချက်မှုများသည် ကိုယ်တိုင်အနီးစပ်ဆုံး တွက်ချက်ရယူရန်ဖြစ်ပြီး ဆေးဘက်ဆိုင်ရာ ပြဌာန်းချက်များ မဟုတ်ပါ။' 
              : 'Weight tracker values and BMI indications are calculated locally and are strictly for educational references.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
