// import { useEffect } from "react";
// import { useAuthStore } from "@/store/authStore"; // your existing
// import { useDatasetStore } from "@/store/useDatasetStore";
// import KPICard from "@/pages/dashboard/KPICard";
// import AgeChart from "@/pages/dashboard/AgeChart";
// import JobRoleChart from "@/pages/dashboard/JobRoleChart";
// import SalaryBandChart from "@/pages/dashboard/SalaryBandChart";
// import OvertimeChart from "@/pages/dashboard/OvertimeChart";
// import SatisfactionChart from "@/pages/dashboard/SatisfactionChart";

// export default function DashboardHome() {
//   const token = useAuthStore((s) => s.token);
//   const { dataset, analysis, loading, fetchMetadata, fetchAnalysis } = useDatasetStore();

//   useEffect(() => {
//     if (!token) return;
//     fetchMetadata(token).then(() => fetchAnalysis(token));
//   }, [token]);

//   if (loading) return <div className="p-8">Loading...</div>;

//   return (
//     <div className="w-full h-full min-h-screen bg-[#0b1120] text-white p-6">
//       <div className="rounded-xl bg-[#0f172a] p-6 min-h-[80vh]">
//         <header className="flex items-center justify-between mb-6">
//           <h1 className="text-3xl font-bold">HR Attrition Dashboard</h1>
//           <div className="text-sm text-slate-400">{dataset?.fileName || "No dataset"}</div>
//         </header>

//         {/* Row 1 - KPIs */}
//         <div className="grid grid-cols-4 gap-4 mb-6">
//           <KPICard title="Attrition Rate" value={`${analysis?.summary?.attritionRate?.toFixed(2) || 0}%`} />
//           <KPICard title="Total Employees" value={analysis?.summary?.total || analysis?.totalRows || 0} />
//           <KPICard title="Total Attritions" value={analysis?.summary?.attritionCount || 0} />
//           <KPICard title="Average Salary" value={`₹ ${Math.round(analysis?.summary?.avgIncome || 0)}`} />
//         </div>

//         {/* Row 2 - Main charts */}
//         <div className="grid grid-cols-3 gap-4 mb-6">
//           <div className="col-span-1 p-4 bg-[#071022] rounded-lg">
//             <AgeChart data={analysis?.summary?.ageBuckets} />
//           </div>

//           <div className="col-span-1 p-4 bg-[#071022] rounded-lg">
//             <JobRoleChart data={analysis?.summary?.jobRole} />
//           </div>

//           <div className="col-span-1 p-4 bg-[#071022] rounded-lg">
//             <SalaryBandChart rowsSample={analysis?.sample} />
//           </div>
//         </div>

//         {/* Row 3 - Behavioral */}
//         <div className="grid grid-cols-3 gap-4">
//           <div className="p-4 bg-[#071022] rounded-lg">
//             <OvertimeChart data={analysis?.summary?.overtime} />
//           </div>
//           <div className="p-4 bg-[#071022] rounded-lg">
//             <SatisfactionChart data={analysis?.summary?.jobSatisfaction} />
//           </div>
//           <div className="p-4 bg-[#071022] rounded-lg">
//             <SatisfactionChart title="Work Life Balance" data={analysis?.summary?.workLife} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useDatasetStore } from "@/store/useDatasetStore";

import KPICard from "@/pages/dashboard/KPICard";
import AgeChart from "@/pages/dashboard/AgeChart";
import JobRoleChart from "@/pages/dashboard/JobRoleChart";
import SalaryBandChart from "@/pages/dashboard/SalaryBandChart";
import OvertimeChart from "@/pages/dashboard/OvertimeChart";
import SatisfactionChart from "@/pages/dashboard/SatisfactionChart";

import DepartmentChart from "@/pages/dashboard/DepartmentChart";
import EducationChart from "@/pages/dashboard/EducationChart";
import TenureChart from "@/pages/dashboard/TenureChart";

