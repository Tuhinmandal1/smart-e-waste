import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Recycle, Activity, Bot, BarChart3, ArrowRight, Loader2, UserPlus } from "lucide-react";

const LoginPage = () => {
  const { login, signup } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (isSignup && password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    const result = isSignup ? await signup(email, password) : await login(email, password);

    if (result.error) {
      setError(result.error);
    } else if (isSignup) {
      setSuccess("Check your email to confirm your account");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-20 blur-[120px] bg-primary pointer-events-none" />

      {/* Logo & Title */}
      <div className="animate-fade-up flex flex-col items-center mb-8" style={{ animationDelay: "0ms" }}>
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-6 glow-border">
          <Recycle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Smart E-Waste</h1>
        <p className="text-primary font-medium mt-1">Sorting System</p>
        <p className="text-muted-foreground text-sm mt-2">Industrial IoT monitoring dashboard</p>
      </div>

      {/* Login Card */}
      <div
        className="animate-fade-up w-full max-w-sm rounded-2xl bg-card border border-border p-8 glow-border"
        style={{ animationDelay: "120ms" }}
      >
        <h2 className="text-lg font-semibold mb-1">
          {isSignup ? "Create Account" : "Secure Access"}
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          {isSignup ? "Sign up to get started" : "Login to access real-time sorting data"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground block mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
              placeholder="operator@ewaste.io"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground block mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}
          {success && <p className="text-success text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSignup ? (
              <>
                Create Account
                <UserPlus className="w-4 h-4" />
              </>
            ) : (
              <>
                Login to Dashboard
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <button
          onClick={() => { setIsSignup(!isSignup); setError(""); setSuccess(""); }}
          className="w-full text-center text-sm text-muted-foreground mt-4 hover:text-foreground transition-colors"
        >
          {isSignup ? "Already have an account? Login" : "Don't have an account? Sign up"}
        </button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          ESP32 Integration · Secure Access
        </p>
      </div>

      {/* Feature pills */}
      <div
        className="animate-fade-up flex gap-3 mt-8"
        style={{ animationDelay: "240ms" }}
      >
        {[
          { icon: Activity, label: "Real-Time Data" },
          { icon: Bot, label: "Auto-Sorting" },
          { icon: BarChart3, label: "Analytics" },
        ].map((f) => (
          <div
            key={f.label}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-sm text-muted-foreground"
          >
            <f.icon className="w-3.5 h-3.5 text-primary" />
            {f.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoginPage;
