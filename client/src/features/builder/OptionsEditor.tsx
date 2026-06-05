import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';

interface OptionsEditorProps {
  options: string[];
  onChange: (options: string[]) => void;
  error?: string;
}

/** Add/remove/edit the option list for a select or multiselect field. */
export default function OptionsEditor({ options, onChange, error }: OptionsEditorProps) {
  const update = (i: number, value: string) =>
    onChange(options.map((o, idx) => (idx === i ? value : o)));
  const remove = (i: number) => onChange(options.filter((_, idx) => idx !== i));
  const add = () => onChange([...options, '']);

  return (
    <div>
      <span className="label mb-1.5">Options</span>
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {options.map((opt, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.12 }}
              className="flex items-center gap-2"
            >
              <input
                className="input"
                value={opt}
                placeholder={`Option ${i + 1}`}
                onChange={(e) => update(i, e.target.value)}
              />
              <button
                type="button"
                onClick={() => remove(i)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                aria-label="Remove option"
              >
                <X size={15} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      <button type="button" onClick={add} className="btn-ghost mt-2 px-2 py-1 text-xs">
        <Plus size={13} /> Add option
      </button>
    </div>
  );
}
