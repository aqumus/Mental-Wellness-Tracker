// src/components/ChatCompanion.jsx
// Shanti (DESIGN §4.6): a floating companion drawer with stateful context.
// Builds a context summary (identity, exam countdown, streak, recent stressors)
// and sends it with each turn to geminiService. History persists via the
// dual-path service. All content renders as safe React text nodes (no HTML).

import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { sendCompanionMessage } from '../services/geminiService.js';
import { getChatHistory, saveChatHistory } from '../services/dbService.js';

// Compose the context the companion is "aware" of, surfaced to the user so the
// personalization is visible during a demo.
function buildContext(profile) {
  const parts = [];
  if (profile.targetExam) parts.push(`${profile.targetExam} aspirant`);
  if (profile.targetDate) {
    const days = Math.ceil((new Date(profile.targetDate) - Date.now()) / 86400000);
    if (days > 0) parts.push(`${days} days to exam`);
  }
  if (profile.streak) parts.push(`${profile.streak}-day streak`);
  const triggers = (profile.stressTriggers || []).slice(-2);
  if (triggers.length) parts.push(`tracking: ${triggers.join(', ')}`);
  return parts.join(' · ');
}

function greetingFor(profile) {
  const trig = (profile.stressTriggers || []).slice(-1)[0];
  const base = `Hi ${profile.name || 'there'}, I'm Shanti. `;
  if (trig) {
    return base + `I noticed "${trig}" has been on your mind lately. How are you feeling about your ${profile.targetExam || 'exam'} prep today?`;
  }
  return base + `How is your ${profile.targetExam || 'exam'} prep treating you today?`;
}

export default function ChatCompanion({ profile, uid, open, onToggle, checkSafety }) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef(null);
  const context = buildContext(profile);

  // Load persisted history (or seed a context-aware greeting) on first open.
  useEffect(() => {
    if (!open || messages.length) return;
    let alive = true;
    getChatHistory(uid).then((history) => {
      if (!alive) return;
      if (history && history.length) setMessages(history);
      else setMessages([{ role: 'assistant', content: greetingFor(profile) }]);
    });
    return () => {
      alive = false;
    };
  }, [open, uid]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollRef.current?.scrollTo?.(0, scrollRef.current.scrollHeight);
  }, [messages, busy]);

  async function send() {
    const content = draft.trim();
    if (!content || busy) return;
    setDraft('');
    const userMsg = { role: 'user', content };
    const withUser = [...messages, userMsg];
    setMessages(withUser);

    // Safety net takes priority over the AI turn.
    if (checkSafety(content)) {
      const safe = {
        role: 'assistant',
        content:
          "I'm really glad you told me. What you're feeling matters, and you deserve support from someone who can help right now. Please reach out to one of the helplines I just showed you — I'm here too.",
      };
      const next = [...withUser, safe];
      setMessages(next);
      saveChatHistory(uid, next);
      return;
    }

    setBusy(true);
    try {
      const reply = await sendCompanionMessage(withUser, profile);
      const next = [...withUser, { role: 'assistant', content: reply }];
      setMessages(next);
      saveChatHistory(uid, next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="chat-fab"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls="shanti-drawer"
        aria-label={open ? 'Close Shanti' : 'Open Shanti'}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {open && (
        <div id="shanti-drawer" className="chat-drawer" role="dialog" aria-label="Shanti companion chat">
          {/* Header */}
          <div className="flex items-center gap-2 p-4" style={{ borderBottom: '1px solid var(--border-glass)' }}>
            <div className="flex items-center justify-center rounded-full" style={{ width: 36, height: 36, background: 'var(--accent-violet)' }}>
              🧘
            </div>
            <div className="flex-1">
              <span className="font-[var(--font-display)] font-semibold block">Shanti</span>
              {context && <span className="text-[var(--text-muted)] text-xs">{context}</span>}
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {messages.map((m, i) => (
              <div key={i} className={`bubble ${m.role === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
                {m.content}
              </div>
            ))}
            {busy && <div className="bubble bubble-ai" style={{ opacity: 0.6 }}>Shanti is typing…</div>}
          </div>

          {/* Composer */}
          <div className="flex gap-2 p-3" style={{ borderTop: '1px solid var(--border-glass)' }}>
            <input
              className="input-field"
              placeholder="Talk to Shanti…"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
            />
            <button type="button" className="btn-primary" onClick={send} disabled={!draft.trim() || busy} aria-label="Send">
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
