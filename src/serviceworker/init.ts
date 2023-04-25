export const initServiceWorker = () => {
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/sw.js');
  }
};
