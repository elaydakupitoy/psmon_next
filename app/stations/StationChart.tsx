"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function StationsChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/station")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  if (!data.length) return <p>Loading chart...</p>;

  const chartData = {
    labels: data.map((item: any) => item.StationName),
    datasets: [
      {
        label: "Total Vehicles",
        data: data.map((item: any) => item.Total),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div style={{ width: "100%", height: "100%" }}> {/* Full width and height */}
      <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
    </div>
  );
}
