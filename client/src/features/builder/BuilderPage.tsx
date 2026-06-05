import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { useCreateFormMutation } from '../api/apiSlice';
import { getErrorMessage } from '../../utils/apiError';
import { Spinner } from '../../components/StateViews';
import CopyButton from '../../components/ui/CopyButton';
import FieldEditor from './FieldEditor';
import type { DraftField } from './draft';
import { createField, validateDraft, hasErrors, toPayload } from './draft';
import type { FormSchema } from '../../types';

export default function BuilderPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<DraftField[]>(() => [createField()]);
  const [attempted, setAttempted] = useState(false);
  const [created, setCreated] = useState<FormSchema | null>(null);

  const [createForm, { isLoading, error: serverError, reset }] = useCreateFormMutation();

  const errors = useMemo(() => validateDraft(title, fields), [title, fields]);
  const showErrors = attempted;

  // Stable callbacks (functional updates) so memoized FieldEditors don't re-render.
  const patchField = useCallback((localId: string, patch: Partial<DraftField>) => {
    setFields((prev) => prev.map((f) => (f.localId === localId ? { ...f, ...patch } : f)));
  }, []);
  const removeField = useCallback((localId: string) => {
    setFields((prev) => prev.filter((f) => f.localId !== localId));
  }, []);
  const addField = () => setFields((prev) => [...prev, createField()]);

  async function handleSave() {
    setAttempted(true);
    if (hasErrors(errors)) return;
    try {
      const result = await createForm(toPayload(title, description, fields)).unwrap();
      setCreated(result);
    } catch {
      /* surfaced via serverError banner */
    }
  }

  function resetBuilder() {
    setTitle('');
    setDescription('');
    setFields([createField()]);
    setAttempted(false);
    setCreated(null);
    reset();
  }

  // --- Success view ---------------------------------------------------------
  if (created) {
    const shareUrl = `${window.location.origin}/f/${created.publicId}`;
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-lg text-center"
      >
        <CheckCircle2 className="mx-auto text-green-500" size={56} />
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Form created!</h1>
        <p className="mt-1 text-sm text-slate-500">Share this link to start collecting responses.</p>

        <div className="card mt-6 flex items-center justify-between gap-3 p-3 text-left">
          <code className="truncate pl-1 text-sm text-slate-600">{shareUrl}</code>
          <CopyButton text={shareUrl} />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to={`/forms/${created.publicId}`} className="btn-primary">
            View responses &amp; analytics
          </Link>
          <a href={`/f/${created.publicId}`} target="_blank" rel="noreferrer" className="btn-ghost">
            <ExternalLink size={16} /> Open public form
          </a>
          <button className="btn-ghost" onClick={resetBuilder}>
            Create another
          </button>
        </div>
      </motion.div>
    );
  }

  // --- Builder view ---------------------------------------------------------
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">New form</h1>
        <p className="mt-1 text-sm text-slate-500">
          Add fields, configure validation, and save to get a shareable link.
        </p>
      </div>

      {/* Form meta */}
      <div className="card space-y-4 p-5">
        <div>
          <label className="label mb-1.5">Form title</label>
          <input
            className={`input ${showErrors && errors.title ? 'border-red-400 focus:border-red-500 focus:ring-red-500' : ''}`}
            value={title}
            placeholder="e.g. Job Application"
            onChange={(e) => setTitle(e.target.value)}
          />
          {showErrors && errors.title && (
            <p className="mt-1.5 text-xs text-red-600">{errors.title}</p>
          )}
        </div>
        <div>
          <label className="label mb-1.5">Description (optional)</label>
          <input
            className="input"
            value={description}
            placeholder="A short description shown on the public form"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      {/* Fields */}
      <div className="mt-5 space-y-3">
        <AnimatePresence initial={false}>
          {fields.map((field, i) => (
            <motion.div
              key={field.localId}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.16 }}
            >
              <FieldEditor
                field={field}
                index={i}
                errors={showErrors ? errors.fields[field.localId] : undefined}
                onChange={patchField}
                onRemove={removeField}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {showErrors && errors.form && (
        <p className="mt-3 text-sm text-red-600">{errors.form}</p>
      )}

      <button onClick={addField} className="btn-ghost mt-3 w-full border border-dashed border-slate-300">
        <Plus size={16} /> Add field
      </button>

      {/* Server error banner */}
      {serverError && (
        <div className="mt-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{getErrorMessage(serverError)}</span>
        </div>
      )}

      {/* Save */}
      <div className="mt-6 flex items-center justify-end gap-3">
        <Link to="/" className="btn-ghost">
          Cancel
        </Link>
        <button className="btn-primary" onClick={handleSave} disabled={isLoading}>
          {isLoading && <Spinner className="h-4 w-4 border-white/40 border-t-white" />}
          Save form
        </button>
      </div>
    </div>
  );
}
