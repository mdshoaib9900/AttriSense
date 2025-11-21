import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

export default function SalaryBandChart({ summary = {} }) {
  const salaryBands = summary.salaryBands ?? {};
  const salarySlabCounts = summary.salarySlabCounts ?? {};

  const hasSlabs = Object.keys(salarySlabCounts).length > 0;
  const hasBands = Object.keys(salaryBands).length > 0;

  if (!hasSlabs && !hasBands) {
    return (
      <div className="p-4 text-center text-slate-400 bg-[#071022] rounded-lg" style={{ height: 260 }}>
        No salary data available
      </div>
    );
  }

  const labels = hasSlabs ? Object.keys(salarySlabCounts) : Object.keys(salaryBands);
  const data = hasSlabs ? Object.values(salarySlabCounts) : Object.values(salaryBands);

  const colors = [
    "#10b981",
    "#0ea5e9",
    "#6366f1",
    "#f59e0b",
    "#ef4444",
    "#c084fc",
    "#f97316",
  ].slice(0, labels.length);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-3 text-white">
        Salary Band Distribution
      </h2>

      <div style={{ height: 260 }}>
        <Doughnut
          data={{
            labels,
            datasets: [
              {
                data,
                backgroundColor: colors,
                borderColor: "#0f172a",
                borderWidth: 1,
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            cutout: "55%",
            plugins: { legend: { labels: { color: "white" } } },
          }}
        />
      </div>
    </div>
  );
}
