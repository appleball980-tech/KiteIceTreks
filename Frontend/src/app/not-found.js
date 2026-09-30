import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import SiteShell from '@/components/layout/SiteShell';

export const metadata = {
  title: 'Page Not Found',
  robots: { index: false },
};

// Rendered for unknown URLs and notFound() calls. It sits above the (site) layout,
// so it adds the public header/footer itself.
export default function NotFound() {
  return (
    <SiteShell>
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <p className="text-7xl font-bold text-brand">404</p>
        <h1 className="mt-4 text-3xl">Lost on the trail?</h1>
        <p className="mt-3 max-w-md text-muted">The page you are looking for doesn’t exist or has moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/">Back to Home</Button>
          <Button href="/trips" variant="ghost">Browse Trips</Button>
        </div>
      </Container>
    </SiteShell>
  );
}
