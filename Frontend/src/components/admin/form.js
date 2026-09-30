'use client';

import { useEffect, useId, useState, useTransition } from 'react';
import { deleteResource, saveResource } from '@/lib/admin/actions';
import { buttonClass } from './ui';

/* ---------- Form state ---------- */

/**
 * Holds a form's values, submits them to the saveResource Server Action and
 * keeps field errors returned by the API.
 *   toPayload(values) converts form strings into the JSON the API expects.
 *   save(payload) optionally replaces the default saveResource call.
 */
export function useResourceForm({ resource, id, initial, toPayload = (v) => v, onSaved, save }) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message }
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();

  useUnsavedChangesWarning(dirty);

  const set = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    setDirty(true);
    if (errors[name]) setErrors(({ [name]: _removed, ...rest }) => rest);
  };

  // Props for a simple input bound to values[name]
  const field = (name, { type } = {}) =>
    type === 'checkbox'
      ? { name, checked: Boolean(values[name]), onChange: (e) => set(name, e.target.checked) }
      : { name, value: values[name] ?? '', onChange: (e) => set(name, e.target.value) };

  const submit = (event) => {
    event?.preventDefault();
    setStatus(null);
    startTransition(async () => {
      const payload = toPayload(values);
      const result = await (save ? save(payload) : saveResource(resource, id ?? null, payload));
      if (!result) return; // created: the action redirected to the new record
      if (result.ok) {
        setDirty(false);
        setErrors({});
        setStatus({ type: 'success', message: 'Saved. The website is updated.' });
        onSaved?.(result.data);
      } else {
        setErrors(result.fieldErrors ?? {});
        setStatus({ type: 'error', message: result.error });
      }
    });
  };

  return { values, set, field, errors, status, pending, dirty, submit, setDirty };
}

// Ask before leaving the page with unsaved edits
export function useUnsavedChangesWarning(dirty) {
  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
}

/* ---------- Fields ---------- */

export const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 aria-[invalid=true]:border-rose-500';

// Label + hint + error around any input. Children receive the generated id.
export function Field({ label, error, hint, required, className = '', children }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-rose-600"> *</span>}
      </label>
      {children({ id, 'aria-invalid': Boolean(error), 'aria-describedby': error || hint ? `${id}-help` : undefined })}
      {(error || hint) && (
        <p id={`${id}-help`} className={`mt-1 text-xs ${error ? 'text-rose-600' : 'text-muted'}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
}

export function TextField({ label, error, hint, required, className, multiline, rows = 4, ...props }) {
  return (
    <Field label={label} error={error} hint={hint} required={required} className={className}>
      {(a11y) =>
        multiline ? (
          <textarea {...a11y} {...props} rows={rows} required={required} className={inputClass} />
        ) : (
          <input {...a11y} {...props} required={required} className={inputClass} />
        )
      }
    </Field>
  );
}

export function SelectField({ label, error, hint, required, className, options, placeholder, ...props }) {
  return (
    <Field label={label} error={error} hint={hint} required={required} className={className}>
      {(a11y) => (
        <select {...a11y} {...props} required={required} className={inputClass}>
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

export function CheckboxField({ label, hint, ...props }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50">
      <input type="checkbox" {...props} className="mt-0.5 h-4 w-4 accent-[var(--color-brand)]" />
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
    </label>
  );
}

// Edits a list of strings as a textarea with one item per line
export function LinesField({ label, value = [], onChange, error, hint = 'One per line', rows = 5, className }) {
  const [text, setText] = useState(value.join('\n'));
  return (
    <TextField
      label={label}
      error={error}
      hint={hint}
      className={className}
      multiline
      rows={rows}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        onChange(e.target.value.split('\n').map((l) => l.trim()).filter(Boolean));
      }}
    />
  );
}

/* ---------- Repeater (itinerary days, FAQs, post sections) ---------- */

// Rows get a client-only _key so React keeps each row's inputs attached to the
// right item when rows are moved or removed. The API ignores unknown fields.
let keySeq = 0;
const nextKey = () => `row-${++keySeq}`;
export const withKeys = (items = []) => items.map((item) => ({ ...item, _key: nextKey() }));

export function Repeater({ items, onChange, newItem, addLabel, renderItem, itemLabel, error }) {
  const update = (index, patch) => onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  const remove = (index) => onChange(items.filter((_, i) => i !== index));
  const move = (index, dir) => {
    const next = [...items];
    [next[index], next[index + dir]] = [next[index + dir], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item._key ?? index} className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-ink">{itemLabel(item, index)}</p>
            <div className="flex gap-1">
              <IconButton label="Move up" disabled={index === 0} onClick={() => move(index, -1)}>↑</IconButton>
              <IconButton label="Move down" disabled={index === items.length - 1} onClick={() => move(index, 1)}>↓</IconButton>
              <IconButton label="Remove" onClick={() => remove(index)} danger>✕</IconButton>
            </div>
          </div>
          {renderItem(item, (patch) => update(index, patch), index)}
        </div>
      ))}
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <button type="button" onClick={() => onChange([...items, { ...newItem(items), _key: nextKey() }])} className={buttonClass('secondary')}>
        + {addLabel}
      </button>
    </div>
  );
}

function IconButton({ label, danger, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      {...props}
      className={`h-8 w-8 rounded-md text-sm disabled:opacity-30 ${danger ? 'text-rose-600 hover:bg-rose-50' : 'text-muted hover:bg-slate-200'}`}
    />
  );
}

/* ---------- Actions ---------- */

export function StatusMessage({ status }) {
  if (!status) return null;
  return (
    <p role="status" className={`text-sm ${status.type === 'success' ? 'text-emerald-700' : 'text-rose-600'}`}>
      {status.message}
    </p>
  );
}

// Sticky bar at the bottom of long forms
export function FormActions({ form, submitLabel = 'Save changes', children }) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6">
      <button type="submit" disabled={form.pending} className={buttonClass('primary')}>
        {form.pending ? 'Saving…' : submitLabel}
      </button>
      {form.dirty && !form.pending && <span className="text-sm text-muted">Unsaved changes</span>}
      <StatusMessage status={form.status} />
      <div className="ml-auto flex gap-2">{children}</div>
    </div>
  );
}

// Two-step delete: first click asks, second click deletes
export function DeleteButton({ resource, id, redirectTo, label = 'Delete', confirmLabel = 'Click again to delete', onDeleted, force }) {
  const [armed, setArmed] = useState(false);
  const [error, setError] = useState(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(false), 6000);
    return () => clearTimeout(timer);
  }, [armed]);

  const onClick = () => {
    if (!armed) return setArmed(true);
    startTransition(async () => {
      const result = await deleteResource(resource, id, { redirectTo, force });
      if (result && !result.ok) {
        setError(result.error);
        setArmed(false);
      } else onDeleted?.();
    });
  };

  return (
    <span className="inline-flex flex-col items-end">
      <button type="button" onClick={onClick} disabled={pending} className={buttonClass(armed ? 'danger' : 'ghost', armed ? '' : 'text-rose-600')}>
        {pending ? 'Deleting…' : armed ? confirmLabel : label}
      </button>
      {error && <span className="mt-1 max-w-xs text-right text-xs text-rose-600">{error}</span>}
    </span>
  );
}

/* ---------- Helpers for toPayload ---------- */

export const toInt = (v) => (v === '' || v === null || v === undefined ? null : Number.parseInt(v, 10));
export const toNumber = (v) => (v === '' || v === null || v === undefined ? null : Number(v));
export const emptyToNull = (v) => (typeof v === 'string' && v.trim() === '' ? null : v);
