/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { WeightRecord } from '../types';
import { getTranslation, formatBurmeseNumbers } from '../utils/translations';
import { Trash2, Trash, AlertTriangle, MessageSquare, ClipboardList, CheckCircle } from 'lucide-react';

interface HistoryLogsProps {
  lang: 'my' | 'en' | 'ja';
  records: WeightRecord[];
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
}

const burmeseMonths = [
  'ဇန်နဝါရီ', 'ဖေဖော်ဝါရီ', 'မတ်', 'ဧပြီ', 'မေ', 'ဇွန်',
  'ဇူလိုင်', 'သြဂုတ်', 'စက်တင်ဘာ', 'အောက်တိုဘာ', 'နိုဝင်ဘာ', 'ဒီဇင်ဘာ'
];

const englishMonths = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const japaneseMonths = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月'
];

export default function HistoryLogs({ lang, records, onDeleteRecord, onClearAll }: HistoryLogsProps) {
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Formatting helper that returns user's specific requested text syntax
  // "June 2 - 160 lbs (2 lbs dropped)"
  const formatUserRecordText = (record: WeightRecord) => {
    const d = new Date(record.date);
    const day = d.getDate();
    const monthIndex = d.getMonth();
    
    const formattedDay = lang === 'ja' ? `${day}日` : formatBurmeseNumbers(day, lang);
    const monthStr = lang === 'my' ? burmeseMonths[monthIndex] : lang === 'ja' ? japaneseMonths[monthIndex] : englishMonths[monthIndex];
    const weightValStr = formatBurmeseNumbers(record.weight, lang);
    const unitText = record.unit === 'lbs' ? (lang === 'my' ? 'ပေါင်' : lang === 'ja' ? 'lbs' : 'lbs') : (lang === 'my' ? 'ကီလို' : (lang === 'ja' ? 'kg' : 'kg'));

    let diffText = '';
    if (record.diff === null) {
      diffText = lang === 'my' ? 'စတင်ချိန်' : lang === 'ja' ? '初期値' : 'Baseline';
    } else {
      const absDiff = parseFloat(Math.abs(record.diff).toFixed(1));
      const diffValStr = formatBurmeseNumbers(absDiff, lang);
      
      if (record.diff > 0) {
        // weight dropped
        diffText = lang === 'my' 
          ? `${diffValStr} ${unitText} ကျသွားသည်` 
          : lang === 'ja'
          ? `${diffValStr} ${unitText} 減少`
          : `${diffValStr} ${unitText} dropped`;
      } else if (record.diff < 0) {
        // weight gained
        diffText = lang === 'my' 
          ? `${diffValStr} ${unitText} တက်လာသည်` 
          : lang === 'ja'
          ? `${diffValStr} ${unitText} 増加`
          : `${diffValStr} ${unitText} gained`;
      } else {
        diffText = lang === 'my' ? 'မပြောင်းလဲပါ' : lang === 'ja' ? '変化なし' : 'no change';
      }
    }

    // June 2 - 160 lbs (2 lbs dropped)
    return `${monthStr} ${formattedDay} - ${weightValStr} ${unitText} (${diffText})`;
  };

  const handleClearHistory = () => {
    onClearAll();
    setShowConfirmClear(false);
  };

  const sortedRecordsForLogs = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-md border border-slate-100 dark:border-slate-800" id="history-logs-container">
      <div className="flex items-center justify-between mb-6" id="history-header">
        <div className="flex items-center space-x-3" id="history-header-title">
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600 dark:bg-blue-950/30 dark:text-blue-400" id="history-header-icon">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white" id="history-title">
              {getTranslation(lang, 'historyTitle')}
            </h2>
          </div>
        </div>

        {records.length > 0 && !showConfirmClear && (
          <button
            id="btn-clear-history-trigger"
            onClick={() => setShowConfirmClear(true)}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 px-3 py-2 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{getTranslation(lang, 'clearHistory')}</span>
          </button>
        )}
      </div>

      {/* Clear All Confirmation Box */}
      {showConfirmClear && (
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 p-4 rounded-2xl mb-6 animate-fade-in" id="clear-confirm-dialog">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-bold text-rose-900 dark:text-rose-200">
                {getTranslation(lang, 'confirmClear')}
              </p>
              <div className="flex gap-2 mt-3" id="confirm-buttons">
                <button
                  id="btn-confirm-clear"
                  onClick={handleClearHistory}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all"
                >
                  {lang === 'my' ? 'သေချာပါတယ်၊ ဖျက်မည်' : 'Yes, delete all'}
                </button>
                <button
                  id="btn-cancel-clear"
                  onClick={() => setShowConfirmClear(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-705 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl transition-all"
                >
                  {getTranslation(lang, 'cancelGoalBtn')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {records.length === 0 ? (
        <div className="text-center py-10 px-4 bg-slate-50 dark:bg-slate-800/10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800" id="history-empty-state">
          <ClipboardList className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3 animate-pulse" />
          <p className="text-xs text-slate-500 font-medium">
            {getTranslation(lang, 'noHistory')}
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1" id="logs-list">
          {sortedRecordsForLogs.map((record) => {
            const hasDiff = record.diff !== null;
            const isLoss = hasDiff && record.diff! > 0;
            const isGain = hasDiff && record.diff! < 0;

            return (
              <div
                key={record.id}
                id={`record-item-${record.id}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/20 hover:bg-slate-100 dark:hover:bg-slate-800/40 border border-slate-150/40 dark:border-slate-800/50 rounded-2xl transition-all duration-200"
              >
                <div className="flex-1" id={`record-info-${record.id}`}>
                  {/* Top line: Exact sentence formatted from prompt requirements */}
                  <div className="flex items-center gap-2 flex-wrap" id={`record-primary-${record.id}`}>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                      {formatUserRecordText(record)}
                    </span>
                    
                    {/* Tiny badges marking classification for quick visual scanner */}
                    {record.diff === null ? (
                      <span className="text-[9px] font-bold bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-300 px-2 py-0.5 rounded-full" id={`badge-base-${record.id}`}>
                        Baseline
                      </span>
                    ) : isLoss ? (
                      <span className="text-[9px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-300 px-2 py-0.5 rounded-full" id={`badge-loss-${record.id}`}>
                        {lang === 'my' ? 'ကျဆင်းသည်' : 'Dropped'}
                      </span>
                    ) : isGain ? (
                      <span className="text-[9px] font-bold bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-300 px-2 py-0.5 rounded-full" id={`badge-gain-${record.id}`}>
                        {lang === 'my' ? 'တိုးလာသည်' : 'Gained'}
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold bg-slate-150 text-slate-600 dark:bg-slate-800 dark:text-slate-400 px-2 py-0.5 rounded-full" id={`badge-equal-${record.id}`}>
                        {lang === 'my' ? 'မပြောင်းလဲ' : 'Same'}
                      </span>
                    )}
                  </div>

                  {/* Bottom details / time or notes if exist */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1.5 flex-wrap" id={`record-meta-${record.id}`}>
                    <span id={`record-date-${record.id}`}>
                      {new Date(record.date).toLocaleTimeString(lang === 'my' ? 'my-MM' : 'en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </span>
                    
                    {record.note && (
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400" id={`record-note-${record.id}`}>
                        <span className="text-slate-300 dark:text-slate-600">|</span>
                        <MessageSquare className="w-3 h-3 text-slate-400" />
                        <span className="italic truncate max-w-[180px] sm:max-w-[280px]">
                          {record.note}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Individual delete action */}
                <button
                  id={`btn-delete-record-${record.id}`}
                  onClick={() => onDeleteRecord(record.id)}
                  className="sm:opacity-0 group-hover:opacity-100 self-end sm:self-auto p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all mt-2 sm:mt-0"
                  title={getTranslation(lang, 'delete')}
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
