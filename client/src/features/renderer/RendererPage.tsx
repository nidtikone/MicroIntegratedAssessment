import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, FileQuestion } from 'lucide-react';
import { useGetFormQuery, useSubmitResponseMutation } from '../api/apiSlice';
import { LoadingState, Spinner } from '../../components/StateViews';
import { getApiError, getErrorMessage } from '../../utils/apiError';
import FieldInput from './FieldInput';
import type { AnswerState } from './answers';
import { initialAnswers, validateAnswers, toAnswerPayload } from './answers';

export default function RendererPage() {
  const { publicId = '' } = useParams();
  const navigate = useNavigate();
  const { data: form, isLoading, isError, error } = useGetFormQuery(publicId);
  const [submit, { isLoading: isSubmitting }] = useSubmitResponseMutation();

  const [values, setValues] = useState<AnswerState>({});
  const [attempted, setAttempted] = useState(false);
  const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  // Seed answer state once the schema arrives.
  useEffect(() => {
    if (form) setValues(initialAnswers(form.fields));
  }, [form]);

  const clientErrors = useMemo(
    () => (form ? validateAnswers(form.fields, values) : {}),
    [form, values]
  );

  if (isLoading) return <LoadingState label="Loading form…" />;

  if (isError || !form) {
    const apiErr = getApiError(error);
    return (
      <div className="grid min-h-screen place-items-center p-6">
        <div className="card max-w-md p-8 text-center">
          <FileQuestion className="mx-auto text-slate-300" size={48} />
          <h1 className="mt-3 text-xl font-bold text-slate-900">
            {apiErr?.code === 'NOT_FOUND' ? 'Form not found' : 'Unable to load form'}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {apiErr?.code === 'NOT_FOUND'
              ? 'This form may have been deleted or the link is incorrect.'
              : getErrorMessage(error)}
          </p>
          <Link to="/" className="btn-ghost mt-4">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  const errors = { ...clientErrors, ...serverFieldErrors };

  function setField(id: string, value: string | string[]) {
    setValues((prev) => ({ ...prev, [id]: value }));
    if (serverFieldErrors[id]) {
      setServerFieldErrors((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAttempted(true);
    setServerMessage(null);
    if (Object.keys(clientErrors).length > 0) return;
    try {
      await submit({ publicId, answers: toAnswerPayload(form!.fields, values) }).unwrap();
      navigate(`/f/${publicId}/submitted`);
    } catch (err) {
      const apiErr = getApiError(err as never);
      if (apiErr?.fields) setServerFieldErrors(apiErr.fields);
      setServerMessage(apiErr?.message ?? 'Submission failed. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-lg"
      >
        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 bg-white p-6">
            <h1 className="text-xl font-bold text-slate-900">{form.title}</h1>
            {form.description && <p className="mt-1 text-sm text-slate-500">{form.description}</p>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-6" noValidate>
            {form.fields.map((field) => (
              <FieldInput
                key={field.id}
                field={field}
                value={values[field.id] ?? (field.type === 'multiselect' ? [] : '')}
                error={attempted ? errors[field.id] : serverFieldErrors[field.id]}
                onChange={(v) => setField(field.id, v)}
              />
            ))}

            {serverMessage && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{serverMessage}</span>
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting && <Spinner className="h-4 w-4 border-white/40 border-t-white" />}
              Submit
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">Powered by FormForge</p>
      </motion.div>
    </div>
  );
}
