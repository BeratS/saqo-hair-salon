import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); 
export const db = getFirestore(app);
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;

// --- FIXED MESSAGING LOGIC ---
export const getMessagingInstance = async () => {
  if (typeof window === "undefined") return null;

  const supported = await isSupported();
  if (!supported) {
    console.warn("FCM is not supported in this environment (e.g. Instagram/FB browser).");
    return null;
  }

  try {
    return getMessaging(app);
  } catch (err) {
    console.error("Failed to initialize messaging:", err);
    return null;
  }
};

export default app;