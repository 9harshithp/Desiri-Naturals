import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Eye, EyeOff, AlertCircle } from "lucide-react";

type Role = "customer" | "admin";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [role, setRole] = useState<Role>("customer");
  const [email, setEmail] = useState("demo@farm2me.in");
  const [password, setPassword] = useState("demo123");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fillDemo = (r: Role) => {
    setRole(r);
    setError("");
    if (r === "admin") {
      setEmail("admin@farm2me.in");
      setPassword("admin123");
    } else {
      setEmail("demo@farm2me.in");
      setPassword("demo123");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const targetEmail = role === "admin" ? "admin@farm2me.in" : "demo@farm2me.in";
      const targetPass = role === "admin" ? "admin123" : "demo123";
      const user = await login(targetEmail, targetPass);
      if (user.role === "admin") {
        setLocation("/admin");
      } else {
        setLocation("/");
      }
    } catch (err: any) {
      setError(err.message || "Google sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === "admin") {
        setLocation("/admin");
      } else {
        setLocation("/");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1a3a2a] flex-col items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, #4a7c59 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b6914 0%, transparent 50%)`
        }} />
        <div className="relative z-10 text-white text-center max-w-md">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Leaf className="h-10 w-10 text-[#8bc34a]" />
            <span className="font-serif text-4xl font-bold">Desiri Naturals</span>
          </div>
          <p className="text-2xl font-serif font-medium leading-relaxed text-white/90 mb-8">
            Real food, grown by real people.
          </p>
          <p className="text-white/60 text-lg leading-relaxed">
            Join thousands of conscious consumers who trace every vegetable back to the farm it grew on.
          </p>

          <div className="mt-16 grid grid-cols-3 gap-6">
            {[["8+", "Partner Farms"], ["20k+", "Happy Families"], ["< 6h", "Farm to Door"]].map(([num, label]) => (
              <div key={label} className="bg-white/10 rounded-2xl p-4">
                <div className="text-2xl font-bold text-[#8bc34a]">{num}</div>
                <div className="text-white/60 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-serif text-2xl font-bold">Desiri Naturals</span>
          </div>

          <h1 className="font-serif text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">Sign in to your account to continue</p>

          {/* Role selector */}
          <div className="flex rounded-xl border bg-muted/50 p-1 mb-8">
            {(["customer", "admin"] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => fillDemo(r)}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  role === r
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "customer" ? "Customer" : "Admin"}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border rounded-xl py-3 text-sm font-medium hover:bg-muted/50 transition-colors mb-6 shadow-xs"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {loading ? "Signing in..." : "Continue with Google"}
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 rounded-lg px-4 py-3 text-sm mb-6">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
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
            </div>

            <div className="text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl px-3 py-2 flex items-center justify-between">
              <span>
                {role === "admin"
                  ? "Admin Demo Mode (admin@farm2me.in / admin123)"
                  : "Customer Demo Mode (demo@farm2me.in / demo123)"}
              </span>
              <span className="font-semibold text-[11px] text-emerald-700">Ready</span>
            </div>

            <Button type="submit" className="w-full h-11 mt-2" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
