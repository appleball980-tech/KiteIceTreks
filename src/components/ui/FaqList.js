import JsonLd from '@/components/seo/JsonLd';
import { faqJsonLd } from '@/lib/seo';

// FAQ accordion + FAQPage structured data (can show as rich results in Google)
export default function FaqList({ faqs }) {
  if (!faqs?.length) return null;
  return (
    <>
      <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
        {faqs.map((faq) => (
          <details key={faq.question} className="group p-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-ink">
              <h3 className="text-base">{faq.question}</h3>
              <span aria-hidden="true" className="text-xl leading-none text-brand transition-transform group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-muted">{faq.answer}</p>
          </details>
        ))}
      </div>
      <JsonLd data={faqJsonLd(faqs)} />
    </>
  );
}
