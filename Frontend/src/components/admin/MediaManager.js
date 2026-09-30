'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { deleteResource, saveResource, uploadMedia } from '@/lib/admin/actions';
import { inputClass } from './form';
import { buttonClass } from './ui';

const formatSize = (bytes) => (bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`);

export default function MediaManager({ items }) {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [progress, setProgress] = useState(null); // "2 / 5"
  const [errors, setErrors] = useState([]);
  const [, startTransition] = useTransition();

  // Uploads one file at a time (keeps each request under the size limit)
  const upload = (event) => {
    const files = [...(event.target.files ?? [])];
    event.target.value = '';
    if (!files.length) return;
    setErrors([]);
    startTransition(async () => {
      const failed = [];
      for (const [i, file] of files.entries()) {
        setProgress(`${i + 1} / ${files.length}`);
        const form = new FormData();
        form.append('file', file);
        const result = await uploadMedia(form);
        if (!result.ok) failed.push(`${file.name}: ${result.error}`);
      }
      setProgress(null);
      setErrors(failed);
      router.refresh();
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div>
        <label className="mb-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center hover:border-brand">
          <span className="font-semibold text-ink">{progress ? `Uploading ${progress}…` : '↑ Upload images'}</span>
          <span className="mt-1 text-sm text-muted">JPEG, PNG, WebP, HEIC… up to 10 MB each. You can select several.</span>
          <input type="file" accept="image/*" multiple onChange={upload} disabled={Boolean(progress)} className="sr-only" />
        </label>
        {errors.length > 0 && (
          <ul className="mb-4 space-y-1 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
            {errors.map((e) => <li key={e}>{e}</li>)}
          </ul>
        )}

        {items.length === 0 ? (
          <p className="rounded-xl bg-white py-12 text-center text-muted">No images yet.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {items.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setSelected(m)}
                  aria-pressed={selected?.id === m.id}
                  className="group block w-full rounded-lg bg-white p-1.5 text-left shadow-sm ring-brand hover:ring-2 aria-pressed:ring-2"
                >
                  <span className="relative block aspect-[4/3] overflow-hidden rounded-md bg-slate-100">
                    <Image src={m.url} alt={m.alt ?? ''} fill sizes="(min-width: 1280px) 200px, 45vw" className="object-cover" />
                  </span>
                  <span className="mt-1 block truncate px-1 text-xs text-muted">{m.originalName}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <aside className="lg:sticky lg:top-6 lg:self-start">
        {selected ? (
          <MediaDetails key={selected.id} media={selected} onDeleted={() => setSelected(null)} />
        ) : (
          <p className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-muted">Select an image to see its details, edit the alt text or delete it.</p>
        )}
      </aside>
    </div>
  );
}

function MediaDetails({ media, onDeleted }) {
  const router = useRouter();
  const [alt, setAlt] = useState(media.alt ?? '');
  const [message, setMessage] = useState(null);
  const [usages, setUsages] = useState(null);
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  const saveAlt = () =>
    startTransition(async () => {
      const result = await saveResource('media', media.id, { alt });
      setMessage(result.ok ? { ok: true, text: 'Saved.' } : { ok: false, text: result.error });
    });

  const remove = (force) =>
    startTransition(async () => {
      const result = await deleteResource('media', media.id, { force });
      if (result.ok) {
        onDeleted();
        router.refresh();
      } else if (Array.isArray(result.details)) {
        setUsages(result.details); // still used by trips/posts: ask before forcing
      } else setMessage({ ok: false, text: result.error });
    });

  const copy = async () => {
    await navigator.clipboard.writeText(media.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-100">
        <Image src={media.url} alt={media.alt ?? ''} fill sizes="320px" className="object-contain" />
      </div>
      <dl className="grid grid-cols-[5rem_1fr] gap-y-1 text-sm">
        <dt className="text-muted">File</dt>
        <dd className="truncate">{media.originalName}</dd>
        <dt className="text-muted">Size</dt>
        <dd>{media.width} × {media.height} · {formatSize(media.size)}</dd>
      </dl>
      <div className="flex gap-2">
        <input readOnly value={media.url} aria-label="Image URL" className={`${inputClass} text-xs`} onFocus={(e) => e.target.select()} />
        <button type="button" onClick={copy} className={buttonClass('secondary')}>{copied ? 'Copied' : 'Copy'}</button>
      </div>
      <div>
        <label htmlFor="alt" className="mb-1 block text-sm font-medium">Alt text</label>
        <textarea id="alt" rows={2} value={alt} onChange={(e) => setAlt(e.target.value)} className={inputClass} placeholder="Describe the image for screen readers and Google" />
        <div className="mt-2 flex items-center gap-3">
          <button type="button" onClick={saveAlt} disabled={pending} className={buttonClass('primary')}>Save</button>
          {message && <span className={`text-sm ${message.ok ? 'text-emerald-700' : 'text-rose-600'}`}>{message.text}</span>}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        {usages ? (
          <div className="space-y-2 rounded-lg bg-orange-50 p-3 text-sm text-orange-900">
            <p className="font-medium">This image is still used by:</p>
            <ul className="list-inside list-disc">
              {usages.map((u) => <li key={`${u.type}-${u.id}`}>{u.type}: {u.name}</li>)}
            </ul>
            <p>Deleting it will leave those pages without an image.</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => remove(true)} disabled={pending} className={buttonClass('danger')}>Delete anyway</button>
              <button type="button" onClick={() => setUsages(null)} className={buttonClass('secondary')}>Cancel</button>
            </div>
          </div>
        ) : confirming ? (
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span>Delete this image permanently?</span>
            <button type="button" onClick={() => remove(false)} disabled={pending} className={buttonClass('danger')}>{pending ? 'Deleting…' : 'Delete'}</button>
            <button type="button" onClick={() => setConfirming(false)} className={buttonClass('secondary')}>Cancel</button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirming(true)} className={buttonClass('ghost', 'text-rose-600')}>
            Delete image
          </button>
        )}
      </div>
    </div>
  );
}
