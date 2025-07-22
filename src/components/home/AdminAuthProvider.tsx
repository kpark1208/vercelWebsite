"use client";
import React, { useEffect, useState } from "react";
import AdminLoginModal from "./AdminLoginModal";
import { supabase } from "@/lib/supabaseClient";

export const AdminAuthContext = React.createContext<{ isAdmin: boolean, refresh: () => void }>({ isAdmin: false, refresh: () => {} });

export default function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Listen for secret shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "u") {
        setShowLogin(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Check session on mount and after login
  const refresh = async () => {
    const { data } = await supabase.auth.getSession();
    setIsAdmin(!!data.session);
  };
  useEffect(() => { refresh(); }, []);

  return (
    <AdminAuthContext.Provider value={{ isAdmin, refresh }}>
      {children}
      {showLogin && <AdminLoginModal onClose={() => setShowLogin(false)} onLogin={refresh} />}
      {isAdmin && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-3 shadow-lg">
            <span className="text-sm">Admin Mode</span>
            <button
              onClick={async () => { await supabase.auth.signOut(); refresh(); }}
              className="ml-2 px-2 py-1 text-xs bg-white text-black rounded hover:bg-gray-200 transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </AdminAuthContext.Provider>
  );
} 