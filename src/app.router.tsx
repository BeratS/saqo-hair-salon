import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate
} from "react-router-dom";

const BarbersPage = lazy(() => import('./pages/admin/barbers-page'));
const AppointmentPage = lazy(() => import('./pages/admin/appointment-page'));
const AdminMainPage = lazy(() => import('./pages/admin/main-page'));
const SettingsPage = lazy(() => import('./pages/admin/settings-page'));
const CancelBookingPage = lazy(() => import('./pages/admin/cancel-booking-page'));
const MenuPage = lazy(() => import('./pages/admin/menu-page'));
const AuthPage = lazy(() => import('./pages/auth-page'));

import App from "./App";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import HomePage from "./pages/home-page";

export const router = createBrowserRouter([
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
            index: true,
            element: <Navigate to="appointments" replace />
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
            path: 'cancel-booking',
            element: (
              <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
                <ProtectedRoute>
                  <CancelBookingPage />
                </ProtectedRoute>
              </Suspense>
            )
          },
          {
            path: 'menu',
            element: (
              <ProtectedRoute>
                <MenuPage />
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
            path: 'settings',
            element: (
              <ProtectedRoute>
                <SettingsPage />
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
