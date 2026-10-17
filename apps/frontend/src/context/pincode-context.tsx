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

    try {
      const response = await fetch(`/api/pincode/check/${cleanPin}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          message: errorData.error || "PIN code is currently unserviceable for fresh farm produce.",
        };
      }

      const data: PincodeDetails = await response.json();
      setPincodeData(data);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      }
      return { success: true };
    } catch (err: any) {
      console.error("Error checking pincode:", err);
      return { success: false, message: "Network error checking PIN code serviceability." };
    }
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
