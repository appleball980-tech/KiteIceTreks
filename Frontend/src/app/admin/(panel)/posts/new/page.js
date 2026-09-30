import { PageHeader } from '@/components/admin/ui';
import PostForm from '@/components/admin/PostForm';

export const metadata = { title: 'New post' };

export default function NewPostPage() {
  return (
    <>
      <PageHeader title="New post" back={{ href: '/admin/posts', label: 'Blog posts' }} />
      <PostForm />
    </>
  );
}
