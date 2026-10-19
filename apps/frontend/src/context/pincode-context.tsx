import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface PincodeDetails {
  pincode: string;
  city: string;
  district: string;
  state: string;
  isServiceable: boolean;
  isHyperlocal: boolean;
  deliveryPromise: string;
  estimatedDays: number;
  supportsCod: boolean;
  shippingFee: number;
  minOrderForFreeShipping: number;
  farmHub: string;
}

interface PincodeContextType {
  pincodeData: PincodeDetails;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  setPincode: (pin: string) => Promise<{ success: boolean; message?: string }>;
}

const DEFAULT_PINCODE: PincodeDetails = {
  pincode: "560001",
  city: "Bengaluru",
  district: "Bengaluru Urban",
  state: "Karnataka",
  isServiceable: true,
  isHyperlocal: true,
  deliveryPromise: "Tomorrow, Morning Slot (7 AM - 10 AM)",
  estimatedDays: 1,
  supportsCod: true,
  shippingFee: 0,
  minOrderForFreeShipping: 499,
  farmHub: "Desiri Heritage Groves (Direct Electric Van Fleet)",
};

const PincodeContext = createContext<PincodeContextType | undefined>(undefined);

const STORAGE_KEY = "desiri_pincode_details";

export function PincodeProvider({ children }: { children: ReactNode }) {
  const [pincodeData, setPincodeData] = useState<PincodeDetails>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (err) {
        console.error("Failed to parse saved pincode:", err);
      }
    }
    return DEFAULT_PINCODE;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const setPincode = async (pin: string): Promise<{ success: boolean; message?: string }> => {
    const cleanPin = pin.trim();
    if (!/^[1-9][0-9]{5}$/.test(cleanPin)) {
      return { success: false, message: "Please enter a valid 6-digit Indian PIN code." };
    }

    const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");

    try {
      const response = await fetch(`${API_BASE}/api/pincode/check/${cleanPin}`);
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data: PincodeDetails = await response.json();
          setPincodeData(data);
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          }
          return { success: true };
        }
      }
    } catch {
      // Backend unavailable, fallback to standard serviceability
    }

    // Offline / Demo serviceability fallback
    const isKarnataka = cleanPin.startsWith("56") || cleanPin.startsWith("57") || cleanPin.startsWith("58");
    const isBangalore = cleanPin.startsWith("560");
    const offlineDetails: PincodeDetails = {
      pincode: cleanPin,
      city: isBangalore ? "Bengaluru" : isKarnataka ? "Karnataka Statewide" : "India Express",
      district: isBangalore ? "Bengaluru Urban" : isKarnataka ? "Mysuru / Mandya" : "National",
      state: isKarnataka ? "Karnataka" : "India",
      isServiceable: true,
      isHyperlocal: isBangalore,
      deliveryPromise: isBangalore ? "Tomorrow, Morning Slot (7 AM - 10 AM)" : "2-3 Days Standard Farm Delivery",
      estimatedDays: isBangalore ? 1 : 2,
      supportsCod: true,
      shippingFee: 0,
      minOrderForFreeShipping: 499,
      farmHub: isBangalore ? "Desiri Heritage Groves (Direct Electric Van Fleet)" : "Desiri Western Ghats Regional Hub",
    };
    setPincodeData(offlineDetails);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(offlineDetails));
    }
    return { success: true };
  };

  return (
    <PincodeContext.Provider
      value={{
        pincodeData,
        isModalOpen,
        openModal,
        closeModal,
        setPincode,
      }}
    >
      {children}
    </PincodeContext.Provider>
  );
}

export function usePincode() {
  const context = useContext(PincodeContext);
  if (!context) {
    throw new Error("usePincode must be used within a PincodeProvider");
  }
  return context;
}
