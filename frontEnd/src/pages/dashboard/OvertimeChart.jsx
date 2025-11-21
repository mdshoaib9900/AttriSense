import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function OvertimeChart({ data = {} }) {
  const labels = Object.keys(data);
  const values = labels.map(l => data[l]);

  return (
    <div>
      <h2 className="text-lg font-bold mb-3 text-white">Attrition vs Overtime</h2>
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Attrition Count",
              data: values,
              backgroundColor: "#ef4444",  // RED-500
            }
          ]
        }}
        options={{
          plugins: { legend: { labels: { color: "white" } } },
          scales: {
            x: { ticks: { color: "white" } },
            y: { ticks: { color: "white" } }
          }
        }}
      />
    </div>
  );
}
