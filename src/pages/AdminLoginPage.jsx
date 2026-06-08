import { useState, useEffect } from "react";
import { loginAdmin } from "../comman/api";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Input = ({ ...props }) => (
  <input
    className="w-full px-3 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-gray-600"
    {...props}
  />
);

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`w-full px-3 py-2 rounded-xl text-sm font-medium transition bg-blue-600 hover:bg-blue-500 disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    let newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      const res = await loginAdmin(form.email, form.password);

      if (res?.token) {
        localStorage.setItem("adminToken", res.token);
        toast.success("Login successful 🚀");
      
        navigate("/admin/dashboard");
      } else {
        toast.error("Invalid credentials ❌");
      }
    } catch (err) {
      toast.error("Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit= () => {
  //  toast.success("Login successful 🚀");
  // }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">
      <div className="w-full max-w-md bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-4">
        <Toaster position="top-center" />
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>

        {/* Email */}
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />
          {errors.password && (
            <p className="text-red-400 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </div>
  );
}