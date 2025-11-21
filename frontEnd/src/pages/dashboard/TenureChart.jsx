import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function TenureChart({ counts = {} }) {
  const labels = Object.keys(counts);
  const data = Object.values(counts);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Attrition Count",
        data,
        backgroundColor: "#f97316",
      },
    ],
  };

  return (
    <div className="bg-transparent p-4 rounded-lg">
      <h3 className="text-white text-lg font-semibold mb-3">
        Attrition by Years at Company
      </h3>

      {/* FIX: Chart container must have fixed height */}
      <div style={{ height: "260px" }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              x: { ticks: { color: "white" } },
              y: { ticks: { color: "white" } },
            },
          }}
        />
      </div>
    </div>
  );
}
