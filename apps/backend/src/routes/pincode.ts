import { Router, type IRouter } from "express";

const router: IRouter = Router();

interface PincodeInfo {
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

export function lookupPincode(pincode: string): PincodeInfo | null {
  const pin = pincode.trim();
  if (!/^[1-9][0-9]{5}$/.test(pin)) {
    return null;
  }

  const prefix2 = pin.substring(0, 2);
  const prefix3 = pin.substring(0, 3);

  // Bengaluru Urban & Rural
  if (prefix3 === "560" || prefix3 === "561" || prefix3 === "562") {
    return {
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
  }

  // Mysuru / Mandya (Immediate farm vicinity)
  if (prefix3 === "570" || prefix3 === "571") {
    return {
      city: "Mysuru",
      district: "Mysuru Rural",
      state: "Karnataka",
      isServiceable: true,
      isHyperlocal: true,
      deliveryPromise: "Today by 6 PM (Farm-to-Door Express)",
      estimatedDays: 1,
      supportsCod: true,
      shippingFee: 0,
      minOrderForFreeShipping: 399,
      farmHub: "Desiri Mysore Mother Unit (Direct Farm Harvest)",
    };
  }

  // Rest of Karnataka (Hubli, Belgaum, Mangaluru, Shimoga, etc.)
  if (prefix2 === "57" || prefix2 === "58" || prefix2 === "59") {
    return {
      city: "Karnataka Regional",
      district: "Karnataka",
      state: "Karnataka",
      isServiceable: true,
      isHyperlocal: false,
      deliveryPromise: "Within 24 - 48 Hours",
      estimatedDays: 2,
      supportsCod: true,
      shippingFee: 40,
      minOrderForFreeShipping: 699,
      farmHub: "Desiri Karnataka Regional Express",
    };
  }

  // Telangana (Hyderabad / Secunderabad)
  if (prefix3.startsWith("50")) {
    return {
      city: "Hyderabad",
      district: "Hyderabad / Ranga Reddy",
      state: "Telangana",
      isServiceable: true,
      isHyperlocal: false,
      deliveryPromise: "Next Day Delivery (24 Hours)",
      estimatedDays: 1,
      supportsCod: true,
      shippingFee: 49,
      minOrderForFreeShipping: 799,
      farmHub: "Desiri South Regional Hub",
    };
  }

  // Andhra Pradesh (Guntur, Vijayawada, Visakhapatnam, etc.)
  if (prefix2 === "51" || prefix2 === "52" || prefix2 === "53") {
    return {
      city: "Andhra Pradesh",
      district: "Andhra Pradesh",
      state: "Andhra Pradesh",
      isServiceable: true,
      isHyperlocal: false,
      deliveryPromise: "1 - 2 Business Days",
      estimatedDays: 2,
      supportsCod: true,
      shippingFee: 49,
      minOrderForFreeShipping: 799,
      farmHub: "Krishna Valley Partner Farm Direct",
    };
  }

  // Tamil Nadu (Chennai, Coimbatore, Madurai, etc.)
  if (prefix2 === "60" || prefix2 === "61" || prefix2 === "62" || prefix2 === "63" || prefix2 === "64") {
    return {
      city: "Chennai & Tamil Nadu",
      district: "Tamil Nadu",
      state: "Tamil Nadu",
      isServiceable: true,
      isHyperlocal: false,
      deliveryPromise: "1 - 2 Business Days",
      estimatedDays: 2,
      supportsCod: true,
      shippingFee: 49,
      minOrderForFreeShipping: 799,
      farmHub: "Desiri South Coastal Express",
    };
  }

  // Kerala (Kochi, Kozhikode, Thiruvananthapuram)
  if (prefix2 === "67" || prefix2 === "68" || prefix2 === "69") {
    return {
      city: "Kerala",
      district: "Kerala",
      state: "Kerala",
      isServiceable: true,
      isHyperlocal: false,
      deliveryPromise: "2 Business Days",
      estimatedDays: 2,
      supportsCod: true,
      shippingFee: 49,
      minOrderForFreeShipping: 799,
      farmHub: "Desiri South Western Route",
    };
  }

  // Maharashtra (Mumbai, Pune, Satara, Nagpur, etc.)
  if (prefix2 === "40" || prefix2 === "41" || prefix2 === "42" || prefix2 === "43" || prefix2 === "44") {
    return {
      city: "Mumbai & Maharashtra",
      district: "Maharashtra",
      state: "Maharashtra",
      isServiceable: true,
      isHyperlocal: false,
      deliveryPromise: "2 - 3 Business Days (Express Air/Road)",
      estimatedDays: 3,
      supportsCod: true,
      shippingFee: 60,
      minOrderForFreeShipping: 999,
      farmHub: "Sahyadri Bio-Reserve Hub",
    };
  }

  // Delhi NCR
  if (prefix2 === "11" || prefix3 === "121" || prefix3 === "122" || prefix3 === "201") {
    return {
      city: "Delhi NCR",
      district: "Delhi NCR",
      state: "Delhi NCR",
      isServiceable: true,
      isHyperlocal: false,
      deliveryPromise: "2 - 3 Business Days (Priority Air Cargo)",
      estimatedDays: 3,
      supportsCod: true,
      shippingFee: 70,
      minOrderForFreeShipping: 999,
      farmHub: "Desiri North Direct Logistics",
    };
  }

  // General Pan-India Serviceable
  return {
    city: "India",
    district: "All India Serviceable",
    state: "India",
    isServiceable: true,
    isHyperlocal: false,
    deliveryPromise: "3 - 5 Business Days (Standard Surface)",
    estimatedDays: 4,
    supportsCod: true,
    shippingFee: 80,
    minOrderForFreeShipping: 1199,
    farmHub: "Central Desiri Dispatch Center",
  };
}

router.get("/pincode/check/:pincode", (req, res): void => {
  const { pincode } = req.params;
  const result = lookupPincode(pincode);

  if (!result) {
    res.status(400).json({
      error: "Invalid 6-digit Indian PIN code",
      isServiceable: false,
    });
    return;
  }

  res.json({
    pincode,
    ...result,
  });
});

export default router;
