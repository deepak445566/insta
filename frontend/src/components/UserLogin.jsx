import React, { useState } from "react";
import API from "./utils/axiosConfig";
import { Link, useNavigate } from "react-router-dom";

const UserLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("🟡 Attempting login...");
      const res = await API.post("/user/login", formData, {
        withCredentials: true // ✅ Important for cookies
      });

      console.log("✅ Login success:", res.data);

      // ✅ Store token in localStorage (backup)
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        console.log("🟢 Token stored in localStorage");
      }

      // ✅ Check if cookies are working
      setTimeout(() => {
        console.log("🟢 Redirecting to home...");
        navigate("/");
      }, 1000);

    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
      alert("Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login to Your Account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4 text-indigo-600" />
              <span className="text-gray-600">Remember me</span>
            </label>
            <a href="/forgot-password" className="text-indigo-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to="/user/register" className="text-indigo-600 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default UserLogin;