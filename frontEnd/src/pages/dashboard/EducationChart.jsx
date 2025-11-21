import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

export default function EducationChart({ counts = {} }) {
  // Direct compute — stable since `counts` is stable from parent now
  const labels = Object.keys(counts);
  const data = Object.values(counts);

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          "#10b981",
          "#0ea5e9",
          "#6366f1",
          "#f59e0b",
          "#ef4444",
        ],
        borderColor: "#0f172a",
      },
    ],
  };

  return (
    <div className="bg-transparent p-4 rounded-lg">
      <h3 className="text-white text-lg font-semibold mb-3">
        Attrition by Education Level
      </h3>

      <div style={{ height: 240 }}>
        <Pie
          data={chartData}
          options={{
            plugins: { legend: { labels: { color: "white" } } },
            maintainAspectRatio: false,
          }}
        />
      </div>
    </div>
  );
}
