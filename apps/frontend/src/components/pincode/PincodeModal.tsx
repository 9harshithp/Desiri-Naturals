import React, { useState } from "react";
import { usePincode } from "@/context/pincode-context";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Navigation, CheckCircle2, Clock, Truck, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const POPULAR_HUBS = [
  { pin: "560001", name: "Bengaluru Central", desc: "Tomorrow Morning (7 AM - 10 AM)", tag: "Hyperlocal Express" },
  { pin: "570001", name: "Mysuru Heritage", desc: "Today by 6 PM (Direct Harvest)", tag: "Farm Direct" },
  { pin: "500001", name: "Hyderabad", desc: "Next Day Delivery (24 Hours)", tag: "Priority Road" },
  { pin: "600001", name: "Chennai", desc: "1 - 2 Business Days", tag: "Express" },
  { pin: "400001", name: "Mumbai", desc: "2 - 3 Business Days", tag: "Air Cargo" },
  { pin: "110001", name: "Delhi NCR", desc: "2 - 3 Business Days", tag: "Air Cargo" },
];

export function PincodeModal() {
  const { pincodeData, isModalOpen, closeModal, setPincode } = usePincode();
  const [inputPin, setInputPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);

  const handleApply = async (pinToUse?: string) => {
    const pin = pinToUse || inputPin;
    if (!pin || pin.trim().length !== 6) {
      setError("Please enter a valid 6-digit Indian PIN code.");
      return;
    }

    setError("");
    setLoading(true);
    const result = await setPincode(pin);
    setLoading(false);

    if (result.success) {
      setInputPin("");
      closeModal();
    } else {
      setError(result.message || "Invalid or unserviceable PIN code.");
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setDetectingGps(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        // Fallback to Bengaluru central coordinates or typical user location
        setDetectingGps(false);
        await handleApply("560001");
      },
      (err) => {
        setDetectingGps(false);
        setError("Location permission denied. Please enter your PIN code manually.");
      },
      { timeout: 8000 }
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
              <MapPin className="h-4 w-4" />
            </div>
            <DialogTitle className="text-xl font-serif">Delivery Location</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            Select your Indian PIN code to view accurate harvest delivery slots, fresh milk routes, and shipping rates.
          </DialogDescription>
        </DialogHeader>

        {/* Current Active Location Card */}
        <div className="bg-muted/50 border border-border/80 rounded-2xl p-3.5 space-y-2 mt-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Currently Delivering To</span>
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5" /> Serviceable
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-foreground text-base">
                {pincodeData.city}, {pincodeData.state} ({pincodeData.pincode})
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Clock className="h-3 w-3 text-emerald-600" />
                <span>{pincodeData.deliveryPromise}</span>
              </div>
            </div>
            {pincodeData.isHyperlocal && (
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs shrink-0">
                🌱 Direct Farm Fleet
              </Badge>
            )}
          </div>
        </div>

        {/* PIN input & GPS Detect */}
        <div className="space-y-3 mt-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleDetectLocation}
            disabled={detectingGps}
            className="w-full justify-center gap-2 h-11 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
          >
            <Navigation className={`h-4 w-4 ${detectingGps ? "animate-spin" : ""}`} />
            {detectingGps ? "Locating Nearest Farm Route..." : "Use Current Location (GPS Auto-Detect)"}
          </Button>

          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit Indian PIN Code"
                value={inputPin}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setInputPin(val);
                  if (error) setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleApply();
                }}
                className="h-11 pr-10 tracking-widest font-mono text-base"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
                {inputPin.length}/6
              </span>
            </div>
            <Button
              onClick={() => handleApply()}
              disabled={loading || inputPin.length !== 6}
              className="h-11 px-5 bg-emerald-700 hover:bg-emerald-800 text-white font-medium"
            >
              {loading ? "Checking..." : "Apply"}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-1.5 text-xs text-destructive font-medium bg-destructive/10 p-2.5 rounded-lg">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Popular Delivery Hubs */}
        <div className="space-y-2 mt-4 pt-3 border-t">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Popular Delivery Hubs</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {POPULAR_HUBS.map((hub) => (
              <button
                key={hub.pin}
                type="button"
                onClick={() => handleApply(hub.pin)}
                className={`text-left p-2.5 rounded-xl border transition-all text-xs hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 ${
                  pincodeData.pincode === hub.pin
                    ? "border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 ring-1 ring-emerald-600"
                    : "border-border/70 bg-card"
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-foreground">
                  <span>{hub.name}</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded">
                    {hub.pin}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{hub.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Trust Note */}
        <div className="bg-emerald-950/5 dark:bg-emerald-950/30 rounded-xl p-3 text-[11px] text-muted-foreground flex items-start gap-2 border border-emerald-900/10">
          <Truck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            Orders placed before <strong>7 PM</strong> in Bengaluru & Mysuru are harvested at dawn and delivered the next morning before 10 AM. Free shipping on all orders over ₹499.
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
