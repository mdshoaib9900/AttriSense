import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function SatisfactionChart({ data = {}, title = "Job Satisfaction" }) {
  const labels = Object.keys(data);
  const values = Object.values(data);

  return (
    <div>
      <h2 className="text-lg font-bold mb-3 text-white">{title}</h2>
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Count",
              data: values,
              backgroundColor: "#6366f1",   // Indigo-500
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
