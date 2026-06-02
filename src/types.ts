/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface WeightRecord {
  id: string;
  date: string; // ISO Date string (e.g., "2026-06-02T03:35:40Z")
  weight: number; // Weight numerical value
  diff: number | null; // Difference compared to previous record (can be negative, positive, or 0)
  unit: 'lbs' | 'kg';
  note?: string;
}

export interface WeightGoal {
  targetWeight: number | null;
  startWeight: number | null;
  unit: 'lbs' | 'kg';
}

export type Language = 'my' | 'en' | 'ja';

export interface BmiInfo {
  height: number; // in cm
  weight: number; // in kg or lbs depending on context
  unit: 'lbs' | 'kg';
}
