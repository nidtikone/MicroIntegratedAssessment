import { useState } from 'react';
import { Check, Link2 } from 'lucide-react';

/** Copies text to the clipboard and shows a transient "Copied" confirmation. */
export default function CopyButton({ text, label = 'Copy link' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — silently ignore */
    }
  }

  return (
    <button
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
      onClick={copy}
      type="button"
    >
      {copied ? <Check size={13} className="text-green-600" /> : <Link2 size={13} />}
      {copied ? 'Copied!' : label}
    </button>
  );
}
