import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function EmployeeList() {
  const token = useAuthStore(s => s.token);
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/datasets/rows", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setRows(data.rows || []));
  }, [token]);

  const filteredRows =
    filter === "all"
      ? rows
      : rows.filter(r =>
          String(r.Attrition).toLowerCase() === (filter === "yes" ? "yes" : "no")
        );

  // PDF EXPORT
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Employee Attrition Report", 14, 15);

    const tableData = filteredRows.map(r => [
      r.EmployeeNumber || r.EmpID || "-",
      r.Department,
      r.JobRole,
      r.Attrition
    ]);

    doc.autoTable({
      head: [["Employee Number", "Department", "Role", "Attrition"]],
      body: tableData,
      startY: 25
    });

    doc.save("employee-attrition-report.pdf");
  };

  return (
    <div className="p-6 text-white bg-[#0b1120] min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Employee Attrition List</h1>

      {/* Filters */}
      <div className="mb-4">
        <select
          className="p-2 rounded bg-[#1e293b]"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="all">All Employees</option>
          <option value="yes">Attrition: Yes</option>
          <option value="no">Attrition: No</option>
        </select>

        <button
          onClick={downloadPDF}
          className="ml-4 py-2 px-4 bg-teal-600 rounded cursor-pointer"
        >
          Download PDF
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto max-h-[70vh] border border-slate-700 rounded">
        <table className="w-full text-left">
          <thead className="bg-[#1e293b]">
            <tr>
              <th className="px-4 py-2">Employee Number</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Job Role</th>
              <th className="px-4 py-2">Attrition</th>
            </tr>
          </thead>

          <tbody>
            {filteredRows.map((r, i) => (
              <tr key={i} className="border-b border-gray-800">
                <td className="px-4 py-2">
                  {r.EmployeeNumber || r.EmpID || "-"}
                </td>
                <td className="px-4 py-2">{r.Department}</td>
                <td className="px-4 py-2">{r.JobRole}</td>
                <td
                  className={`px-4 py-2 ${
                    String(r.Attrition).toLowerCase() === "yes"
                      ? "text-red-400"
                      : "text-green-400"
                  }`}
                >
                  {r.Attrition}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
