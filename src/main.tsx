import './index.css';
// Multi Language Module
import '@/lib/i18n';

import { MotionConfig } from 'motion/react';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { Toaster } from "@/components/ui/sonner"

import App from "./App";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import AuthPage from "./pages/AuthPage";
import DashboardPage from './pages/DashboardPage';
import HomePage from "./pages/HomePage";

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
        path: 'my-orders',
        element: (
          <ProtectedRoute>
            <DashboardPage /> {/* Only logged in users see this */}
          </ProtectedRoute>
        )
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
