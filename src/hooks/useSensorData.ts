import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SensorReading = {
  id: string;
  device_id: string;
  temperature: number | null;
  humidity: number | null;
  proximity: number | null;
  material: string | null;
  confidence: number | null;
  weight_kg: number | null;
  created_at: string;
};

export const useSensorData = (limit = 50) => {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial fetch
  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("sensor_readings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (data) setReadings(data as SensorReading[]);
      setLoading(false);
    };
    fetch();
  }, [limit]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("sensor_readings_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "sensor_readings" },
        (payload) => {
          setReadings((prev) => [payload.new as SensorReading, ...prev].slice(0, limit));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [limit]);

  const latest = readings[0] ?? null;

  const todayReadings = readings.filter((r) => {
    const d = new Date(r.created_at);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  });

  const totalToday = todayReadings.length;
  const totalWeight = todayReadings.reduce((s, r) => s + (r.weight_kg ?? 0), 0);

  const materialCounts: Record<string, number> = {};
  todayReadings.forEach((r) => {
    if (r.material) materialCounts[r.material] = (materialCounts[r.material] || 0) + 1;
  });

  const efficiency = totalToday > 0
    ? (todayReadings.filter((r) => r.material).length / totalToday) * 100
    : 0;

  return { readings, latest, loading, totalToday, totalWeight, materialCounts, efficiency };
};
