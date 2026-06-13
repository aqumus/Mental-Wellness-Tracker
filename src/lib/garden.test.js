import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { daysMissed, isNewDay, getGardenState, nextStreak } from './garden.js';

const DAY = 86_400_000;
const NOW = new Date('2026-06-13T12:00:00.000Z');
const ago = (days) => new Date(NOW.getTime() - days * DAY).toISOString();

describe('daysMissed', () => {
  it('is 0 for activity earlier the same day', () => {
    expect(daysMissed(new Date(NOW.getTime() - 3 * 3600_000).toISOString(), NOW)).toBe(0);
  });
  it('counts whole calendar days', () => {
    expect(daysMissed(ago(3), NOW)).toBe(3);
  });
  it('is 0 when lastActive is absent', () => {
    expect(daysMissed(null, NOW)).toBe(0);
  });
});

describe('isNewDay', () => {
  it('is true with no prior activity', () => expect(isNewDay(null, NOW)).toBe(true));
  it('is false later the same day', () => {
    expect(isNewDay(new Date(NOW.getTime() - 3600_000).toISOString(), NOW)).toBe(false);
  });
  it('is true on the next day', () => expect(isNewDay(ago(1), NOW)).toBe(true));
});

describe('nextStreak', () => {
  it('starts at 1 on first activity', () => expect(nextStreak({}, NOW)).toBe(1));
  it('is unchanged on the same day', () => {
    expect(nextStreak({ streak: 4, lastActive: new Date(NOW.getTime() - 3600_000).toISOString() }, NOW)).toBe(4);
  });
  it('increments on a consecutive day', () => {
    expect(nextStreak({ streak: 4, lastActive: ago(1) }, NOW)).toBe(5);
  });
  it('resets to 1 after a 2+ day gap', () => {
    expect(nextStreak({ streak: 4, lastActive: ago(3) }, NOW)).toBe(1);
  });
  it('bridges a single-day gap with a freeze token', () => {
    expect(nextStreak({ streak: 4, redeemedItems: ['streak_freeze_token'], lastActive: ago(2) }, NOW)).toBe(5);
  });
});

describe('getGardenState', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });
  afterEach(() => vi.useRealTimers());

  it('blooms at a 5+ day streak when active today', () => {
    expect(getGardenState({ streak: 5, lastActive: NOW.toISOString() }).key).toBe('bloom');
  });
  it('is a seed at streak 0', () => {
    expect(getGardenState({ streak: 0, lastActive: NOW.toISOString() }).key).toBe('seed');
  });
  it('droops after 2 missed days', () => {
    expect(getGardenState({ streak: 5, lastActive: ago(2) }).key).toBe('drooping');
  });
  it('grows fungal spores after 4+ missed days', () => {
    expect(getGardenState({ streak: 5, lastActive: ago(5) }).key).toBe('fungal');
  });
  it('lets a freeze token absorb one missed day', () => {
    expect(
      getGardenState({ streak: 5, redeemedItems: ['streak_freeze_token'], lastActive: ago(1) }).key,
    ).toBe('bloom');
  });
});
