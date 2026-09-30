import { adminFetch } from './api';

// Destinations, regions and activities for the select boxes in trip forms
export async function getTripLookups() {
  const [destinations, regions, activities] = await Promise.all(
    ['destinations', 'regions', 'activities'].map((r) => adminFetch(`/admin/${r}`, { query: { limit: 100 } }).then((res) => res.data))
  );
  return { destinations, regions, activities };
}
