import './index.css';
// Multi Language Module
import '@/lib/i18n';

import { MotionConfig } from 'motion/react';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  RouterProvider
} from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";

import { router } from './app.router';
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider> {/* Wrap the RouterProvider */}
      <MotionConfig reducedMotion="user">
        <RouterProvider router={router} />
      </MotionConfig>
    </AuthProvider>
    <Toaster expand={true} richColors position="top-right" duration={8000} />
  </StrictMode>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then((registration) => {
        // Check for updates every time the app is opened
        registration.update();

        console.log('SW Registered');

        // Listen for the 'waiting' state to alert the user or auto-reload
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available; force a reload
                window.location.reload();
              }
            };
          }
        };
      })
      .catch((err) => console.error('SW Error', err));
  });
}