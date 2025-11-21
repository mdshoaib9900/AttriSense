import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";

export default function Settings() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [theme, setTheme] = useState("dark");
  const [chartPreferences, setChartPreferences] = useState({
    age: true,
    jobRole: true,
    salary: true,
    overtime: true,
    satisfaction: true,
    department: true,
    education: true,
    tenure: true,
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    datasetUploaded: true,
    analysisCompleted: true,
    monthlySummary: false,
  });

  const handleSaveProfile = () => {
    toast.success("Profile updated successfully (mock).");
  };

  const handleSavePreferences = () => {
    toast.success("Dashboard preferences saved.");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification settings updated.");
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion is not implemented yet.");
  };

  return (
    <div className="w-full min-h-screen bg-[#0b1120] text-white p-6">
      <div className="rounded-xl bg-[#0f172a] p-6">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>

        {/* PROFILE SETTINGS */}
        <Card className="bg-[#111827] border-slate-700 mb-10">
          <CardHeader>
            <CardTitle className="text-xl text-teal-300">
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm text-slate-300">Full Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-slate-800 text-white mt-1"
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Email</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 text-white mt-1"
              />
            </div>

            <Button onClick={handleSaveProfile} className="mt-4">
              Save Profile
            </Button>
          </CardContent>
        </Card>

        {/* DASHBOARD PREFERENCES */}
        <Card className="bg-[#111827] border-slate-700 mb-10">
          <CardHeader>
            <CardTitle className="text-xl text-teal-300">
              Dashboard Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <span>Theme</span>
              <select
                className="bg-slate-800 text-white p-2 rounded"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                <option value="dark">Dark (Default)</option>
                <option value="light">Light</option>
              </select>
            </div>

            {/* Chart Toggles */}
            <div>
              <h3 className="text-lg mb-2 text-slate-300">Show / Hide Charts</h3>

              {Object.keys(chartPreferences).map((key) => (
                <div
                  key={key}
                  className="flex items-center justify-between py-2"
                >
                  <span className="capitalize text-slate-300">
                    {key.replace("-", " ")}
                  </span>
                  <Switch
                    checked={chartPreferences[key]}
                    onCheckedChange={(val) =>
                      setChartPreferences({ ...chartPreferences, [key]: val })
                    }
                  />
                </div>
              ))}
            </div>

            <Button onClick={handleSavePreferences} className="mt-2">
              Save Dashboard Preferences
            </Button>
          </CardContent>
        </Card>

        {/* NOTIFICATION SETTINGS */}
        <Card className="bg-[#111827] border-slate-700 mb-10">
          <CardHeader>
            <CardTitle className="text-xl text-teal-300">
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.keys(notificationPrefs).map((key) => (
              <div key={key} className="flex items-center justify-between">
                <span className="capitalize text-slate-300">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>
                <Switch
                  checked={notificationPrefs[key]}
                  onCheckedChange={(val) =>
                    setNotificationPrefs({ ...notificationPrefs, [key]: val })
                  }
                />
              </div>
            ))}

            <Button onClick={handleSaveNotifications} className="mt-2">
              Save Notification Settings
            </Button>
          </CardContent>
        </Card>

        {/* DANGER ZONE */}
        <Card className="bg-red-900/40 border-red-700">
          <CardHeader>
            <CardTitle className="text-xl text-red-400"></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
              onClick={handleDeleteAccount}
            >
              Delete My Account
            </Button>

            <Button
              className="bg-slate-700 hover:bg-slate-600 cursor-pointer"
              onClick={() => logout()}
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
