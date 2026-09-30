'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useTransition } from 'react';
import { listMedia, uploadMedia } from '@/lib/admin/actions';
import { IMAGE_HOSTS, isPreviewableImage } from '@/lib/admin/images';
import { Field, inputClass } from './form';
import { buttonClass } from './ui';

// Image input: pick from the media library, upload a new image, or paste a URL.
export default function ImageField({ label = 'Image', value, onChange, error, required }) {
  const dialogRef = useRef(null);
  const [open, setOpen] = useState(false);

  const show = () => {
    setOpen(true);
    dialogRef.current?.showModal();
  };
  const close = () => {
    dialogRef.current?.close();
    setOpen(false);
  };

  return (
    <Field label={label} error={error} required={required} hint="Upload an image or choose one from the library. Recommended: landscape, at least 1600px wide.">
      {(a11y) => (
        <div>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={show}
              className="relative aspect-[16/10] w-full max-w-md overflow-hidden rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-sm text-muted hover:border-brand"
            >
              {isPreviewableImage(value) ? (
                <Image src={value} alt="" fill sizes="(min-width: 1024px) 360px, 90vw" className="object-cover" />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center p-3 text-center">
                  {value ? `Can't preview this URL. Use an upload or ${IMAGE_HOSTS.join(', ')}` : '+ Choose image'}
                </span>
              )}
            </button>
            <div className="space-y-2">
              <input {...a11y} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder="/uploads/… or https://images.unsplash.com/…" className={inputClass} />
              <div className="flex gap-2">
                <button type="button" onClick={show} className={buttonClass('secondary')}>
                  Media library
                </button>
                {value && (
                  <button type="button" onClick={() => onChange('')} className={buttonClass('ghost')}>
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          <dialog
            ref={dialogRef}
            onClose={() => setOpen(false)}
            className="m-auto w-[min(56rem,calc(100vw-2rem))] rounded-xl p-0 shadow-2xl backdrop:bg-ink/60"
          >
            {open && (
              <MediaLibrary
                onSelect={(url) => {
                  onChange(url);
                  close();
                }}
                onClose={close}
              />
            )}
          </dialog>
        </div>
      )}
    </Field>
  );
}

function MediaLibrary({ onSelect, onClose }) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [q, setQ] = useState('');
  const [error, setError] = useState(null);
  const [loading, startLoading] = useTransition();
  const [uploading, startUploading] = useTransition();

  const load = (page = 1, query = q) =>
    startLoading(async () => {
      const result = await listMedia({ page, q: query });
      if (!result.ok) return setError(result.error);
      setItems((prev) => (page === 1 ? result.data.data : [...prev, ...result.data.data]));
      setMeta(result.data.meta);
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps -- load once when the dialog opens
  useEffect(() => load(1), []);

  const upload = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setError(null);
    startUploading(async () => {
      const form = new FormData();
      form.append('file', file);
      const result = await uploadMedia(form);
      if (!result.ok) return setError(result.error);
      onSelect(result.data.url);
    });
  };

  return (
    <div className="flex max-h-[85vh] flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 p-4">
        <h2 className="mr-auto text-lg">Media library</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load(1, q);
          }}
        >
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" aria-label="Search images" className={`${inputClass} w-44`} />
        </form>
        <label className={buttonClass('primary', 'cursor-pointer')}>
          {uploading ? 'Uploading…' : '↑ Upload new'}
          <input type="file" accept="image/*" onChange={upload} disabled={uploading} className="sr-only" />
        </label>
        <button type="button" onClick={onClose} className={buttonClass('ghost')} aria-label="Close">
          ✕
        </button>
      </div>

      {error && <p className="px-4 pt-3 text-sm text-rose-600">{error}</p>}

      <div className="overflow-y-auto p-4">
        {items.length === 0 && !loading ? (
          <p className="py-12 text-center text-muted">No images yet. Upload your first one.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {items.map((m) => (
              <li key={m.id}>
                <button type="button" onClick={() => onSelect(m.url)} className="group block w-full text-left">
                  <span className="relative block aspect-[4/3] overflow-hidden rounded-lg bg-slate-100 ring-brand group-hover:ring-2 group-focus-visible:ring-2">
                    <Image src={m.url} alt={m.alt ?? ''} fill sizes="200px" className="object-cover" />
                  </span>
                  <span className="mt-1 block truncate text-xs text-muted">{m.originalName}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        {loading && <p className="py-4 text-center text-sm text-muted">Loading…</p>}
        {meta && meta.page < meta.pages && !loading && (
          <div className="mt-4 text-center">
            <button type="button" onClick={() => load(meta.page + 1)} className={buttonClass('secondary')}>
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
