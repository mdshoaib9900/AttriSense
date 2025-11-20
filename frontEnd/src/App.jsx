// import "./firebase/config"; 
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useEffect } from "react";
// import { useAuthStore } from "./store/authStore";
// import LandingPage from "./pages/landing/LandingPage";
// import LoginPage from "./pages/Login";
// import SignupPage from "./pages/Signup";
// import ProtectedRoute from "./components/ProtectedRoute";
// import GuestOnly from "./components/GuestOnly";
// import { Navbar } from "./components/landing/Navbar";

// import DashboardHome from "@/layout/DashboardHome";
// import DashboardLayout from "@/layout/DashboardLayout";
// import UploadDataset from "@/pages/dashboard/UploadDataset";
// import Analysis from "@/pages/dashboard/Analysis";
// import Settings from "@/pages/dashboard/Settings";
// import { Toaster } from "sonner";
// import { useLocation } from "react-router-dom";
// export default function App() {
//   const location = useLocation();
//   const hideNavbar = location.pathname.startsWith("/dashboard");
//   const loadUser = useAuthStore((state) => state.loadUser);

//   useEffect(() => {
//     loadUser();
//   }, []);

//   return (
//     <BrowserRouter>

//       {/* ALWAYS VISIBLE NAVBAR */}
//       {/* {!window.location.pathname.startsWith("/dashboard") && <Navbar />} */}
//        {!hideNavbar && <Navbar />}

//       <Routes>

//         {/* Landing page only when NOT logged in */}
//         <Route
//           path="/"
//           element={
//             <GuestOnly>
//               <LandingPage />
//             </GuestOnly>
//           }
//         />

//         <Route
//           path="/login"
//           element={
//             <GuestOnly>
//               <LoginPage />
//             </GuestOnly>
//           }
//         />

//         <Route
//           path="/signup"
//           element={
//             <GuestOnly>
//               <SignupPage />
//             </GuestOnly>
//           }
//         />

//         {/* Logged-in protected pages */}
//         <Route
//           path="/dashboard"
//           element={
//             <ProtectedRoute>
//               <DashboardLayout>
//                 <DashboardHome />
//               </DashboardLayout>
//             </ProtectedRoute>
//           }
//         />

//         {/* ✅ NEW ROUTES ADDED BELOW — NOTHING ABOVE WAS TOUCHED */}

//         <Route
//           path="/dashboard/upload"
//           element={
//             <ProtectedRoute>
//               <DashboardLayout>
//                 <UploadDataset />
//               </DashboardLayout>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/dashboard/analysis"
//           element={
//             <ProtectedRoute>
//               <DashboardLayout>
//                 <Analysis />
//               </DashboardLayout>
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/dashboard/settings"
//           element={
//             <ProtectedRoute>
//               <DashboardLayout>
//                 <Settings />
//               </DashboardLayout>
//             </ProtectedRoute>
//           }
//         />

//         {/* Catch-all */}
//         <Route path="*" element={<Navigate to="/" />} />

//       </Routes>
//        <Toaster richColors closeButton />
//     </BrowserRouter>
//   );
// }
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";

import LandingPage from "./pages/landing/LandingPage";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestOnly from "./components/GuestOnly";
import { Navbar } from "./components/landing/Navbar";

import DashboardLayout from "@/layout/DashboardLayout";
import DashboardHome from "@/layout/DashboardHome";
import UploadDataset from "@/pages/dashboard/UploadDataset";
import Analysis from "@/pages/dashboard/Analysis";
import Settings from "@/pages/dashboard/Settings";
import { Toaster } from "sonner";

export default function App() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/dashboard");

  const loadUser = useAuthStore((state) => state.loadUser);

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            <GuestOnly>
              <LandingPage />
            </GuestOnly>
          }
        />

        <Route
          path="/login"
          element={
            <GuestOnly>
              <LoginPage />
            </GuestOnly>
          }
        />

        <Route
          path="/signup"
          element={
            <GuestOnly>
              <SignupPage />
            </GuestOnly>
          }
        />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardHome />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/upload"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <UploadDataset />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/analysis"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Analysis />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Toaster richColors closeButton />
    </>
  );
}

