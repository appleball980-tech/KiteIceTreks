'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Booking / enquiry form. Sends to the Express backend at POST /inquiries.
export default function InquiryForm({ trips, contact, defaultTrip = '', defaultType = 'booking' }) {
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus({ state: 'sending', message: '' });

    try {
      if (!API_URL) throw new Error('Backend not connected yet');
      const res = await fetch(`${API_URL}/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Request failed');
      form.reset();
      setStatus({ state: 'success', message: 'Thank you! Our team will contact you shortly.' });
    } catch {
      setStatus({
        state: 'error',
        message: `Sorry, we couldn't send your message right now. Please email ${contact.email} or WhatsApp ${contact.phone}.`,
      });
    }
  }

  const field = 'w-full rounded-xl border border-slate-300 px-4 py-3 text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20';
  const label = 'mb-1.5 block text-sm font-medium text-ink';

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
      {/* Honeypot: hidden from people, bots fill it in and the API discards the submission */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <label htmlFor="type" className={label}>I want to</label>
        <select id="type" name="type" defaultValue={defaultType} className={field}>
          <option value="booking">Book a trip</option>
          <option value="inquiry">Ask a question</option>
          <option value="custom">Plan a custom trip</option>
        </select>
      </div>
      <div>
        <label htmlFor="trip" className={label}>Trip</label>
        <select id="trip" name="trip" defaultValue={defaultTrip} className={field}>
          <option value="">Not sure yet</option>
          {trips.map((t) => (
            <option key={t.slug} value={t.slug}>{t.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="fullName" className={label}>Full name *</label>
        <input id="fullName" name="fullName" required autoComplete="name" className={field} />
      </div>
      <div>
        <label htmlFor="email" className={label}>Email *</label>
        <input id="email" name="email" type="email" required autoComplete="email" className={field} />
      </div>
      <div>
        <label htmlFor="phone" className={label}>Phone / WhatsApp</label>
        <input id="phone" name="phone" type="tel" autoComplete="tel" className={field} />
      </div>
      <div>
        <label htmlFor="country" className={label}>Country</label>
        <input id="country" name="country" autoComplete="country-name" className={field} />
      </div>
      <div>
        <label htmlFor="travelDate" className={label}>Preferred start date</label>
        <input id="travelDate" name="travelDate" type="date" className={field} />
      </div>
      <div>
        <label htmlFor="travellers" className={label}>Number of travellers</label>
        <input id="travellers" name="travellers" type="number" min="1" defaultValue="2" className={field} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="message" className={label}>Message</label>
        <textarea id="message" name="message" rows={5} className={field} placeholder="Tell us about your plans, fitness level or any special requests…" />
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status.state === 'sending'}
          className="w-full rounded-full bg-brand px-8 py-3.5 font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60 sm:w-auto"
        >
          {status.state === 'sending' ? 'Sending…' : 'Send Request'}
        </button>
        <p role="status" className={`mt-4 text-sm ${status.state === 'success' ? 'text-emerald-700' : 'text-rose-700'}`}>
          {status.message}
        </p>
      </div>
    </form>
  );
}
