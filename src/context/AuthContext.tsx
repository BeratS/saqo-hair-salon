import { type Auth as IAuth,onAuthStateChanged, signOut } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

import { auth } from "../lib/firebase";

type IUser = IAuth['currentUser'];

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  onLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  onLogout: () => new Promise((resolve) => resolve()) 
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Implement the logout function
  const onLogout = async () => {
    try {
      await signOut(auth);
      // Optional: You can force a redirect here if needed, 
      // but usually your protected routes will handle this.
    } catch (error) {
      console.error("Error logging out of Saqo Salon:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, onLogout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
