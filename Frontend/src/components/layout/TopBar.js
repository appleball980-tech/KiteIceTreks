import Container from '@/components/ui/Container';

export default function TopBar({ contact }) {
  const { phone, whatsapp, email, hours } = contact;
  return (
    <div className="hidden bg-ink text-sm text-white/85 md:block">
      <Container className="flex items-center justify-between py-2">
        <p>{hours}</p>
        <div className="flex items-center gap-6">
          <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-brand">📞 {phone}</a>
          <a href={`https://wa.me/${whatsapp.replace('+', '')}`} className="hover:text-brand" target="_blank" rel="noopener noreferrer">
            💬 WhatsApp
          </a>
          <a href={`mailto:${email}`} className="hover:text-brand">✉️ {email}</a>
        </div>
      </Container>
    </div>
  );
}
