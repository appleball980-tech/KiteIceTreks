export default function SectionHeading({ eyebrow, title, description, align = 'center', as: Tag = 'h2' }) {
  const alignment = align === 'center' ? 'mx-auto text-center' : '';
  return (
    <div className={`mb-10 max-w-2xl ${alignment}`}>
      {eyebrow && <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand">{eyebrow}</p>}
      <Tag className="text-3xl md:text-4xl">{title}</Tag>
      {description && <p className="mt-3 text-muted">{description}</p>}
    </div>
  );
}
