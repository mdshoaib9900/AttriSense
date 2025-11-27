import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

import { Home, FileUp, BarChart, Settings, LogOut, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <SidebarProvider>
      <DashboardLayoutInner navigate={navigate} logout={logout} user={user}>
        {children}
      </DashboardLayoutInner>
    </SidebarProvider>
  );
}

function DashboardLayoutInner({ navigate, logout, user, children }) {
  const { state } = useSidebar();  

  return (
    <div className="flex min-h-screen w-full">

      {/* SIDEBAR */}
      <Sidebar collapsible="icon" className="border-r">

        <SidebarHeader className="flex gap-2">
          <SidebarTrigger />
          {state === "expanded" && (
            <h1 className="font-semibold text-3xl text-green-700 p-2">AttriSense</h1>
          )}
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenu>

            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate("/dashboard")}>
                <Home />
                <span className="text-xl font-bold cursor-pointer">Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate("/dashboard/upload")}>
                <FileUp />
                <span className="text-xl font-bold cursor-pointer">Dataset Upload</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate("/dashboard/analysis")}>
                <BarChart />
                <span className="text-xl font-bold cursor-pointer">Analysis</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate("/dashboard/employees")}>
                <Home />
                <span className="text-xl font-bold cursor-pointer">Employees</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => navigate("/dashboard/settings")}>
                <Settings />
                <span className="text-xl font-bold cursor-pointer ">Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

          </SidebarMenu>

          <SidebarSeparator />
        </SidebarContent>

        {/* FOOTER */}
        <SidebarFooter>
          <div className="flex items-center gap-3 p-2">
            <User className="w-5 h-5" />
            {state === "expanded" && (
              <div>
                <div className="text-sm font-medium">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
            )}
          </div>

          <button
            onClick={() => { logout(); navigate("/"); }}
            className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-100 rounded-md cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            {state === "expanded" && "Logout"}
          </button>
        </SidebarFooter>

      <SidebarRail />
      </Sidebar>


            <main className="flex-1 min-h-screen bg-[#0b1120] p-0 m-0 w-full">
  <div className="w-full h-full">{children}</div>
</main>

    </div>
  );
}
