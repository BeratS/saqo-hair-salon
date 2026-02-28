import './index.css';
// Multi Language Module
import '@/lib/i18n';

import { MotionConfig } from 'motion/react';
import { lazy, StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import { Toaster } from "@/components/ui/sonner";

import App from "./App";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

const DashboardPage = lazy(() => import('./pages/admin/dashboard-page'));
const BarbersPage = lazy(() => import('./pages/admin/barbers-page'));
const AppointmentPage = lazy(() => import('./pages/admin/appointment-page'));
const AdminMainPage = lazy(() => import('./pages/admin/main-page'));
const SchedulerManagerPage = lazy(() => import('./pages/admin/scheduler-manager-page'));
const AuthPage = lazy(() => import('./pages/auth-page'));

import HomePage from "./pages/home-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <HomePage />
        )
      },
      {
        path: 'manage',
        element: (
          <ProtectedRoute>
            <AdminMainPage /> {/* Only logged in users see this */}
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'dashboard',
            element: (
              <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              </Suspense>
            )
          },
          {
            path: 'appointments',
            element: (
              <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
                <ProtectedRoute>
                  <AppointmentPage />
                </ProtectedRoute>
              </Suspense>
            )
          },
          {
            path: 'schedule',
            element: (
              <ProtectedRoute>
                <SchedulerManagerPage />
              </ProtectedRoute>
            )
          },
          {
            path: 'barbers',
            element: (
              <ProtectedRoute>
                <BarbersPage />
              </ProtectedRoute>
            )
          },
          {
            path: '*',
            element: <Navigate to="/manage/appointments" replace />
          }
        ]
      },
      { path: "auth", element: <AuthPage /> },
    ],
  },
]);

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
