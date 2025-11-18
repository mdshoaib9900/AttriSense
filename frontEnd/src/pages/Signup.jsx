import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export default function SignupForm() {
  const navigate = useNavigate();
  const signup = useAuthStore((state) => state.signup);

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      await signup(form.name, form.email, form.password);

      setIsSignedUp(true);         // Success screen
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred during signup."
      );
    }

    setIsLoading(false);
  };

  // SUCCESS SCREEN
  if (isSignedUp) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-sm w-full text-center">
          <svg
            className="mx-auto h-16 w-16 text-teal-500 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Account Created!
          </h2>
          <p className="text-gray-600 mb-4">
            You can now proceed to login.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mt-6 w-full py-2 px-4 rounded-lg bg-teal-600 text-white font-semibold transition duration-200 hover:bg-teal-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // SIGNUP FORM
  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
          Create Your <span className="text-teal-500">AttriSense</span> Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-teal-500"
              placeholder="John Doe"
              disabled={isLoading}
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Work Email
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-teal-500"
              placeholder="you@company.com"
              disabled={isLoading}
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password (min. 8 characters)
            </label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-teal-500"
              placeholder="••••••••"
              disabled={isLoading}
            />
          </div>

          {/* ERROR */}
          {error && (
            <div className="text-red-600 text-sm p-3 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-lg font-bold text-white 
              transition duration-200 
              ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-teal-600 hover:bg-teal-700"
              }`}
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-teal-600 hover:text-teal-500">
            Sign In here
          </a>
        </p>
      </div>
    </div>
  );
}
