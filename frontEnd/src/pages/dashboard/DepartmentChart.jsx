import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function DepartmentChart({ counts = {} }) {
  const labels = Object.keys(counts);
  const data = Object.values(counts);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Attrition Count",
        data,
        backgroundColor: "rgba(14,165,233,0.8)", // visible blue
        borderColor: "#0ea5e9",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="bg-transparent p-4 rounded-lg">
      <h3 className="text-white text-lg font-semibold mb-3">
        Attrition by Department
      </h3>

      {/* FIX: Fixed height wrapper */}
      <div style={{ height: "260px" }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
              legend: { display: false },
              tooltip: {
                backgroundColor: "#111827",
                titleColor: "#fff",
                bodyColor: "#fff",
              }
            },
            scales: {
              x: {
                ticks: { color: "white" },
                grid: { color: "rgba(255,255,255,0.1)" }, // visible grid
              },
              y: {
                ticks: { color: "white" },
                grid: { color: "rgba(255,255,255,0.1)" },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
