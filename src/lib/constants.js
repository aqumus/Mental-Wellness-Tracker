// src/lib/constants.js
// Static app data: exams, plant seeds, Zen Points economy, store catalog,
// mock league cohort, assessment content, gossip prompts, and the safety-net
// keyword list. Pure data — no logic, no side effects.

// --- Target exams (Onboarding step 1) ---------------------------------------
export const EXAMS = [
  { id: 'JEE', label: 'JEE', blurb: 'Engineering entrance' },
  { id: 'NEET', label: 'NEET', blurb: 'Medical entrance' },
  { id: 'UPSC', label: 'UPSC', blurb: 'Civil services' },
  { id: 'GATE', label: 'GATE', blurb: 'Grad aptitude' },
  { id: 'Boards', label: 'Boards', blurb: 'Class 10 / 12' },
];

// --- Starting plant seeds (Onboarding step 3) -------------------------------
export const PLANTS = [
  { id: 'bonsai', label: 'Bonsai', hint: 'Patient & resilient' },
  { id: 'cactus', label: 'Cactus', hint: 'Thrives under pressure' },
  { id: 'fern', label: 'Fern', hint: 'Calm & steady growth' },
];

// --- Zen Points economy (REQUIREMENTS §5A) ----------------------------------
export const ZP = {
  checkIn: 10,
  scenario: 15,
  vent: 15,
  breathing: 10,
  sendChai: 5,
};

// --- Zen Bazaar catalog (DESIGN §4.4) ---------------------------------------
export const STORE_ITEMS = [
  {
    id: 'lofi_beats_01',
    category: 'Focus Audio',
    icon: '🎧',
    title: 'Midnight Lofi Beats',
    desc: 'Calm focus beat — launches the in-app player.',
    cost: 50,
    kind: 'audio',
  },
  {
    id: 'brown_noise_01',
    category: 'Focus Audio',
    icon: '🌧️',
    title: 'Brown Noise Generator',
    desc: 'Deep, steady noise for late-night study blocks.',
    cost: 50,
    kind: 'audio',
  },
  {
    id: 'planner_pdf_01',
    category: 'Study Planners',
    icon: '🗓️',
    title: 'Aesthetic Study Planner',
    desc: 'Printable weekly planner — copy the link on unlock.',
    cost: 75,
    kind: 'link',
    payload: 'https://example.com/zenstudy-planner.pdf',
  },
  {
    id: 'streak_freeze_token',
    category: 'Utility',
    icon: '❄️',
    title: 'Streak Freeze Token',
    desc: 'Auto-protects your streak if you miss one check-in.',
    cost: 100,
    kind: 'utility',
  },
  {
    id: 'golden_pot',
    category: 'Garden Upgrades',
    icon: '🏺',
    title: 'Golden Pot Skin',
    desc: 'A radiant golden pot for your Mind Garden.',
    cost: 150,
    kind: 'garden',
  },
];

// --- Zen League mock cohort (DESIGN §4.5) -----------------------------------
// Wellness-only board: streaks + Zen Points, never academic scores.
export const LEAGUE_PEERS = [
  { id: 'p1', name: 'Aarav', streak: 12, zenPoints: 340, badge: '🔥' },
  { id: 'p2', name: 'Diya', streak: 9, zenPoints: 295, badge: '🌸' },
  { id: 'p3', name: 'Kabir', streak: 7, zenPoints: 240, badge: '🌿' },
  { id: 'p4', name: 'Meera', streak: 5, zenPoints: 180, badge: '☕' },
  { id: 'p5', name: 'Rohan', streak: 3, zenPoints: 120, badge: '✨' },
  { id: 'p6', name: 'Sana', streak: 2, zenPoints: 90, badge: '🌙' },
];

// --- Gossip Corner seed prompts (DESIGN §4.2C) ------------------------------
export const GOSSIP_PROMPTS = [
  { id: 'g1', text: 'Who else survived chapter 4 of Physics today? 😮‍💨', cups: 23 },
  { id: 'g2', text: 'Top coffee brands for 3 AM study blocks — go!', cups: 41 },
  { id: 'g3', text: 'That feeling when the mock is harder than the real thing 💀', cups: 18 },
  { id: 'g4', text: 'Reminder: you are more than your rank. Drink water.', cups: 56 },
];

// --- TAT-inspired visual projective cards (REQUIREMENTS §4A) -----------------
export const TAT_CARDS = [
  {
    id: 'desk',
    title: 'Dimly Lit Desk',
    gradient: 'linear-gradient(160deg, hsl(224,40%,18%), hsl(263,40%,22%))',
    indicator: 'isolation',
    words: ['Lonely', 'Focused', 'Tired'],
  },
  {
    id: 'storm',
    title: 'Winding Path in a Storm',
    gradient: 'linear-gradient(160deg, hsl(24,50%,20%), hsl(0,45%,22%))',
    indicator: 'lack of direction',
    words: ['Lost', 'Anxious', 'Determined'],
  },
  {
    id: 'peak',
    title: 'Serene Peak Under Starlight',
    gradient: 'linear-gradient(160deg, hsl(162,45%,18%), hsl(224,45%,20%))',
    indicator: 'resilience',
    words: ['Calm', 'Hopeful', 'Proud'],
  },
];

// --- CBT-inspired branching scenarios (REQUIREMENTS §4B) --------------------
export const CBT_SCENARIOS = [
  {
    id: 'low-mock',
    prompt: 'You got a low mock test mark. What do you do?',
    choices: [
      { id: 'a', text: 'Tear up the answer sheet', profile: 'catastrophizing', healthy: false },
      { id: 'b', text: 'Study all night without a break', profile: 'burnout risk', healthy: false },
      { id: 'c', text: 'Analyze the errors calmly', profile: 'active coping', healthy: true },
      { id: 'd', text: 'Log off and talk to Shanti', profile: 'active coping', healthy: true },
    ],
  },
];

// --- Breathing exercise (DESIGN dashboard quest) ----------------------------
export const BREATHING_SECONDS = 60;

// --- Safety net (REQUIREMENTS §7, SAFE-01) ----------------------------------
// Trigger phrases that raise the helpline modal. Lowercased substring match.
export const SAFETY_KEYWORDS = [
  'kill myself',
  'suicide',
  'suicidal',
  'end my life',
  'want to die',
  'self harm',
  'self-harm',
  'hurt myself',
  'no reason to live',
  "can't go on",
  'cannot go on',
  'worthless',
];

export const HELPLINES = [
  { name: 'KIRAN Mental Health (India)', detail: '1800-599-0019', href: 'tel:18005990019' },
  { name: 'Vandrevala Foundation', detail: '1860-266-2345', href: 'tel:18602662345' },
  { name: 'iCall Psychosocial Helpline', detail: '9152987821', href: 'tel:9152987821' },
];
