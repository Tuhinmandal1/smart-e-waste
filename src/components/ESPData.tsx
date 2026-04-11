import { useEffect, useState } from "react";

const ESPData = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://smart-e-waste-system-default-rtdb.asia-southeast1.firebasedatabase.app/sensor.json"
        );
        const json = await res.json();
        console.log("DATA:", json);
        setData(json);
      } catch (err) {
        console.log("ERROR:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); // refresh every 2 sec

    return () => clearInterval(interval);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>ESP32 Data</h2>
      <p>Type: {data.type}</p>
      <p>Weight: {data.weight}</p>
      <p>Conductivity: {data.conductivity}</p>
      <p>Metal: {data.metal_detected ? "Yes" : "No"}</p>
    </div>
  );
};

export default ESPData;