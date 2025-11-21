import { Bar } from "react-chartjs-2";
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AgeChart({ data = {} }) {
  const labels = Object.keys(data);
  const values = labels.map(l => data[l].yes);

  return (
    <div>
      <h2 className="text-lg font-bold mb-3 text-white">Attrition by Age Group</h2>
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Attritions",
              data: values,
              backgroundColor: "#14b8a6",   // SOLID TEAL COLOR
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
