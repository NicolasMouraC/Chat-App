import React, { useState, useEffect } from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth, rtdb } from "../firebase";
import { AuthContext } from "./AuthContext";
import { ref, set, onDisconnect } from "firebase/database";

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user: User | null) => {
      if (user) {
        setCurrentUser(user);

        const userStatusRef = ref(rtdb, `users/${user.uid}/status`);
        await set(userStatusRef, { online: true });
        onDisconnect(userStatusRef).set({ online: false });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleLogout = async () => {
    if (currentUser) {
      const userStatusRef = ref(rtdb, `users/${currentUser.uid}/status`);
      await set(userStatusRef, { online: false });
      await signOut(auth);
      setCurrentUser(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
