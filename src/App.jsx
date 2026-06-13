// src/App.jsx
// Root state machine: Auth → Onboarding → Dashboard/Main tabs (DESIGN §2, §4).
// Owns session + profile, the persistent Navbar + Shanti companion, and the
// shared reward / journal / safety-net handlers every feature view consumes.
// Dual-path services keep the whole app usable in offline mock mode.

import { useCallback, useEffect, useRef, useState } from 'react';
import Auth from './components/Auth.jsx';
import Onboarding from './components/Onboarding.jsx';
import Navbar from './components/Navbar.jsx';
import Dashboard from './components/Dashboard.jsx';
import VentRooms from './components/VentRooms.jsx';
import PlayfulAssessment from './components/PlayfulAssessment.jsx';
import ZenLeague from './components/ZenLeague.jsx';
import ZenBazaar from './components/ZenBazaar.jsx';
import Insights from './components/Insights.jsx';
import ChatCompanion from './components/ChatCompanion.jsx';
import Settings from './components/Settings.jsx';
import SafetyNet from './components/SafetyNet.jsx';
import Toast from './components/Toast.jsx';

import { getUser, updateUser, logJournal } from './services/dbService.js';
import { analyzeJournalEntry } from './services/geminiService.js';
import { getSession, setSession, clearSession, makeUid, containsSafetyTrigger } from './lib/session.js';
import { nextStreak } from './lib/garden.js';
import { SAFETY_KEYWORDS } from './lib/constants.js';

function uidForEmail(email) {
  return 'user_' + email.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

export default function App() {
  const [session, setSessionState] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('dashboard');
  const [toast, setToast] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const toastTimer = useRef(null);

  // --- Restore session on load (refresh persistence, AUTH criterion 1) ------
  useEffect(() => {
    const existing = getSession();
    if (!existing) {
      setLoading(false);
      return;
    }
    setSessionState(existing);
    getUser(existing.uid).then((u) => {
      setProfile(u);
      setLoading(false);
    });
  }, []);

  const pushToast = useCallback((message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2800);
  }, []);

  // --- Auth handlers --------------------------------------------------------
  async function authenticate({ mode, email, name }) {
    const uid = mode === 'guest' ? makeUid('guest') : uidForEmail(email);
    const next = { uid, email: email || null, isGuest: mode === 'guest', name: name || '' };
    setSession(next);
    setSessionState(next);
    const existing = await getUser(uid);
    setProfile(existing && existing.onboarded ? existing : existing || null);
  }

  const completeOnboarding = async ({ name, targetExam, targetDate, startingPlant }) => {
    const now = new Date().toISOString();
    const newProfile = {
      uid: session.uid,
      name,
      targetExam,
      targetDate,
      startingPlant,
      streak: 1,
      zenPoints: 10, // welcome bonus
      lastActive: now,
      createdAt: now,
      redeemedItems: [],
      stressTriggers: [],
      moodHistory: [{ score: 3, date: now }],
      onboarded: true,
    };
    await updateUser(session.uid, newProfile);
    setProfile(newProfile);
    setView('dashboard');
    pushToast(`Welcome to ZenStudy, ${name}! 🌱 +10 ZP`);
  };

  // --- Profile persistence --------------------------------------------------
  const persistProfile = useCallback(
    async (patch) => {
      const merged = { ...profile, ...patch };
      setProfile(merged);
      await updateUser(merged.uid, patch);
      return merged;
    },
    [profile],
  );

  // Central reward: ZP, optional streak/check-in, mood, and stress triggers.
  const grantReward = useCallback(
    async ({ zen = 0, label, mood, triggers = [], markCheckIn = true }) => {
      const now = new Date().toISOString();
      const patch = { zenPoints: (profile.zenPoints || 0) + zen };
      if (markCheckIn) {
        patch.streak = nextStreak(profile);
        patch.lastActive = now;
      }
      if (typeof mood === 'number') {
        patch.moodHistory = [...(profile.moodHistory || []), { score: mood, date: now }].slice(-30);
      }
      if (triggers.length) {
        patch.stressTriggers = Array.from(new Set([...(profile.stressTriggers || []), ...triggers])).slice(-12);
      }
      await persistProfile(patch);
      pushToast(label || `+${zen} ZP`);
    },
    [profile, persistProfile, pushToast],
  );

  // Journal submission (rant / insecurity): store, analyze, then reward.
  const submitJournal = useCallback(
    async ({ entryType, content, moodScore = 3, zen = 0 }) => {
      await logJournal(profile.uid, { entryType, content, moodScore });
      const analysis = await analyzeJournalEntry({ content, moodScore, entryType }, profile);
      await grantReward({
        zen,
        label: `Released · +${zen} ZP`,
        mood: moodScore,
        triggers: analysis?.stressTriggers || [],
        markCheckIn: true,
      });
      return analysis;
    },
    [profile, grantReward],
  );

  const checkSafety = useCallback((text) => {
    if (containsSafetyTrigger(text, SAFETY_KEYWORDS)) {
      setSafetyOpen(true);
      return true;
    }
    return false;
  }, []);

  const redeem = useCallback(
    async (item) => {
      const balance = profile.zenPoints || 0;
      if (balance < item.cost || (profile.redeemedItems || []).includes(item.id)) {
        return { ok: false };
      }
      await persistProfile({
        zenPoints: balance - item.cost,
        redeemedItems: [...(profile.redeemedItems || []), item.id],
      });
      pushToast(`Redeemed ${item.title} ✓`);
      return { ok: true };
    },
    [profile, persistProfile, pushToast],
  );

  function logout() {
    clearSession();
    setSessionState(null);
    setProfile(null);
    setShowSettings(false);
    setChatOpen(false);
    setView('dashboard');
  }

  // --- Render gates ---------------------------------------------------------
  if (loading) return <div className="loading-screen">🌱</div>;
  if (!session) return <Auth onAuthenticate={authenticate} onGuest={() => authenticate({ mode: 'guest' })} />;
  if (!profile || !profile.onboarded) {
    return <Onboarding initialName={session.name} onComplete={completeOnboarding} />;
  }

  return (
    <>
      <Navbar
        profile={profile}
        view={view}
        onNavigate={setView}
        onOpenSettings={() => setShowSettings(true)}
        onLogout={logout}
      />

      <main className="max-w-5xl mx-auto px-4 py-6" style={{ paddingBottom: 100 }}>
        {view === 'dashboard' && (
          <Dashboard profile={profile} onReward={grantReward} onNavigate={setView} pushToast={pushToast} />
        )}
        {view === 'vent' && (
          <VentRooms onJournal={submitJournal} onReward={grantReward} checkSafety={checkSafety} pushToast={pushToast} />
        )}
        {view === 'assess' && <PlayfulAssessment onReward={grantReward} pushToast={pushToast} />}
        {view === 'league' && <ZenLeague profile={profile} onReward={grantReward} pushToast={pushToast} />}
        {view === 'bazaar' && <ZenBazaar profile={profile} onRedeem={redeem} pushToast={pushToast} />}
        {view === 'insights' && <Insights profile={profile} uid={profile.uid} />}
      </main>

      <ChatCompanion
        profile={profile}
        uid={profile.uid}
        open={chatOpen}
        onToggle={() => setChatOpen((o) => !o)}
        checkSafety={checkSafety}
      />

      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} onLogout={logout} pushToast={pushToast} />
      )}
      <SafetyNet open={safetyOpen} onClose={() => setSafetyOpen(false)} />
      <Toast message={toast} />
    </>
  );
}
