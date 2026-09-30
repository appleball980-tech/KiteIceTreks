export default function CreatedNotice({ children }) {
  return <p role="status" className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">✓ {children} It’s live on the website if published.</p>;
}
