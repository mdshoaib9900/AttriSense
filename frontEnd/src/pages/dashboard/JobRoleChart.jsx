// import { Pie } from "react-chartjs-2";
// import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
// Chart.register(ArcElement, Tooltip, Legend);

// export default function JobRoleChart({ data = {} }) {
//   const labels = Object.keys(data);
//   const values = labels.map(role => data[role].yes);

//   return (
//     <div>
//       <h2 className="text-lg font-bold mb-3 text-white">Attrition by Job Role</h2>

//       <div style={{ height: "260px"}}>
//       <Pie
//         data={{
//           labels,
//           datasets: [
//             {
//               data: values,
//               backgroundColor: [
//                 "#0ea5e9",
//                 "#14b8a6",
//                 "#6366f1",
//                 "#f43f5e",
//                 "#eab308",
//                 "#22c55e",
//                 "#8b5cf6",
//                 "#ef4444",
//               ]
//             }
//           ]
//         }}
//         options={{
//           plugins: { legend: { labels: { color: "white" } } }
//         }}
//       />
//     </div>
//     </div>
//   );
// }

import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(ArcElement, Tooltip, Legend);

export default function JobRoleChart({ data = {} }) {
  const labels = Object.keys(data);
  const values = labels.map(role => data[role].yes);

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#0ea5e9",
          "#14b8a6",
          "#6366f1",
          "#f43f5e",
          "#eab308",
          "#22c55e",
          "#8b5cf6",
          "#ef4444",
        ],
        borderColor: "#0f172a",
      },
    ],
  };

  return (
    <div className="bg-transparent p-4 rounded-lg">
      <h3 className="text-white text-lg font-semibold mb-3">
        Attrition by Job Role
      </h3>

      {/* SAME HEIGHT + SAME WRAPPER AS EDUCATION CHART */}
      <div style={{ height: 240 }}>
        <Pie
          data={chartData}
          options={{
            plugins: {
              legend: {
                labels: { color: "white" },
              },
            },
            maintainAspectRatio: false,
          }}
        />
      </div>
    </div>
  );
}
