import { adminFetch } from './api';

// Id + title of every trip, for "link to a trip" select boxes
export async function getTripOptions() {
  return (await adminFetch('/admin/trips', { query: { limit: 100 } })).data.map(({ id, title }) => ({ id, title }));
}
