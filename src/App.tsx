import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "./firebase";

import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line
} from "recharts";

function App() {
  const [data, setData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const dataRef = ref(db, "sensor");

    onValue(dataRef, (snapshot) => {
      const value = snapshot.val();
      setData(value);

      if (value) {
        setHistory((prev) => [
          ...prev.slice(-19),
          {
            time: new Date().toLocaleTimeString(),
            weight: value.weight || 0,
          },
        ]);
      }
    });
  }, []);

  // 📡 ONLINE CHECK
  const isOnline = () => {
    if (!data?.timestamp) return false;
    const currentTime = Date.now() / 1000;
    return currentTime - data.timestamp < 5;
  };

  // 📊 VALUES
  const total = data?.count_total || 0;
  const metal = data?.count_metal || 0;
  const exception = data?.count_exception || 0;
  const other = data?.count_other || 0;

  const efficiency =
    total > 0 ? ((metal + exception) / total) * 100 : 0;

  const co2Saved = metal * 4.5 + other * 1.5;

  const pieData = [
    { name: "Metal", value: metal },
    { name: "Exception", value: exception },
    { name: "Other", value: other },
  ];

  const barData = [
    { name: "Metal", count: metal },
    { name: "Exception", count: exception },
    { name: "Other", count: other },
  ];

  return (
    <div className="min-h-screen text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10 fade-in">
        <div>
          <h1 className="text-3xl font-semibold glow-text">
            Smart Waste System
          </h1>
          <p className="text-gray-400 text-sm">
            IoT Real-Time Dashboard
          </p>
        </div>

        <div className={`px-4 py-1 rounded-full text-sm
          ${isOnline() ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
          {isOnline() ? "🟢 LIVE" : "🔴 OFFLINE"}
        </div>
      </div>

      {/* HERO */}
      <div className="glass p-8 mb-8 fade-in">
        <p className="text-gray-400">Current Waste Type</p>

        <h2 className="text-5xl font-bold mt-2 text-green-400 glow-text">
          {data?.type || "--"}
        </h2>

        <p className="mt-4 text-gray-300">
          Weight: <span className="text-white text-xl">{data?.weight || 0} g</span>
        </p>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-3 gap-6 mb-8">

        <div className="glass p-6 fade-in">
          <p className="text-gray-400">Total</p>
          <h2 className="text-2xl font-bold">{total}</h2>
        </div>

        <div className="glass p-6 fade-in">
          <p className="text-gray-400">Efficiency</p>
          <h2 className="text-2xl font-bold text-green-400">
            {efficiency.toFixed(1)}%
          </h2>
        </div>

        <div className="glass p-6 fade-in">
          <p className="text-gray-400">CO₂ Saved</p>
          <h2 className="text-2xl font-bold text-green-400">
            {co2Saved.toFixed(1)}
          </h2>
        </div>

      </div>

      {/* GRAPH */}
      <div className="glass p-6 mb-8 fade-in">
        <h2 className="mb-4 text-lg">📈 Weight Trend</h2>

        <LineChart width={800} height={300} data={history}>
          <XAxis dataKey="time" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#22c55e"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </div>

      {/* SECONDARY */}
      <div className="grid grid-cols-2 gap-6">

        <div className="glass p-6 fade-in">
          <h3 className="mb-3">Distribution</h3>
          <PieChart width={250} height={250}>
            <Pie data={pieData} dataKey="value" outerRadius={80}>
              <Cell fill="#22c55e" />
              <Cell fill="#facc15" />
              <Cell fill="#ef4444" />
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div className="glass p-6 fade-in">
          <h3 className="mb-3">Live Info</h3>
          <p>Metal: {data?.metal_detected ? "Yes" : "No"}</p>
          <p>Conductive: {data?.conductive ? "Yes" : "No"}</p>
          <p className="mt-2 text-gray-400 text-sm">
            Last update:{" "}
            {data?.timestamp
              ? new Date(data.timestamp * 1000).toLocaleTimeString()
              : "--"}
          </p>
        </div>

      </div>

    </div>
  );
}

export default App;