export default function DashboardHome() {
  const token = useAuthStore((s) => s.token);

  const {
    dataset,
    analysis,
    loading,
    fetchMetadata,
    fetchAnalysis,
  } = useDatasetStore();

  // STEP 1 — Load metadata ONCE when token becomes available
  useEffect(() => {
    if (!token) return;

    // If dataset already loaded, don't fetch again
    if (!dataset) {
      fetchMetadata(token);
    }
  }, [token]);

  // STEP 2 — Load analysis ONLY after metadata is fetched
  useEffect(() => {
    if (!token) return;

    // Avoid refetching analysis repeatedly
    if (dataset && !analysis) {
      fetchAnalysis(token);
    }
  }, [dataset]);

  if (loading || !dataset || !analysis) {
    return (
      <div className="w-full h-full min-h-screen flex items-center justify-center bg-[#0b1120] text-white text-xl">
        Please Upload Dataset
      </div>
    );
  }else if(loading || !analysis){
     return (
      <div className="w-full h-full min-h-screen flex items-center justify-center bg-[#0b1120] text-white text-xl">
        processesing the dataset
      </div>
    );
  }


  return (
    <div className="w-full h-full min-h-screen bg-[#0b1120] text-white p-6">
      <div className="rounded-xl bg-[#0f172a] p-6 min-h-[80vh]">

        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="text-sm text-slate-400">
            {dataset?.fileName}
          </div>
        </header>

        {/* --------------------- Row 1 — KPI CARDS --------------------- */}
        <div className="grid grid-cols-4 gap-4 mb-8">

          <KPICard
            title="Attrition Rate"
            value={`${analysis.summary.attritionRate.toFixed(2)}%`}
          />

          <KPICard
            title="Total Employees"
            value={analysis.summary.total}
          />

          <KPICard
            title="Total Attritions"
            value={analysis.summary.attritionCount}
          />

          <KPICard
            title="Average Salary"
            value={`₹ ${Math.round(analysis.summary.avgIncome)}`}
          />
        </div>

        {/* --------------------- Row 2 — Core Charts --------------------- */}
        <div className="grid grid-cols-3 gap-4 mb-8">

          <div className="p-4 bg-[#071022] rounded-lg">
            <AgeChart data={analysis.summary.ageBuckets} />
          </div>

          <div className="p-4 bg-[#071022] rounded-lg">
            <JobRoleChart data={analysis.summary.jobRole} />
          </div>

          <div className="p-4 bg-[#071022] rounded-lg">
            <SalaryBandChart summary={analysis.summary} />
          </div>
        </div>

        {/* --------------------- Row 3 — Behavioral Insights --------------------- */}
        <div className="grid grid-cols-3 gap-4 mb-8">

          <div className="p-4 bg-[#071022] rounded-lg">
            <OvertimeChart data={analysis.summary.overtime} />
          </div>

          <div className="p-4 bg-[#071022] rounded-lg">
            <SatisfactionChart data={analysis.summary.jobSatisfaction} />
          </div>

          <div className="p-4 bg-[#071022] rounded-lg">
            <SatisfactionChart
              title="Work Life Balance"
              data={analysis.summary.workLife}
            />
          </div>
        </div>

        {/* --------------------- Row 4 — NEW CHARTS --------------------- */}
        {/* Row 4 — NEW CHARTS */}
<div className="grid grid-cols-3 gap-4">
  <div className="p-4 bg-[#071022] rounded-lg">
    <DepartmentChart counts={analysis?.summary?.department ?? {}} />
  </div>

  <div className="p-4 bg-[#071022] rounded-lg">
    <EducationChart counts={analysis?.summary?.education ?? {}} />
  </div>

  <div className="p-4 bg-[#071022] rounded-lg">
    <TenureChart counts={analysis?.summary?.tenure ?? {}} />
  </div>
</div>

      </div>
    </div>
  );
}
