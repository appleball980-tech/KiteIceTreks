export const metadata = {
  title: { default: 'Admin', template: '%s · Kiteice Admin' },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }) {
  return <div className="min-h-screen bg-slate-50 text-ink">{children}</div>;
}
