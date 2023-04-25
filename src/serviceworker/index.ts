import { precacheAndRoute, PrecacheEntry } from 'workbox-precaching';

precacheAndRoute(
  // eslint-disable-next-line no-underscore-dangle
  (
    self as Window &
      typeof globalThis & { __WB_MANIFEST: (string | PrecacheEntry)[] }
  ).__WB_MANIFEST,
);
