import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Eye, EyeOff, AlertCircle, Check } from "lucide-react";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ["", "Weak", "Good", "Strong"][passwordStrength];
  const strengthColor = ["", "text-destructive", "text-amber-500", "text-primary"][passwordStrength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password, phone || undefined);
      setLocation("/");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    "Track your orders in real time",
    "Save delivery addresses",
    "Access your order history",
    "Get early access to seasonal drops",
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a3a2a] flex-col items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, #4a7c59 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b6914 0%, transparent 50%)`
        }} />
        <div className="relative z-10 text-white max-w-md">
          <div className="flex items-center gap-3 mb-12">
            <Leaf className="h-10 w-10 text-[#8bc34a]" />
            <span className="font-serif text-4xl font-bold">Desiri Naturals</span>
          </div>
          <p className="text-2xl font-serif font-medium leading-relaxed text-white/90 mb-10">
            Join the farm-to-table movement.
          </p>
          <div className="space-y-4">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-[#8bc34a]/20 flex items-center justify-center shrink-0">
                  <Check className="h-3.5 w-3.5 text-[#8bc34a]" />
                </div>
                <span className="text-white/80">{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-serif text-2xl font-bold">Desiri Naturals</span>
          </div>

          <h1 className="font-serif text-3xl font-bold mb-2">Create your account</h1>
          <p className="text-muted-foreground mb-8">Free forever. No subscription required.</p>

          {error && (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 rounded-lg px-4 py-3 text-sm mb-6">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Priya Sharma" value={name} onChange={(e) => setName(e.target.value)} required className="h-11" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-11" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" type="tel" placeholder="+91 98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword((s) => !s)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          passwordStrength >= level
                            ? level === 1 ? "bg-destructive" : level === 2 ? "bg-amber-500" : "bg-primary"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${strengthColor}`}>{strengthLabel}</span>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full h-11 mt-2" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
