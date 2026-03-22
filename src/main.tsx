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
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((reg) => {
      // Force a check for a new version of the SW
      reg.update();

      reg.onupdatefound = () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.onstatechange = () => {
            // If a new version is installed, reload the page to show the new UI
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              window.location.reload();
            }
          };
        }
      };
    });
}