import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import type { ApiError } from '../types';

type RtkError = FetchBaseQueryError | SerializedError | undefined;

/** Pull the backend's { error: { message, code, fields } } out of an RTK Query error. */
export function getApiError(err: RtkError): ApiError | null {
  if (err && 'data' in err && err.data && typeof err.data === 'object') {
    const data = err.data as { error?: ApiError };
    if (data.error) return data.error;
  }
  return null;
}

/** Human-readable message for any RTK Query error, with a sensible fallback. */
export function getErrorMessage(err: RtkError, fallback = 'Something went wrong.'): string {
  const apiErr = getApiError(err);
  if (apiErr) return apiErr.message;
  if (err && 'status' in err && err.status === 'FETCH_ERROR') {
    return 'Cannot reach the server. Is the backend running?';
  }
  if (err && 'message' in err && err.message) return err.message;
  return fallback;
}
