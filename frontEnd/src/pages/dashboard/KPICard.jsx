export default function KPICard({ title, value }) {
  return (
    <div className="p-4 rounded-lg bg-gradient-to-br from-[#071022] to-[#081426] border border-gray-700">
      <p className="text-sm text-slate-400">{title}</p>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  );
}
