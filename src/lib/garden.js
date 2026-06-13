// src/lib/garden.js
// Pure helpers for the Mind Garden growth/decay state machine (DESIGN §4.1)
// and day/streak math shared across the app. No React, no side effects.

const DAY_MS = 24 * 60 * 60 * 1000;

/** Midnight-aligned day index for an ISO string or Date. */
function dayIndex(value) {
  const d = value ? new Date(value) : new Date();
  return Math.floor(d.getTime() / DAY_MS);
}

/** Whole days between two timestamps (lastActive → now), floored at 0. */
export function daysMissed(lastActive, now = new Date()) {
  if (!lastActive) return 0;
  const diff = dayIndex(now) - dayIndex(lastActive);
  return diff > 0 ? diff : 0;
}

/** True when lastActive falls on a calendar day before today. */
export function isNewDay(lastActive, now = new Date()) {
  if (!lastActive) return true;
  return dayIndex(now) > dayIndex(lastActive);
}

/**
 * Resolve the garden's visual state from the profile.
 * Growth (healthy) is driven by streak; decay overrides growth once days are
 * missed (a Streak Freeze token absorbs the first missed day).
 *
 * @returns {{ key: string, label: string, mood: 'thriving'|'ok'|'decaying', accent: string, missed: number }}
 */
export function getGardenState(profile = {}) {
  const streak = profile.streak || 0;
  const hasFreeze = (profile.redeemedItems || []).includes('streak_freeze_token');
  let missed = daysMissed(profile.lastActive);
  if (hasFreeze && missed > 0) missed -= 1; // token absorbs one missed day

  if (missed <= 0) {
    // Growth phase — staged by streak length.
    if (streak >= 5) return state('bloom', 'Full Bloom', 'thriving', 'var(--accent-teal)', 0);
    if (streak >= 3) return state('tall', 'Growing Tall', 'thriving', 'var(--accent-teal)', 0);
    if (streak >= 1) return state('sprout', 'Fresh Sprout', 'ok', 'var(--accent-teal)', 0);
    return state('seed', 'New Seed', 'ok', 'var(--accent-violet)', 0);
  }

  // Decay phase (DESIGN §4.1 states 4.1 → 4.3).
  if (missed === 1) return state('pale', 'Pale Sprout', 'ok', 'var(--accent-orange)', missed);
  if (missed === 2) return state('drooping', 'Drooping', 'decaying', 'var(--accent-orange)', missed);
  if (missed === 3) return state('wilted', 'Wilted Leaves', 'decaying', 'var(--accent-rose)', missed);
  return state('fungal', 'Fungal Spores', 'decaying', 'var(--color-destructive)', missed);
}

function state(key, label, mood, accent, missed) {
  return { key, label, mood, accent, missed };
}

/**
 * Compute the next streak value given the last-active timestamp.
 * Same day → unchanged. Next day → +1. Gap of 2+ days → reset to 1
 * (the current activity becomes day one), unless a freeze token applies.
 */
export function nextStreak(profile = {}, now = new Date()) {
  const streak = profile.streak || 0;
  if (!profile.lastActive) return 1;
  const missed = daysMissed(profile.lastActive, now);
  if (missed === 0) return streak || 1; // already active today
  if (missed === 1) return streak + 1; // consecutive day
  const hasFreeze = (profile.redeemedItems || []).includes('streak_freeze_token');
  if (missed === 2 && hasFreeze) return streak + 1; // token bridges one gap
  return 1; // streak broken — restart
}
