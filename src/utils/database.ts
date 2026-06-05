/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from './supabase';
import { WeightRecord, WeightGoal } from '../types';

// ============= Weight Records =============

export async function fetchWeightRecords() {
  const { data, error } = await supabase
    .from('weight_records')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw new Error(`Failed to fetch records: ${error.message}`);
  return data || [];
}

export async function addWeightRecord(record: Omit<WeightRecord, 'id' | 'diff'>) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) throw new Error('You must be logged in');

  const { data, error } = await supabase
    .from('weight_records')
    .insert([
      {
        user_id: user.id,
        date: record.date,
        weight: record.weight,
        unit: record.unit,
        note: record.note || null,
      },
    ])
    .select();

  if (error) throw new Error(`Failed to add record: ${error.message}`);
  return data?.[0] || null;
}

export async function updateWeightRecord(
  id: string,
  updates: Partial<Omit<WeightRecord, 'id' | 'diff'>>
) {
  const { data, error } = await supabase
    .from('weight_records')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) throw new Error(`Failed to update record: ${error.message}`);
  return data?.[0] || null;
}

export async function deleteWeightRecord(id: string) {
  const { error } = await supabase
    .from('weight_records')
    .delete()
    .eq('id', id);

  if (error) throw new Error(`Failed to delete record: ${error.message}`);
}

// ============= Weight Goals =============

export async function fetchWeightGoal() {
  const { data, error } = await supabase
    .from('weight_goals')
    .select('*')
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows found (not an error for single goals)
    throw new Error(`Failed to fetch goal: ${error.message}`);
  }

  return data || null;
}

export async function updateWeightGoal(goal: Omit<WeightGoal, 'id'>) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) throw new Error('You must be logged in');

  const { data, error } = await supabase
    .from('weight_goals')
    .upsert({
      user_id: user.id,
      target_weight: goal.targetWeight,
      start_weight: goal.startWeight,
      unit: goal.unit,
    })
    .select();

  if (error) throw new Error(`Failed to update goal: ${error.message}`);
  return data?.[0] || null;
}
