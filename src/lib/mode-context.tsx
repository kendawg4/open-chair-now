import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";

type ActiveMode = "client" | "pro";

interface ModeContextType {
  mode: ActiveMode;
  setMode: (m: ActiveMode) => void;
}

const ModeContext = createContext<ModeContextType>({
  mode: "client",
  setMode: () => {},
});

const STORAGE_KEY = "openchair_active_mode";

export function ModeProvider({ children }: { children: ReactNode }) {
  const { isPro, isClient, loading } = useAuth();

  const [mode, setModeState] = useState<ActiveMode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "pro" || stored === "client") return stored;
    return "client";
  });

  const { user } = useAuth();

  // Validate stored mode against actual roles — only when authenticated and loaded
  useEffect(() => {
    if (loading || !user) return; // Don't touch mode on logout
    if (mode === "pro" && !isPro) {
      setModeState("client");
      localStorage.setItem(STORAGE_KEY, "client");
    }
    if (mode === "client" && !isClient && isPro) {
      setModeState("pro");
      localStorage.setItem(STORAGE_KEY, "pro");
    }
  }, [loading, isPro, isClient, user]);

  const setMode = (m: ActiveMode) => {
    setModeState(m);
    localStorage.setItem(STORAGE_KEY, m);
  };

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export const useMode = () => useContext(ModeContext);
