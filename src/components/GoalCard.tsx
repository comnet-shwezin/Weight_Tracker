/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { WeightGoal } from '../types';
import { getTranslation, formatBurmeseNumbers } from '../utils/translations';
import { Target, Award, Edit, Check, X, ShieldAlert } from 'lucide-react';

interface GoalCardProps {
  lang: 'my' | 'en' | 'ja';
  currentWeight: number | null;
  currentUnit: 'lbs' | 'kg';
  goal: WeightGoal;
  onUpdateGoal: (targetWeight: number | null, startWeight: number | null) => void;
}

export default function GoalCard({ lang, currentWeight, currentUnit, goal, onUpdateGoal }: GoalCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [targetInput, setTargetInput] = useState<string>(goal.targetWeight ? String(goal.targetWeight) : '');
  const [startInput, setStartInput] = useState<string>(goal.startWeight ? String(goal.startWeight) : '');

  const handleSave = () => {
    const targetVal = parseFloat(targetInput);
    const startVal = parseFloat(startInput);

    if (!isNaN(targetVal) && targetVal > 0) {
      onUpdateGoal(
        targetVal,
        !isNaN(startVal) && startVal > 0 ? startVal : currentWeight
      );
      setIsEditing(false);
    } else if (targetInput === '') {
      onUpdateGoal(null, null);
      setIsEditing(false);
    }
  };

  const startWeightVal = goal.startWeight ?? currentWeight;
  const targetWeightVal = goal.targetWeight;

  // Compute remaining and progress percentage
  let remainingText = '';
  let progressPercentage = 0;
  let isMet = false;

  if (currentWeight && startWeightVal && targetWeightVal) {
    const isLosing = targetWeightVal < startWeightVal;
    
    if (isLosing) {
      const totalToLose = startWeightVal - targetWeightVal;
      const lostSoFar = startWeightVal - currentWeight;
      
      if (currentWeight <= targetWeightVal) {
        isMet = true;
        progressPercentage = 100;
      } else {
        progressPercentage = Math.max(0, Math.min(100, Math.round((lostSoFar / totalToLose) * 100)));
        const remaining = parseFloat((currentWeight - targetWeightVal).toFixed(1));
        remainingText = `${formatBurmeseNumbers(remaining, lang)} ${currentUnit === 'lbs' ? (lang === 'my' ? 'ပေါင်' : 'lbs') : (lang === 'my' ? 'ကီလို' : 'kg')}`;
      }
    } else {
      // Gaining weight goal (muscle building)
      const totalToGain = targetWeightVal - startWeightVal;
      const gainedSoFar = currentWeight - startWeightVal;

      if (currentWeight >= targetWeightVal) {
        isMet = true;
        progressPercentage = 100;
      } else {
        progressPercentage = Math.max(0, Math.min(100, Math.round((gainedSoFar / totalToGain) * 100)));
        const remaining = parseFloat((targetWeightVal - currentWeight).toFixed(1));
        remainingText = `${formatBurmeseNumbers(remaining, lang)} ${currentUnit === 'lbs' ? (lang === 'my' ? 'ပေါင်' : 'lbs') : (lang === 'my' ? 'ကီလို' : 'kg')}`;
      }
    }
  }

  const handleEditClick = () => {
    setTargetInput(goal.targetWeight ? String(goal.targetWeight) : currentWeight ? String(currentWeight) : '');
    setStartInput(goal.startWeight ? String(goal.startWeight) : currentWeight ? String(currentWeight) : '');
    setIsEditing(true);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-md border border-slate-100 dark:border-slate-800" id="goal-card-container">
      <div className="flex items-center justify-between mb-5" id="goal-header">
        <div className="flex items-center space-x-3" id="goal-title-container">
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400" id="goal-icon">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white" id="goal-headline">
              {getTranslation(lang, 'goalTitle')}
            </h2>
          </div>
        </div>

        {!isEditing && (
          <button
            id="btn-edit-goal"
            onClick={handleEditClick}
            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-xl transition-all"
            title={getTranslation(lang, 'editGoalBtn')}
          >
            <Edit className="w-4 h-4" />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4 animate-fade-in" id="goal-edit-form">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="goal-inputs-grid">
            <div className="space-y-1" id="start-weight-group">
              <label className="text-xs font-semibold text-slate-500" htmlFor="start-weight-input">
                {getTranslation(lang, 'startWeight')} ({currentUnit})
              </label>
              <input
                type="number"
                step="0.1"
                id="start-weight-input"
                value={startInput}
                onChange={(e) => setStartInput(e.target.value)}
                placeholder={currentWeight ? String(currentWeight) : 'e.g., 162'}
                className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1" id="target-weight-group">
              <label className="text-xs font-semibold text-slate-500" htmlFor="target-weight-input">
                {getTranslation(lang, 'targetWeight')} ({currentUnit})
              </label>
              <input
                type="number"
                step="0.1"
                id="target-weight-input"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                placeholder="e.g., 150"
                className="w-full px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex space-x-2 pt-1" id="goal-edit-actions">
            <button
              id="btn-save-goal"
              onClick={handleSave}
              className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{getTranslation(lang, 'saveGoalBtn')}</span>
            </button>
            <button
              id="btn-cancel-goal"
              onClick={() => setIsEditing(false)}
              className="py-2 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium rounded-xl text-xs transition-all"
            >
              {getTranslation(lang, 'cancelGoalBtn')}
            </button>
          </div>
        </div>
      ) : targetWeightVal ? (
        <div className="space-y-4" id="goal-status-display">
          {isMet ? (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/30 text-amber-900 dark:text-amber-200 flex items-center space-x-3 mb-2" id="goal-met-message">
              <Award className="w-8 h-8 flex-shrink-0 text-amber-500 animate-bounce" />
              <p className="text-sm font-bold leading-snug">
                {getTranslation(lang, 'reachedGoal')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 py-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl px-3" id="goal-numeric-stats">
              <div className="text-center" id="stat-start">
                <span className="text-[10px] text-slate-400 block font-medium uppercase">{getTranslation(lang, 'startWeight')}</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {formatBurmeseNumbers(startWeightVal, lang)} {currentUnit}
                </span>
              </div>
              <div className="text-center border-x border-slate-150 dark:border-slate-800" id="stat-current">
                <span className="text-[10px] text-slate-400 block font-medium uppercase">{lang === 'my' ? 'ယခုအချိန်' : 'Current'}</span>
                <span className="text-sm font-bold text-emerald-600">
                  {currentWeight ? `${formatBurmeseNumbers(currentWeight, lang)} ${currentUnit}` : '-'}
                </span>
              </div>
              <div className="text-center" id="stat-target">
                <span className="text-[10px] text-slate-400 block font-medium uppercase">{getTranslation(lang, 'targetWeight')}</span>
                <span className="text-sm font-bold text-indigo-600">
                  {formatBurmeseNumbers(targetWeightVal, lang)} {currentUnit}
                </span>
              </div>
            </div>
          )}

          {/* Goal indicators */}
          {!isMet && remainingText && (
            <div className="flex justify-between items-center text-xs" id="remaining-meta">
              <span className="text-slate-500 font-medium">{getTranslation(lang, 'remainingWeight')}:</span>
              <span className="font-bold text-indigo-600">{remainingText}</span>
            </div>
          )}

          {/* horizontal progress bar */}
          <div className="space-y-2" id="goal-progress-group">
            <div className="flex justify-between items-center text-xs" id="progress-percent-label">
              <span className="text-slate-500 font-medium">{getTranslation(lang, 'goalProgress')}:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{formatBurmeseNumbers(progressPercentage, lang)}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5 shadow-inner" id="progress-track">
              <div
                id="progress-fill"
                className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 px-4 bg-slate-50 dark:bg-slate-800/25 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center" id="empty-goal-state">
          <Target className="w-8 h-8 text-slate-350 dark:text-slate-600 mb-2 animate-pulse" />
          <p className="text-xs text-slate-500 mb-4 font-medium">
            {getTranslation(lang, 'notSetGoal')}
          </p>
          <button
            id="btn-set-goal-empty"
            onClick={() => setIsEditing(true)}
            className="py-2.5 px-5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/20 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl text-xs transition-all flex items-center space-x-1"
          >
            <span>✨</span>
            <span>{getTranslation(lang, 'setGoalBtn')}</span>
          </button>
        </div>
      )}
    </div>
  );
}
