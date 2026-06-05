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
import Login from './components/Login';
import Signup from './components/Signup';
import { Scale, Heart, Shield, RefreshCw, LogOut, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from './utils/supabase';
import { fetchWeightRecords, addWeightRecord, deleteWeightRecord, fetchWeightGoal, updateWeightGoal } from './utils/database';
import { signOut, getCurrentUser } from './utils/auth';

export default function App() {
  // ==================== AUTH STATE ====================
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [showSignup, setShowSignup] = useState(false);

  // ==================== APP STATE ====================
  const [language, setLanguage] = useState<Language>(() => {
    const cached = localStorage.getItem('weight_tracker_lang');
    return (cached === 'en' || cached === 'my' || cached === 'ja') ? cached : 'my';
  });

  const [records, setRecords] = useState<WeightRecord[]>([]);
  const [goal, setGoal] = useState<WeightGoal>({
    targetWeight: null,
    startWeight: null,
    unit: 'lbs'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [activeUnit, setActiveUnit] = useState<'lbs' | 'kg'>('lbs');

  // ==================== AUTH EFFECTS ====================
  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user);
        if (user) {
          // Fetch user data from Supabase
          await loadUserData();
        }
      } catch (err) {
        // User not logged in
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadUserData();
      } else {
        setUser(null);
        setRecords([]);
        setGoal({ targetWeight: null, startWeight: null, unit: 'lbs' });
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // ==================== DATA LOADING ====================
  const loadUserData = async () => {
    setIsLoading(true);
    try {
      // Fetch records
      const dbRecords = await fetchWeightRecords();
      const recordsWithDiff = recalculateDifferences(
        dbRecords.map((r: any) => ({
          id: r.id,
          date: r.date,
          weight: r.weight,
          unit: r.unit,
          note: r.note
        }))
      );
      setRecords(recordsWithDiff);

      // Fetch goal
      const dbGoal = await fetchWeightGoal();
      if (dbGoal) {
        setGoal({
          targetWeight: dbGoal.target_weight,
          startWeight: dbGoal.start_weight,
          unit: dbGoal.unit
        });
      }
    } catch (err) {
      console.error('Failed to load user data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== ACTIVE UNIT ====================

  // Update active unit when records change
  useEffect(() => {
    if (records.length > 0) {
      setActiveUnit(records[records.length - 1].unit);
    }
  }, [records]);

  // Save language to localStorage
  useEffect(() => {
    localStorage.setItem('weight_tracker_lang', language);
  }, [language]);

  // ==================== HELPER FUNCTIONS ====================
  function recalculateDifferences(rawItems: Omit<WeightRecord, 'diff'>[]): WeightRecord[] {
    // Sort oldest to newest chronologically
    const sorted = [...rawItems].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const updated: WeightRecord[] = [];
    for (let i = 0; i < sorted.length; i++) {
      const current = sorted[i];
      if (i === 0) {
        updated.push({ ...current, diff: null });
      } else {
        const prev = updated[i - 1];
        let prevWeightInCurrentUnit = prev.weight;
        
        if (prev.unit !== current.unit) {
          if (current.unit === 'lbs') {
            prevWeightInCurrentUnit = parseFloat((prev.weight * 2.20462).toFixed(1));
          } else {
            prevWeightInCurrentUnit = parseFloat((prev.weight / 2.20462).toFixed(1));
          }
        }

        const diff = parseFloat((prevWeightInCurrentUnit - current.weight).toFixed(1));
        updated.push({ ...current, diff });
      }
    }
    return updated;
  }

  // ==================== HANDLERS ====================
  const handleAddRecord = async (weight: number, unit: 'lbs' | 'kg', note: string, dateStr: string) => {
    setIsSyncing(true);
    try {
      const timeOfDay = new Date();
      const [year, month, day] = dateStr.split('-').map(Number);
      
      const recordDate = new Date();
      recordDate.setFullYear(year, month - 1, day);
      recordDate.setHours(timeOfDay.getHours(), timeOfDay.getMinutes(), timeOfDay.getSeconds());

      const newRecord = await addWeightRecord({
        date: recordDate.toISOString(),
        weight,
        unit,
        note: note.trim() || undefined
      });

      if (newRecord) {
        const newRawRecord: Omit<WeightRecord, 'diff'> = {
          id: newRecord.id,
          date: newRecord.date,
          weight: newRecord.weight,
          unit: newRecord.unit,
          note: newRecord.note
        };

        setRecords((prev) => {
          const unfiltered = [...prev, newRawRecord];
          return recalculateDifferences(unfiltered);
        });

        // Update goal if not set
        if (!goal.startWeight) {
          const updatedGoal = await updateWeightGoal({
            targetWeight: null,
            startWeight: weight,
            unit: unit
          });
          if (updatedGoal) {
            setGoal({
              targetWeight: null,
              startWeight: weight,
              unit: unit
            });
          }
        }
      }
    } catch (err: any) {
      console.error('Failed to add record:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteRecord = async (id: string) => {
    setIsSyncing(true);
    try {
      await deleteWeightRecord(id);
      setRecords((prev) => {
        const filtered = prev.filter((r) => r.id !== id);
        return recalculateDifferences(filtered);
      });
    } catch (err: any) {
      console.error('Failed to delete record:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure? This will delete all records.')) return;
    
    setIsSyncing(true);
    try {
      // Delete all records one by one (or implement batch delete in DB)
      for (const record of records) {
        await deleteWeightRecord(record.id);
      }
      setRecords([]);
    } catch (err: any) {
      console.error('Failed to clear all:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateGoal = async (targetWeight: number | null, startWeight: number | null) => {
    setIsSyncing(true);
    try {
      const updatedGoal = await updateWeightGoal({
        targetWeight,
        startWeight,
        unit: activeUnit
      });
      if (updatedGoal) {
        setGoal({
          targetWeight,
          startWeight,
          unit: activeUnit
        });
      }
    } catch (err: any) {
      console.error('Failed to update goal:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setRecords([]);
      setGoal({ targetWeight: null, startWeight: null, unit: 'lbs' });
    } catch (err: any) {
      console.error('Sign out failed:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleAuthSuccess = () => {
    setShowSignup(false);
    setAuthLoading(false);
  };

  // ==================== RENDERING ====================
  
  // Show auth loading screen
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth pages if not logged in
  if (!user) {
    return showSignup ? (
      <Signup 
        onSuccess={handleAuthSuccess}
        onToggleForm={() => setShowSignup(false)}
      />
    ) : (
      <Login 
        onSuccess={handleAuthSuccess}
        onToggleForm={() => setShowSignup(true)}
      />
    );
  }

  const latestRecord = records.length > 0 
    ? [...records].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] 
    : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased" id="app-root">
      
      {/* Top clean navigation bar */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800" id="app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between" id="header-container">
          
          {/* Logo visual */}
          <div className="flex items-center" id="logo-block">
            <div className="p-2 bg-gradient-to-tr from-teal-500 to-cyan-400 text-white rounded-xl shadow-md cursor-pointer hover:scale-110 transition-all" id="logo-icon-container" title="Weight Tracker">
              <Scale className="w-7 h-7" />
            </div>
          </div>

          {/* Bilingual selector controller */}
          <div className="flex items-center space-x-2" id="header-controls">
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
            <button
              onClick={handleSignOut}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full" id="app-main">
        
        {/* Intro Alert: Secure Cloud Sync confirmation banner */}
        <div className="bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100/60 dark:border-blue-900/40 p-4 rounded-3xl mb-8 flex items-start gap-3.5" id="security-alert">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-xl mt-0.5" id="security-shield">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-blue-900 dark:text-blue-350" id="security-title">
              {language === 'my' 
                ? 'လုံခြုံစိတ်ချရသော ကလାວ်ဒ်ဆင်္ခြန်း' 
                : 'Secure Cloud Sync'}
            </h3>
            <p className="text-xs text-blue-800/80 dark:text-blue-400/80 mt-1 leading-relaxed" id="security-body">
              {language === 'my'
                ? 'သင်၏ အချက်အလက်များ Supabase မှတစ်ဆင့် လုံခြုံစွာ သိမ်းဆည်းလျက် အွန်လိုင်းတွင် ကောင်းက�င်းထိန်းသိမ်းပါသည်။'
                : 'Your data is securely stored and synced to the cloud via Supabase. Access your data from any device.'}
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
