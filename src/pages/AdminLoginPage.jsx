import { useState, useEffect } from "react";
import { loginAdmin } from "../comman/api";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Input = ({ ...props }) => (
  <input
    className="w-full px-3 py-2 text-sm rounded-xl bg-gray-800 border border-gray-700 text-white outline-none focus:ring-2 focus:ring-gray-600"
    {...props}
  />
);

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`w-full p-3  rounded-xl text-sm font-medium transition bg-blue-600 hover:bg-blue-500 disabled:opacity-50 ${className}`}
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

  const { setIsAuth } = useAuth();

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
        setIsAuth(true);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950/90 via-gray-900/90 to-black/90 text-white p-6">
      <div className="relative w-full max-w-xl bg-gray-800 p-6 rounded-2xl border border-gray-800 space-y-4">
        <div className="absolute end-0 top-0" style={{ width: 200 }}>
  <img
    alt="auth-card-bg"
    src="/auth-card-bg.svg"
  />
</div>

        <Toaster position="top-center" />
        <img src="/houserdemologo.png" alt="Logo" className="mx-auto h-16 w-16" />
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>
        <p className="text-center text-sm max-w-[85%] mx-auto">Let’s get you signed in. Enter your email and password to continue.</p>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white/60 mb-1">
            Email
          </label>
          <Input
            name="email"
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
          <label htmlFor="password" className="block text-sm font-medium text-white/60 mb-1">
            Password
          </label>
          <Input
            name="password"
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
        <div className="mb-5 flex items-center justify-between gap-2 text-sm">
          <div className="flex items-start gap-2 lg:items-center">
            <input
              className="form-checkbox form-checkbox-light mt-1 size-4.25 lg:mt-0"
              id="rememberMe"
              type="checkbox"
              defaultChecked=""
            />
            <label className="form-check-label" htmlFor="rememberMe">
              Keep me signed in
            </label>
          </div>
          <a
            className="text-default-400 underline underline-offset-4"
            href="/ubold/tailwind/react/auth/reset-pass"
            data-discover="true"
          >
            Forgot Password?
          </a>
        </div>


        <Button className="cursor-pointer" onClick={handleSubmit} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </div>
    </div>
  );
}