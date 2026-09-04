"use client";

import React, { createContext, useContext, useState } from "react";

type AuthModalMode = "login" | "register";

interface AuthModalContextType {
  isOpen: boolean;
  mode: AuthModalMode;
  openLogin: () => void;
  openRegister: () => void;
  closeModal: () => void;
  setMode: (mode: AuthModalMode) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthModalMode>("login");

  const openLogin = () => {
    setMode("login");
    setIsOpen(true);
  };

  const openRegister = () => {
    setMode("register");
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        mode,
        openLogin,
        openRegister,
        closeModal,
        setMode,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within an AuthModalProvider");
  }
  return context;
}
