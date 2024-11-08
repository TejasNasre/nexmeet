"use client";

import { useEffect } from 'react';

export default function ClientServiceWorker() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
             console.log('ServiceWorker registered successfully');
             // Check for updates
             registration.update();
            console.log('ServiceWorker registration successful:', registration);
          })
          .catch((err) => {
            console.log('ServiceWorker registration failed:', err);
          });
      });
    }
    // Add event listeners for online/offline status
    window.addEventListener('online', () => {
      console.log('App is online');
      // You can add logic here to refresh data or update UI
    });

    window.addEventListener('offline', () => {
      console.log('App is offline');
      // You can add logic here to show offline notification or update UI
    });
  }, []);

  return null;
}