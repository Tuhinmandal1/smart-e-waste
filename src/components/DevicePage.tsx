import { useState } from "react";
import { Cog, Wifi, WifiOff, Cpu, HardDrive, Clock, RefreshCw, Save } from "lucide-react";
import ESPData from "@/components/ESPData";

const DevicePage = () => {
  const [ssid, setSsid] = useState("SmartEWaste_AP");
  const [password, setPassword] = useState("••••••••");
  const [serverUrl, setServerUrl] = useState("mqtt://192.168.1.100:1883");
  const [interval, setIntervalVal] = useState("2000");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1200);
  };

  return (
    <>
      <div className="animate-fade-up flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cog className="w-5 h-5 text-primary" />
          <div>
            <h1 className="text-lg font-bold leading-tight">Device</h1>
            <p className="text-xs text-muted-foreground">ESP32 configuration & status</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-border text-xs font-medium text-destructive">
          <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
          Offline
        </div>
      </div>
      <div className="space-y-4">
      <h1 className="text-lg font-bold">Device Monitor</h1>

      <div className="rounded-xl bg-card border border-border p-5">
        <h2 className="text-sm font-semibold mb-2">Live ESP Data</h2>
        <ESPData />
      </div>
      </div>

      {/* Device Info */}
      <div className="animate-fade-up rounded-xl bg-card border border-border p-6" style={{ animationDelay: "60ms" }}>
        <div className="flex items-center gap-2 mb-5">
          <span className="w-1 h-4 rounded-full bg-primary" />
          <h2 className="text-sm font-bold tracking-wider uppercase">Device Info</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow icon={<Cpu className="w-4 h-4 text-primary/60" />} label="Chip" value="ESP32-WROOM-32" />
          <InfoRow icon={<HardDrive className="w-4 h-4 text-muted-foreground/60" />} label="Firmware" value="v1.4.2" />
          <InfoRow icon={<Clock className="w-4 h-4 text-muted-foreground/60" />} label="Uptime" value="—" />
          <InfoRow icon={<Wifi className="w-4 h-4 text-muted-foreground/60" />} label="IP Address" value="—" />
        </div>
      </div>

      {/* WiFi Config */}
      <div className="animate-fade-up rounded-xl bg-card border border-border p-6" style={{ animationDelay: "120ms" }}>
        <div className="flex items-center gap-2 mb-5">
          <span className="w-1 h-4 rounded-full bg-primary" />
          <h2 className="text-sm font-bold tracking-wider uppercase">WiFi Configuration</h2>
        </div>
        <div className="space-y-4">
          <Field label="SSID" value={ssid} onChange={setSsid} placeholder="Network name" />
          <Field label="Password" value={password} onChange={setPassword} placeholder="Network password" type="password" />
        </div>
      </div>

      {/* Connection Settings */}
      <div className="animate-fade-up rounded-xl bg-card border border-border p-6" style={{ animationDelay: "180ms" }}>
        <div className="flex items-center gap-2 mb-5">
          <span className="w-1 h-4 rounded-full bg-primary" />
          <h2 className="text-sm font-bold tracking-wider uppercase">Connection Settings</h2>
        </div>
        <div className="space-y-4">
          <Field label="Server URL" value={serverUrl} onChange={setServerUrl} placeholder="mqtt://host:port" />
          <Field label="Polling Interval" value={interval} onChange={setIntervalVal} placeholder="ms" suffix="ms" />
        </div>
      </div>

      {/* Actions */}
      <div className="animate-fade-up flex gap-3" style={{ animationDelay: "240ms" }}>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 active:scale-[0.97] transition-all disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : "Save Config"}
        </button>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground active:scale-[0.97] transition-all">
          <RefreshCw className="w-4 h-4" />
          Restart Device
        </button>
      </div>

      {/* Capabilities */}
      <div className="animate-fade-up rounded-xl bg-card border border-border p-5 text-xs text-muted-foreground leading-relaxed" style={{ animationDelay: "300ms" }}>
        <p className="font-medium text-foreground mb-1">Sensor Capabilities</p>
        <p>Inductive proximity sensor for metal detection · Capacitive sensor for plastic identification · IR temperature sensor · Servo-controlled sorting mechanism · MQTT telemetry to cloud backend.</p>
      </div>
    </>
  );
};

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-3">
    {icon}
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium font-mono">{value}</p>
    </div>
  </div>
);

const Field = ({
  label, value, onChange, placeholder, type = "text", suffix,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string; suffix?: string;
}) => (
  <div>
    <label className="text-xs text-muted-foreground block mb-1.5">{label}</label>
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3 rounded-lg bg-secondary border border-border text-foreground text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow"
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{suffix}</span>
      )}
    </div>
  </div>
);

export default DevicePage;
