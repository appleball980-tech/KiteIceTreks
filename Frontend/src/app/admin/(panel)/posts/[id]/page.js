import { getRecord } from '@/lib/admin/api';
import { PageHeader } from '@/components/admin/ui';
import CreatedNotice from '@/components/admin/CreatedNotice';
import PostForm from '@/components/admin/PostForm';

export const metadata = { title: 'Edit post' };

export default async function EditPostPage({ params, searchParams }) {
  const { id } = await params;
  const { created } = await searchParams;
  const post = await getRecord('posts', id);
  return (
    <>
      <PageHeader title={post.title} back={{ href: '/admin/posts', label: 'Blog posts' }} />
      {created && <CreatedNotice>Post created.</CreatedNotice>}
      <PostForm key={post.id} post={post} />
    </>
  );
}
