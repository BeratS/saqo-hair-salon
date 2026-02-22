import { type Auth as IAuth,onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";

import { auth } from "../lib/firebase";

type IUser = IAuth['currentUser'];

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
}


const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This listener detects if a user is logged in or out
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
