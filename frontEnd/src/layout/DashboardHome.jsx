export default function DashboardHome() {
  return (
    <div className="w-full h-full min-h-screen bg-[#0b1120] text-white">
      <div className="w-full h-full bg-[#0f172a] p-8 rounded-lg">
        <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-700/40 rounded-xl p-6 h-64">
            <p className="text-sm mb-4">Graph Visualization Here</p>
          </div>

          <div className="border border-gray-700/40 rounded-xl p-6 h-64">
            <p className="text-sm mb-4">Recent Activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}
