// Data access layer. Every page gets its data through these functions.
// Right now they read local sample data from /src/data. When the Express + MySQL
// backend is ready, only this file needs to change, e.g.:
//
//   const res = await fetch(`${process.env.API_URL}/trips`, { next: { revalidate: 3600 } });
//   return res.json();

import { trips } from '@/data/trips';
import { destinations } from '@/data/destinations';
import { regions } from '@/data/regions';
import { activities } from '@/data/activities';
import { posts } from '@/data/posts';
import { testimonials } from '@/data/testimonials';

const bySlug = (list, slug) => list.find((item) => item.slug === slug) ?? null;

// Adds readable names (e.g. "Everest Region") next to the slugs on each trip
function withNames(trip) {
  return {
    ...trip,
    destinationName: bySlug(destinations, trip.destination)?.name,
    regionName: trip.region ? bySlug(regions, trip.region)?.name : null,
    activityName: bySlug(activities, trip.activity)?.name,
  };
}

/* ---------- Trips ---------- */

export async function getTrips({ destination, region, activity, difficulty, q } = {}) {
  const query = q?.trim().toLowerCase();
  return trips
    .filter((t) => !destination || t.destination === destination)
    .filter((t) => !region || t.region === region)
    .filter((t) => !activity || t.activity === activity)
    .filter((t) => !difficulty || t.difficulty === difficulty)
    .filter((t) => !query || `${t.title} ${t.summary}`.toLowerCase().includes(query))
    .map(withNames);
}

export async function getFeaturedTrips(limit = 6) {
  return trips.filter((t) => t.featured).slice(0, limit).map(withNames);
}

export async function getTripBySlug(slug) {
  const trip = bySlug(trips, slug);
  return trip ? withNames(trip) : null;
}

export async function getRelatedTrips(trip, limit = 3) {
  return trips
    .filter((t) => t.slug !== trip.slug && (t.region === trip.region || t.activity === trip.activity))
    .slice(0, limit)
    .map(withNames);
}

/* ---------- Categories ---------- */

export async function getDestinations() {
  return destinations;
}
export async function getDestinationBySlug(slug) {
  return bySlug(destinations, slug);
}

export async function getRegions() {
  return regions;
}
export async function getRegionBySlug(slug) {
  return bySlug(regions, slug);
}

export async function getActivities() {
  return activities;
}
export async function getActivityBySlug(slug) {
  return bySlug(activities, slug);
}

/* ---------- Blog & reviews ---------- */

export async function getPosts(limit) {
  const sorted = [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return limit ? sorted.slice(0, limit) : sorted;
}
export async function getPostBySlug(slug) {
  return bySlug(posts, slug);
}

export async function getTestimonials() {
  return testimonials;
}
