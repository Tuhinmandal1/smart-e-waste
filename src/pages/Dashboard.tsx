import { useAuth } from "@/contexts/AuthContext";
import {
  Recycle, LogOut, Layers, Scale, Settings, Percent,
  LayoutGrid, BarChart3, Leaf, Cog
} from "lucide-react";
import { format } from "date-fns";

import DevicePage from "@/components/DevicePage";
import { useState } from "react";
import { useSensorData } from "@/hooks/useSensorData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";

const MATERIALS = [
  { name: "Metal", icon: "⚙️", color: "hsl(210, 70%, 55%)" },
  { name: "Plastic", icon: "🟢", color: "hsl(152, 80%, 50%)" },
];

const DIST_COLORS: Record<string, string> = {
  Metal: "hsl(210, 70%, 55%)",
  Plastic: "hsl(152, 80%, 50%)",
};

const navItems = [
  { label: "Home", icon: LayoutGrid, page: "home" as const },
  { label: "Charts", icon: BarChart3, page: "charts" as const },
  { label: "CO₂", icon: Leaf, page: "co2" as const },
  
  { label: "Device", icon: Cog, page: "device" as const },
];

type Page = "home" | "charts" | "co2" | "device";

const chartTooltipStyle = {
  contentStyle: {
    background: "hsl(220, 18%, 10%)",
    border: "1px solid hsl(220, 14%, 18%)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "hsl(180, 10%, 90%)",
  },
};

