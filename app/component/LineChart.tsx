"use client";


import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  date: string;
}

export default function LineChart({ date }: LineChartProps) {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timer;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/timebucket?date=${encodeURIComponent(date)}`);
        const data = await res.json();

        const selectedDate = new Date(date);
        const today = new Date();
        const isToday = selectedDate.toDateString() === today.toDateString();

        const filteredData = isToday
          ? data.filter((row: any) => {
              const bucketTime = new Date(row.TimeBucketStart.replace(" ", "T"));
              return bucketTime <= today;
            })
          : data;

        const grouped: any = {};
        filteredData.forEach((row: any) => {
          const key = row.PS_ID;
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(row.AvgValue1 ?? 0);
        });

        const labels = [
          ...new Set(filteredData.map((r: any) => r.TimeBucketStart))
        ].map((t: any) => t.substring(11, 16));

        const datasets = Object.keys(grouped).map((key, index) => ({
          label: `PS ${key}`,
          data: grouped[key],
          borderColor: `hsl(${(index * 360) / Object.keys(grouped).length}, 70%, 50%)`,
          fill: false,
          tension: 0.2,
        }));

        setChartData({ labels, datasets });
      } catch (err) {
        console.error("Error fetching chart data:", err);
      }
    };

    // Initial fetch
    fetchData();
/* 
    // Set interval to refresh every 15 minutes (900,000 ms)
    intervalId = setInterval(fetchData, 15 * 60 * 1000); */


// Set interval to refresh every 15 seconds (15,000 ms)
intervalId = setInterval(fetchData, 15 * 1000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [date]); // refetch when date changes

  if (!chartData) return <div>Loading...</div>;

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* <h2 className="text-xl mb-4">24 Hour Data - {date}</h2> */}
      <Line data={chartData} />
    </div>
  );
}