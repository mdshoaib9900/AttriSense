import { useState } from "react";
import {
  User,
  Briefcase,
  DollarSign,
  Heart,
  Clock,
  Activity,
  Building,
  TrendingUp,
  ChevronDown
} from "lucide-react";

export default function PredictForm() {
  const [formData, setFormData] = useState({
    Age: "",
    Gender: "Male",
    Department: "",
    JobRole: "",
    MonthlyIncome: "",
    MaritalStatus: "",
    OverTime: "No",
    JobSatisfaction: 3,
    WorkLifeBalance: 3,
    YearsAtCompany: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);

      if (data.status === "success") {
        setResult({
          attrition: data.attrition_prediction,
          risk: data.risk_score,
        });
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Server not responding, start Flask backend!");
    }

    setLoading(false);
  };

  const inputClasses =
    "w-full pl-10 pr-4 py-3 rounded-lg bg-[#1e293b] border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-sm placeholder-slate-500 text-white appearance-none";
  const labelClasses = "block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider";
  const iconClasses = "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none";

  return (
    <div className="w-full min-h-screen bg-[#0b1120] text-white p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-[#0f172a] rounded-2xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] border border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900/20 to-transparent p-8 border-b border-slate-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/30">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Attrition Predictor</h1>
          </div>
          <p className="text-slate-400 text-sm ml-14">
            AI-powered analytics to forecast employee retention risks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center gap-2 text-blue-400 font-semibold mb-4 border-b border-slate-800 pb-2">
                  <User className="w-4 h-4" /> Personal Profile
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className={labelClasses}>Age</label>
                    <div className="relative">
                      <User className={iconClasses} />
                      <input
                        type="number"
                        name="Age"
                        placeholder="e.g. 34"
                        className={inputClasses}
                        value={formData.Age}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className={labelClasses}>Gender</label>
                    <div className="relative">
                      <select name="Gender" className={inputClasses} value={formData.Gender} onChange={handleChange}>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="col-span-2 relative">
                    <label className={labelClasses}>Marital Status</label>
                    <div className="relative">
                      <Heart className={iconClasses} />
                      <select name="MaritalStatus" className={inputClasses} value={formData.MaritalStatus} onChange={handleChange} required>
                        <option value="">Select Status...</option>
                        <option>Single</option>
                        <option>Married</option>
                        <option>Divorced</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="flex items-center gap-2 text-blue-400 font-semibold mb-4 border-b border-slate-800 pb-2">
                  <Activity className="w-4 h-4" /> Work Metrics
                </h3>

                <div className="space-y-4">
                  <div className="relative">
                    <label className={labelClasses}>OverTime</label>
                    <div className="relative">
                      <Clock className={iconClasses} />
                      <select name="OverTime" className={inputClasses} value={formData.OverTime} onChange={handleChange} required>
                        <option>No</option>
                        <option>Yes</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClasses}>Job Satisfaction (1-4)</label>
                      <select name="JobSatisfaction" className={`${inputClasses} pl-3 text-center`} value={formData.JobSatisfaction} onChange={handleChange}>
                        {[1, 2, 3, 4].map(v => <option key={v}>{v}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className={labelClasses}>Work Life Balance (1-4)</label>
                      <select name="WorkLifeBalance" className={`${inputClasses} pl-3 text-center`} value={formData.WorkLifeBalance} onChange={handleChange}>
                        {[1, 2, 3, 4].map(v => <option key={v}>{v}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h3 className="flex items-center gap-2 text-blue-400 font-semibold mb-4 border-b border-slate-800 pb-2">
                  <Briefcase className="w-4 h-4" /> Professional Details
                </h3>

                <div className="space-y-4">
                  <div className="relative">
                    <label className={labelClasses}>Department</label>
                    <div className="relative">
                      <Building className={iconClasses} />
                      <select name="Department" className={inputClasses} value={formData.Department} onChange={handleChange} required>
                        <option value="">Select Department...</option>
                        <option>Sales</option>
                        <option>Research & Development</option>
                        <option>Human Resources</option>
                      </select>
                    </div>
                  </div>

                  <div className="relative">
                    <label className={labelClasses}>Job Role</label>
                    <div className="relative">
                      <Briefcase className={iconClasses} />
                      <select name="JobRole" className={inputClasses} value={formData.JobRole} onChange={handleChange} required>
                        <option value="">Select Role...</option>
                        <option>Sales Executive</option>
                        <option>Research Scientist</option>
                        <option>Laboratory Technician</option>
                        <option>Manager</option>
                        <option>Healthcare Representative</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <label className={labelClasses}>Monthly Income (₹)</label>
                      <div className="relative">
                        <DollarSign className={iconClasses} />
                        <input
                          type="number"
                          name="MonthlyIncome"
                          className={inputClasses}
                          value={formData.MonthlyIncome}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <label className={labelClasses}>Years at Company</label>
                      <div className="relative">
                        <Activity className={iconClasses} />
                        <input
                          type="number"
                          name="YearsAtCompany"
                          className={inputClasses}
                          value={formData.YearsAtCompany}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-8 mt-auto">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold text-lg shadow-lg shadow-blue-500/20 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group"
                >
                  {loading ? "Predicting..." : "Run Prediction Model"}
                  {!loading && (
                    <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* RESULT DISPLAY SECTION */}
        {result && (
          <div className="bg-[#1e293b] border-t border-slate-800 p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">
              Attrition Prediction:{result.risk.toFixed(2)}%
            </h3>
            <p className="text-blue-400 text-xl font-bold">
              Risk Score: {result.risk}%
            </p>
            <p className="text-slate-500 text-xs mt-2">
              Higher score indicates higher risk of employee leaving.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