// ─── Home Page ───
const HomePage = () => {
  const { totalToday, totalWeight, materialCounts, efficiency, latest } = useSensorData();
  const today = format(new Date(), "EEE, MMM d");
  const isOnline = latest && (Date.now() - new Date(latest.created_at).getTime()) < 30000;

  return (
    <>
      <div className="animate-fade-up flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutGrid className="w-5 h-5 text-primary" />
          <div>
            <h1 className="text-lg font-bold leading-tight">Smart E-Waste</h1>
            <p className="text-xs text-muted-foreground">{today}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${
          isOnline ? "border-success/40 text-success" : "border-border text-destructive"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-success animate-pulse" : "bg-destructive"}`} />
          {isOnline ? "Online" : "Offline"}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard label="TOTAL TODAY" value={totalToday.toLocaleString()} sub="items sorted" icon={<Layers className="w-5 h-5 text-primary/60" />} delay={60} />
        <StatCard label="TOTAL WEIGHT" value={totalWeight.toFixed(2)} sub="kilograms" icon={<Scale className="w-5 h-5 text-muted-foreground/60" />} delay={120} />
        <StatCard label="DEVICE" value={isOnline ? "Online" : "Offline"} sub="ESP32 Sorter" icon={<Settings className="w-5 h-5 text-muted-foreground/60" />} delay={180} />
        <StatCard label="EFFICIENCY" value={`${efficiency.toFixed(1)}%`} sub="recycling rate" icon={<Percent className="w-5 h-5 text-muted-foreground/60" />} delay={240} />
      </div>

      <div className="animate-fade-up" style={{ animationDelay: "300ms" }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-primary text-sm">✦</span>
          <h2 className="text-sm font-bold tracking-wider uppercase">Material Breakdown</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MATERIALS.map((mat, i) => (
            <div key={mat.name} className="animate-fade-up rounded-xl bg-card border border-border p-5 hover:glow-sm transition-shadow" style={{ animationDelay: `${360 + i * 60}ms` }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: `${mat.color}20` }}>{mat.icon}</span>
                <span className="font-semibold text-sm">{mat.name}</span>
              </div>
              <p className="text-3xl font-bold font-mono tabular-nums">{materialCounts[mat.name] ?? 0}</p>
              <p className="text-xs text-muted-foreground mt-1">items sorted</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// ─── Charts Page ───
const ChartsPage = () => {
  const { materialCounts, totalToday } = useSensorData();

  const barData = MATERIALS.map((m) => ({ name: m.name, items: materialCounts[m.name] ?? 0 }));
  const distData = MATERIALS.map((m) => ({
    name: m.name,
    pct: totalToday > 0 ? ((materialCounts[m.name] ?? 0) / totalToday * 100) : 0,
    color: DIST_COLORS[m.name],
  }));

  return (
    <>
      <div className="animate-fade-up flex items-center gap-3">
        <BarChart3 className="w-5 h-5 text-primary" />
        <div>
          <h1 className="text-lg font-bold leading-tight">Analytics</h1>
          <p className="text-xs text-muted-foreground">Auto-refresh every 10s</p>
        </div>
      </div>

      <div className="animate-fade-up rounded-xl bg-card border border-border p-6" style={{ animationDelay: "60ms" }}>
        <div className="flex items-center gap-2 mb-5">
          <span className="w-1 h-4 rounded-full bg-primary" />
          <h2 className="text-sm font-bold tracking-wider uppercase">Items Per Material</h2>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(220, 10%, 50%)" }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip {...chartTooltipStyle} />
            <Bar dataKey="items" fill="hsl(174, 80%, 50%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="animate-fade-up rounded-xl bg-card border border-border p-6" style={{ animationDelay: "120ms" }}>
        <div className="flex items-center gap-2 mb-5">
          <span className="w-1 h-4 rounded-full bg-primary" />
          <h2 className="text-sm font-bold tracking-wider uppercase">Material Distribution</h2>
        </div>
        <div className="space-y-3">
          {distData.map((d) => (
            <div key={d.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-muted-foreground">{d.name}</span>
              </div>
              <span className="font-mono tabular-nums">{d.pct.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// ─── CO₂ Page ───
const co2PerKg: Record<string, number> = { Metal: 4.5, Plastic: 1.5 };
const treesEquiv = (kg: number) => (kg / 21.7).toFixed(1);

const Co2Page = () => {
  const { materialCounts } = useSensorData();

  const savings = MATERIALS.map((m) => {
    const count = materialCounts[m.name] ?? 0;
    const weightKg = count * 0.15;
    const co2Saved = weightKg * (co2PerKg[m.name] ?? 2);
    return { ...m, count, weightKg, co2Saved };
  });
  const totalCo2 = savings.reduce((s, m) => s + m.co2Saved, 0);
  const totalWeight = savings.reduce((s, m) => s + m.weightKg, 0);

  return (
    <>
      <div className="animate-fade-up flex items-center gap-3">
        <Leaf className="w-5 h-5 text-primary" />
        <div>
          <h1 className="text-lg font-bold leading-tight">CO₂ Savings</h1>
          <p className="text-xs text-muted-foreground">Environmental impact from recycling</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="animate-fade-up rounded-xl bg-card border border-border p-5" style={{ animationDelay: "60ms" }}>
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase mb-2">CO₂ Saved</p>
          <p className="text-3xl font-bold font-mono tabular-nums text-success">{totalCo2.toFixed(1)}<span className="text-sm ml-1 font-normal text-muted-foreground">kg</span></p>
        </div>
        <div className="animate-fade-up rounded-xl bg-card border border-border p-5" style={{ animationDelay: "120ms" }}>
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase mb-2">Equivalent Trees</p>
          <p className="text-3xl font-bold font-mono tabular-nums">{treesEquiv(totalCo2)}<span className="text-sm ml-1 font-normal text-muted-foreground">trees/yr</span></p>
        </div>
        <div className="animate-fade-up rounded-xl bg-card border border-border p-5" style={{ animationDelay: "180ms" }}>
          <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase mb-2">Material Diverted</p>
          <p className="text-3xl font-bold font-mono tabular-nums">{totalWeight.toFixed(2)}<span className="text-sm ml-1 font-normal text-muted-foreground">kg</span></p>
        </div>
      </div>

      <div className="animate-fade-up rounded-xl bg-card border border-border p-6" style={{ animationDelay: "240ms" }}>
        <div className="flex items-center gap-2 mb-5">
          <span className="w-1 h-4 rounded-full bg-success" />
          <h2 className="text-sm font-bold tracking-wider uppercase">Impact by Material</h2>
        </div>
        <div className="space-y-4">
          {savings.map((m) => {
            const maxCo2 = Math.max(...savings.map((s) => s.co2Saved), 1);
            const pct = (m.co2Saved / maxCo2) * 100;
            return (
              <div key={m.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{m.icon}</span>
                    <span>{m.name}</span>
                  </div>
                  <span className="font-mono tabular-nums text-muted-foreground">{m.co2Saved.toFixed(2)} kg CO₂</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-success transition-all" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">{m.count} items · {m.weightKg.toFixed(2)} kg · {(co2PerKg[m.name] ?? 2)} kg CO₂/kg</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="animate-fade-up rounded-xl bg-card border border-border p-5 text-xs text-muted-foreground leading-relaxed" style={{ animationDelay: "300ms" }}>
        <p className="font-medium text-foreground mb-1">How we calculate</p>
        <p>CO₂ savings are estimated using industry-standard emission factors per material type, compared against virgin material production. Each item is assumed to weigh ~150g on average. Tree equivalence uses the EPA figure of 21.7 kg CO₂ absorbed per tree per year.</p>
      </div>
    </>
  );
};

// ─── Stat Card ───
const StatCard = ({ label, value, sub, icon, delay }: { label: string; value: string; sub: string; icon: React.ReactNode; delay: number }) => (
  <div className="animate-fade-up rounded-xl bg-card border border-border p-5 hover:glow-sm transition-shadow" style={{ animationDelay: `${delay}ms` }}>
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{label}</span>
      {icon}
    </div>
    <p className="text-3xl font-bold font-mono tabular-nums">{value}</p>
    <p className="text-xs text-muted-foreground mt-1">{sub}</p>
  </div>
);

// ─── Main Dashboard ───
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [page, setPage] = useState<Page>("home");

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage />;
      case "charts": return <ChartsPage />;
      case "co2": return <Co2Page />;
      
      case "device": return <DevicePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex items-center justify-between h-12">
          <div className="flex items-center gap-2">
            <Recycle className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">{user?.email}</span>
          </div>
          <button onClick={logout} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground active:scale-95 transition-all">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="container py-6 space-y-6 pb-24">
        {renderPage()}
      </main>

      <nav className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col gap-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setPage(item.page)}
            className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all active:scale-95 ${
              page === item.page
                ? "bg-card border border-primary/40 text-foreground glow-sm"
                : "bg-card/80 border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{item.label}</span>
            <item.icon className="w-4 h-4" />
          </button>
        ))}
      </nav>

      <nav className="fixed bottom-0 left-0 right-0 z-40 sm:hidden border-t border-border bg-background/90 backdrop-blur-md">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setPage(item.page)}
              className={`flex flex-col items-center gap-0.5 text-xs active:scale-95 transition-transform ${
                page === item.page ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
