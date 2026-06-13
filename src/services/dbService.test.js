import { describe, it, expect, beforeEach } from 'vitest';
import {
  getUser,
  updateUser,
  logJournal,
  getJournals,
  saveChatHistory,
  getChatHistory,
} from './dbService.js';

// With no VITE_FIREBASE_* env vars, firebase.js reports MOCK_MODE = true,
// so every method below exercises the localStorage path.
describe('dbService (mock mode)', () => {
  beforeEach(() => localStorage.clear());

  it('returns null for an unknown user', async () => {
    expect(await getUser('u1')).toBeNull();
  });

  it('merges partial updates without clobbering prior fields', async () => {
    await updateUser('u1', { name: 'Aarav', zenPoints: 10 });
    await updateUser('u1', { zenPoints: 25 });
    const u = await getUser('u1');
    expect(u.name).toBe('Aarav');
    expect(u.zenPoints).toBe(25);
  });

  it('prepends journals newest-first and stamps userId + timestamp', async () => {
    await logJournal('u1', { content: 'first', entryType: 'rant' });
    await logJournal('u1', { content: 'second', entryType: 'rant' });
    const list = await getJournals('u1');
    expect(list).toHaveLength(2);
    expect(list[0].content).toBe('second');
    expect(list[0].userId).toBe('u1');
    expect(list[0].timestamp).toBeTruthy();
  });

  it('round-trips chat history', async () => {
    expect(await getChatHistory('u1')).toEqual([]);
    await saveChatHistory('u1', [{ role: 'user', content: 'hi' }]);
    expect(await getChatHistory('u1')).toEqual([{ role: 'user', content: 'hi' }]);
  });

  it('isolates data per user id', async () => {
    await updateUser('u1', { name: 'Aarav' });
    expect(await getUser('u2')).toBeNull();
  });
});
