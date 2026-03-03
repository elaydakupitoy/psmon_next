"use client";

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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);



// Generate time labels from 1:00 AM to 12:00 AM (midnight)
  const generateTimeLabels = () => {
    const labels: string[] = [];
    let hours = 1; // Start at 1 AM
    let minutes = 0;
    while (hours <= 12) {
      const formattedTime = `${hours}:${minutes === 0 ? "00" : "30"}`;
      labels.push(formattedTime);

      // Increase the time by 30 minutes
      minutes = minutes === 0 ? 30 : 0;
      if (minutes === 0) {
        hours++;
      }
    }
    return labels;
  };


  // Function to generate random data points
const generateRandomData = (numPoints: number, minValue: number, maxValue: number) => {
  return Array.from({ length: numPoints }, () => Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue);
};




const rawData = {
  "00:00": 10,
  "06:30": 25,
  "12:15": 40,
  "18:45": 60,
};

const dataPoints = Object.entries(rawData).map(([time, value]) => {
  const [h, m] = time.split(":").map(Number);
  return {
    x: value,
    y: h * 60 + m, // minutes
  };
});

const data = {
  datasets: [
    {
      label: "Broken Line",
      data: dataPoints,
      borderColor: "blue",
      tension: 0,
      parsing: false,
       spanGaps: false,    // 👈 HERE (dataset level)

    },
  ],
};
export default function LineChart3() {
  // Sample data for 4 line series
  const data = {
    labels: generateTimeLabels(), // X-axis labels
    datasets: [
      {
        label: "Series 1",
        data: dataPoints,
        borderColor: "rgba(255, 99, 132, 1)",  // Line color for Series 1
        backgroundColor: "rgba(255, 99, 132, 0.2)",  // Fill color (optional)
        fill: false,  // Don't fill the area under the line
        tension: 0.1,  // Smooth line curve
      },
      {
        label: "Series 2",
        data: generateRandomData(24, 40, 100),  
        borderColor: "rgba(53, 162, 235, 1)",  // Line color for Series 2
        backgroundColor: "rgba(53, 162, 235, 0.2)",  // Fill color (optional)
        fill: false,
        tension: 0.1,
      },
      {
        label: "Series 3",
         data: generateRandomData(24, 40, 100),  
        borderColor: "rgba(75, 192, 192, 1)",  // Line color for Series 3
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
        tension: 0.1,
      },
      {
        label: "Series 4",
        data: generateRandomData(24, 40, 100),  
        borderColor: "rgba(153, 102, 255, 1)",  // Line color for Series 4
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "left", // Set position of the legend (top, left, right, bottom)
        labels: {
          boxWidth: 12, // Make the legend box smaller
          padding: 15,  // Decrease the padding between the label and the box
          usePointStyle: true, // Make the legend symbols round and more like the points in the chart
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        position: "bottom",
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 0,
          padding: 10,
          align: "center",
        },
      },
     
  y: {
    min: 0,
    max: 1499,
    ticks: {
      callback: (value: number) => {
        const h = Math.floor(value / 60);
        const m = value % 60;
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      },
    },
  },

    },
  };

  return (
   <div style={{ width: "100%", height: "100%" }}> {/* Full width and height */}

      <h2 className="text-xl mb-4">Custom Line Chart</h2>
      <Line data={data} options={options as any} />
    </div>
  );
}