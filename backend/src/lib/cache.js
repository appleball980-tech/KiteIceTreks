// Small in-memory TTL cache with a size cap (oldest entries are evicted first).
// Content changes rarely, so caching whole GET responses removes almost all DB
// work for public traffic. If you run several API instances, swap this for Redis
// behind the same get/set/clear interface.
export class TtlCache {
  constructor({ ttlMs, maxEntries = 500 }) {
    this.ttlMs = ttlMs;
    this.maxEntries = maxEntries;
    this.store = new Map();
  }

  get(key) {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt < Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key, value) {
    if (this.ttlMs <= 0) return;
    if (this.store.has(key)) this.store.delete(key);
    else if (this.store.size >= this.maxEntries) this.store.delete(this.store.keys().next().value);
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }

  clear() {
    this.store.clear();
  }
}
