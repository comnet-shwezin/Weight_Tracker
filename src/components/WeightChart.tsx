/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { WeightRecord } from '../types';
import { getTranslation, formatBurmeseNumbers } from '../utils/translations';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, Calendar, AlertCircle } from 'lucide-react';

interface WeightChartProps {
  lang: 'my' | 'en' | 'ja';
  records: WeightRecord[];
  currentUnit: 'lbs' | 'kg';
}

type FilterRange = '7' | '30' | 'all';

export default function WeightChart({ lang, records, currentUnit }: WeightChartProps) {
  const [filter, setFilter] = useState<FilterRange>('7');

  if (!records || records.length === 0) {
    return null; // Don't crash if no records at all
  }

  // Sort chronologically (oldest first for graphing)
  const sortedRecords = [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Filter records based on selected range
  let filteredRecords = sortedRecords;
  if (filter === '7') {
    filteredRecords = sortedRecords.slice(-7);
  } else if (filter === '30') {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    filteredRecords = sortedRecords.filter(r => new Date(r.date) >= thirtyDaysAgo);
    // If filtering leaves too few, fallback to last 10
    if (filteredRecords.length < 2) {
      filteredRecords = sortedRecords.slice(-10);
    }
  }

  // Format datastructure for Recharts
  const chartData = filteredRecords.map((record) => {
    const rawDate = new Date(record.date);
    
    // Convert weight to match currentUnit
    let displayWeight = record.weight;
    if (record.unit !== currentUnit) {
      if (currentUnit === 'lbs') {
        displayWeight = parseFloat((record.weight * 2.20462).toFixed(1));
      } else {
        displayWeight = parseFloat((record.weight / 2.20462).toFixed(1));
      }
    }

    // Bilingual friendly label: "MM/DD"
    const month = rawDate.getMonth() + 1;
    const date = rawDate.getDate();
    const shortLabel = lang === 'my' 
      ? `${formatBurmeseNumbers(month, lang)}/${formatBurmeseNumbers(date, lang)}` 
      : `${month}/${date}`;

    // Get a full read-friendly date string for the tooltip
    const fullDateLabel = rawDate.toLocaleDateString(lang === 'my' ? 'my-MM' : lang === 'ja' ? 'ja-JP' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    return {
      id: record.id,
      dateVal: rawDate,
      label: shortLabel,
      fullLabel: fullDateLabel,
      weight: parseFloat(displayWeight.toFixed(1)),
      unit: currentUnit
    };
  });

  // Calculate domains dynamically for standard zooming
  const weights = chartData.map((d) => d.weight);
  const minWeight = weights.length > 0 ? Math.min(...weights) : 0;
  const maxWeight = weights.length > 0 ? Math.max(...weights) : 100;
  
  // Give padding to Y-axis so graph is balanced
  const yDomainMin = Math.max(0, Math.floor(minWeight - (currentUnit === 'lbs' ? 5 : 2)));
  const yDomainMax = Math.ceil(maxWeight + (currentUnit === 'lbs' ? 5 : 2));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-md border border-slate-100 dark:border-slate-800" id="weight-chart-container">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6" id="chart-header">
        <div className="flex items-center space-x-3" id="chart-heading-container">
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400" id="chart-icon">
            <TrendingUp className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white" id="chart-title">
              {getTranslation(lang, 'chartTitle')}
            </h2>
          </div>
        </div>

        {/* Range Selector tab list */}
        <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl self-start md:self-auto" id="chart-filters">
          <button
            id="filter-range-7"
            onClick={() => setFilter('7')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === '7'
                ? 'bg-white text-emerald-600 dark:bg-slate-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {getTranslation(lang, 'filter7')}
          </button>
          <button
            id="filter-range-30"
            onClick={() => setFilter('30')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === '30'
                ? 'bg-white text-emerald-600 dark:bg-slate-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {getTranslation(lang, 'filter30')}
          </button>
          <button
            id="filter-range-all"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === 'all'
                ? 'bg-white text-emerald-600 dark:bg-slate-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {getTranslation(lang, 'filterAll')}
          </button>
        </div>
      </div>

      {chartData.length < 2 ? (
        <div className="h-[260px] flex flex-col items-center justify-center p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-2xl" id="chart-not-enough">
          <AlertCircle className="w-8 h-8 text-amber-500 mb-2" />
          <p className="text-xs text-slate-500 font-medium">
            {lang === 'my' 
              ? 'တိုးတက်မှုဇယားကို ဆွဲရန် အနည်းဆုံး ကိုယ်အလေးချိန်မှတ်တမ်း ၂ ခု ထည့်သွင်းပေးရန် လိုအပ်ပါသည်။' 
              : 'At least 2 records are required to render your weight trend line graph.'}
          </p>
        </div>
      ) : (
        <div className="h-[280px] w-full mt-4" id="recharts-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }} id="recharts-area-chart">
              <defs id="recharts-defs">
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }}
              />
              <YAxis
                domain={[yDomainMin, yDomainMax]}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: '#64748b' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900/95 dark:bg-slate-950 border border-slate-800 px-4 py-3 rounded-2xl text-white shadow-xl text-left" id="chart-tooltip">
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400 mb-1" id="tooltip-header">
                          <Calendar className="w-3 h-3" />
                          <span>{data.fullLabel}</span>
                        </div>
                        <div className="text-sm font-extrabold" id="tooltip-weight-line">
                          {formatBurmeseNumbers(data.weight, lang)} <span className="text-xs text-emerald-400 uppercase font-medium">{data.unit}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorWeight)"
                activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
