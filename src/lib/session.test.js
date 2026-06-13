import { describe, it, expect, beforeEach } from 'vitest';
import { makeUid, getSession, setSession, clearSession, containsSafetyTrigger } from './session.js';
import { SAFETY_KEYWORDS } from './constants.js';

describe('makeUid', () => {
  it('applies the prefix and yields distinct ids', () => {
    const a = makeUid('guest');
    const b = makeUid('guest');
    expect(a.startsWith('guest_')).toBe(true);
    expect(a).not.toBe(b);
  });
});

describe('session persistence', () => {
  beforeEach(() => localStorage.clear());

  it('round-trips a session and clears it', () => {
    expect(getSession()).toBeNull();
    setSession({ uid: 'u1', isGuest: true });
    expect(getSession()).toEqual({ uid: 'u1', isGuest: true });
    clearSession();
    expect(getSession()).toBeNull();
  });

  it('returns null for corrupt stored data', () => {
    localStorage.setItem('zenstudy:session', '{not json');
    expect(getSession()).toBeNull();
  });
});

describe('containsSafetyTrigger', () => {
  it('detects a trigger phrase case-insensitively', () => {
    expect(containsSafetyTrigger('honestly I just want to DIE', SAFETY_KEYWORDS)).toBe(true);
  });
  it('returns false for ordinary exam-stress text', () => {
    expect(containsSafetyTrigger('physics mock was brutal today', SAFETY_KEYWORDS)).toBe(false);
  });
  it('handles empty input', () => {
    expect(containsSafetyTrigger('', SAFETY_KEYWORDS)).toBe(false);
  });
});
