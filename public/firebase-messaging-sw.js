// 1. Import scripts from the Google Firebase CDN
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// 2. Initialize Firebase with your Saqo Hair Salon credentials
// These strings are required here because the Service Worker runs 
// outside the Vite build process.
firebase.initializeApp({
  apiKey: "AIzaSyC3wXoOV2_9r_kp39ZZJ1ozn5XvvLHFpvw",
  authDomain: "saqo-hair-salon.firebaseapp.com",
  projectId: "saqo-hair-salon",
  storageBucket: "saqo-hair-salon.firebasestorage.app",
  messagingSenderId: "9759257275",
  appId: "1:9759257275:web:1a31d3bd755ae35c016f9e",
  measurementId: "G-ZQDJ770R65"
});

const messaging = firebase.messaging();

// 3. Handle notifications when the PWA is closed or in the background
messaging.onBackgroundMessage((payload) => {
  console.log('[sw.js] Background message received:', payload);

  const notificationTitle = payload.notification.title || "Saqo Hair Salon";
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/android-chrome-192x192.png',
    badge: '/favicon.ico',
    tag: 'appointment-reminder',
    data: {
      url: '/' // Opens the salon app when the notification is clicked
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 4. Handle notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a window is already open, focus it; otherwise open a new one
      if (clientList.length > 0) return clientList[0].focus();
      return clients.openWindow('/');
    })
  );
});

// 5. Force the new Service Worker to take over immediately
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
  console.log('Saqo SW Activated and Claimed Clients');
});
