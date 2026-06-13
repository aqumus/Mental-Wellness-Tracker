// src/components/Toast.jsx
// Transient confirmation toast. Visibility + auto-dismiss are owned by App;
// this component only renders the current message.

import { CheckCircle2 } from 'lucide-react';

export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      <span className="flex items-center gap-2">
        <CheckCircle2 size={16} color="var(--accent-teal)" />
        {message}
      </span>
    </div>
  );
}
