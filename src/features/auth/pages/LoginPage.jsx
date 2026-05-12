// src/features/auth/pages/LoginPage.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiShield,
  FiBarChart2,
  FiBox,
  FiFileText,
  FiUsers,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiHeadphones,
} from "react-icons/fi";

import { ROUTES, API_STATUS } from "@/constants";
import { validateLoginForm } from "@/utils";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
  const navigate = useNavigate();

  const { login, status, error, clearError } = useAuth();

  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const isLoading = status === API_STATUS.LOADING;

  const features = [
    {
      icon: <FiBarChart2 />,
      title: "Real-time Insights",
      desc: "Reports and analytics.",
    },
    {
      icon: <FiBox />,
      title: "Inventory",
      desc: "Track stock and expiry.",
    },
    {
      icon: <FiFileText />,
      title: "Easy Billing",
      desc: "Fast POS billing.",
    },
    {
      icon: <FiUsers />,
      title: "Multi-store",
      desc: "Manage multiple stores.",
    },
  ];

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (error) {
      clearError();
    }

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    const validationErrors = validateLoginForm(payload);

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    try {
      await login(payload);
      navigate(ROUTES.DASHBOARD, { replace: true });
    } catch {
      // error already handled in redux
    }
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/40">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-5 py-4 lg:grid-cols-2 lg:px-8">
        {/* LEFT SIDE */}
        <section className="relative hidden min-h-0 flex-col justify-between lg:flex">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#08a84f] text-white">
                <FiPlus className="text-[24px] stroke-[3]" />
              </div>

              <h1 className="text-[28px] font-extrabold tracking-[-0.8px] text-slate-900">
                Pharma<span className="text-[#08a84f]">ERP</span>
              </h1>
            </div>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-[#08a84f]">
              <FiShield className="text-[12px]" />
              Smart Pharmacy Management
            </div>

            <h2 className="mt-3 max-w-[450px] text-[26px] font-extrabold leading-[1.18] tracking-[-0.5px] text-slate-900">
              Manage Your Pharmacy Business Smarter
            </h2>

            <p className="mt-2 max-w-[460px] text-[13.5px] leading-6 text-slate-600">
              PharmaERP helps you streamline inventory, billing, purchases, and
              more — all in one place.
            </p>

            <div className="mt-4 grid max-w-[500px] grid-cols-2 gap-3">
              {features.map((item) => (
                <div key={item.title} className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[18px] text-[#08a84f]">
                    {item.icon}
                  </div>

                  <div>
                    <h3 className="text-[12.5px] font-extrabold leading-4 text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 text-[11.5px] leading-4 text-slate-600">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-2 flex h-[190px] shrink-0 items-end justify-center">
            <DecorPlus className="left-[68%] top-0" />
            <DecorPlus className="right-5 top-[38%]" />
            <DecorPlus className="left-[12%] bottom-[45px] scale-75" />

            <div className="absolute bottom-0 h-[145px] w-[340px] rounded-[50%] bg-emerald-100/70" />

            <div className="relative z-10 w-[270px]">
              <div className="mx-auto h-2 w-[190px] rounded-t-md bg-slate-100 shadow-sm" />

              <div className="mx-auto flex h-[138px] w-[210px] flex-col items-center rounded-t-xl bg-white shadow-[0_12px_24px_rgba(15,23,42,0.12)]">
                <div className="mt-2.5 rounded-lg bg-[#08a84f] px-3.5 py-1 text-[14px] font-extrabold text-white shadow-md">
                  <span className="mr-1">✚</span> PHARMACY
                </div>

                <div className="mt-2.5 flex h-10 w-[184px] overflow-hidden rounded-t-lg">
                  {[
                    "bg-[#08a84f]",
                    "bg-white",
                    "bg-[#08a84f]",
                    "bg-white",
                    "bg-[#08a84f]",
                  ].map((c, i) => (
                    <div
                      key={i}
                      className={`flex-1 ${c} border border-emerald-100`}
                    />
                  ))}
                </div>

                <div className="flex w-[184px] bg-emerald-700">
                  <div className="grid h-[62px] flex-1 grid-cols-3 gap-1 bg-emerald-600 p-1.5">
                    {[...Array(9)].map((_, i) => (
                      <span key={i} className="rounded-sm bg-emerald-200/70" />
                    ))}
                  </div>

                  <div className="h-[62px] w-12 border-l border-emerald-500 bg-slate-600">
                    <div className="mx-auto mt-3 h-8 w-6 rounded bg-emerald-300/50" />
                  </div>
                </div>

                <div className="h-3 w-[210px] bg-emerald-700" />
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex min-h-0 flex-col justify-start pt-2 lg:pt-3">
          <div className="mx-auto w-full max-w-[560px] rounded-2xl bg-white px-7 py-6 shadow-[0_14px_40px_rgba(15,23,42,0.08)] sm:px-8 lg:px-9">
            <h2 className="text-[24px] font-extrabold tracking-[-0.5px] text-slate-900">
              Welcome Back!
            </h2>

            <p className="mt-1.5 text-[14.5px] text-slate-600">
              Sign in to your PharmaERP account.
            </p>

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">
                {error}
              </div>
            )}

            <form className="mt-5" onSubmit={handleSubmit}>
              <label className="text-[13px] font-bold text-slate-900">
                Email Address
              </label>

              <div
                className={`mt-1.5 flex h-[44px] items-center gap-3 rounded-lg border px-4 text-slate-500 ${
                  formErrors.email ? "border-red-400" : "border-slate-200"
                }`}
              >
                <FiMail className="text-[18px]" />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Enter your email"
                  className="h-full w-full bg-transparent text-[13.5px] outline-none placeholder:text-slate-500 disabled:cursor-not-allowed"
                />
              </div>

              {formErrors.email && (
                <p className="mt-1 text-[12px] font-medium text-red-500">
                  {formErrors.email}
                </p>
              )}

              <label className="mt-3.5 block text-[13px] font-bold text-slate-900">
                Password
              </label>

              <div
                className={`mt-1.5 flex h-[44px] items-center gap-3 rounded-lg border px-4 text-slate-500 ${
                  formErrors.password ? "border-red-400" : "border-slate-200"
                }`}
              >
                <FiLock className="text-[18px]" />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="Enter your password"
                  className="h-full w-full bg-transparent text-[13.5px] outline-none placeholder:text-slate-500 disabled:cursor-not-allowed"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-slate-500"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <FiEye className="text-[18px]" />
                  ) : (
                    <FiEyeOff className="text-[18px]" />
                  )}
                </button>
              </div>

              {formErrors.password && (
                <p className="mt-1 text-[12px] font-medium text-red-500">
                  {formErrors.password}
                </p>
              )}

              <div className="mt-3.5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setRemember(!remember)}
                  disabled={isLoading}
                  className="flex items-center gap-2 text-[12px] font-semibold text-slate-900 disabled:cursor-not-allowed"
                >
                  <span
                    className={`flex h-[18px] w-[18px] items-center justify-center rounded-md border text-[10px] ${
                      remember
                        ? "border-[#08a84f] bg-[#08a84f] text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {remember && "✓"}
                  </span>
                  Remember me
                </button>

                <Link
                  to={ROUTES.FORGOT_PASSWORD}
                  className="text-[12px] font-bold text-[#08a84f] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="mt-4 flex h-[45px] w-full items-center justify-center rounded-lg bg-[#08a84f] text-[15px] font-bold text-white shadow-sm transition hover:bg-[#079447] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>

              <p className="mt-4 text-center text-[14px] text-slate-600">
                Don&apos;t have an account?{" "}
                <Link to={ROUTES.REGISTER} className="font-bold text-[#08a84f]">
                  Create Account
                </Link>
              </p>
            </form>
          </div>

          <div className="mx-auto mt-3 grid w-full max-w-[560px] gap-3 text-slate-600 sm:grid-cols-3">
            <SecurityItem icon={<FiShield />} text="256-bit SSL" />
            <SecurityItem icon={<FiLock />} text="100% Safe Data" />
            <SecurityItem icon={<FiHeadphones />} text="24/7 Support" />
          </div>
        </section>
      </div>
    </main>
  );
};

const SecurityItem = ({ icon, text }) => {
  return (
    <div className="flex items-center justify-center gap-2 text-[12px] font-medium">
      <span className="text-[16px]">{icon}</span>
      {text}
    </div>
  );
};

const DecorPlus = ({ className = "" }) => {
  return (
    <div
      className={`absolute text-[26px] font-extrabold text-emerald-100 ${className}`}
    >
      +
    </div>
  );
};

export default LoginPage;
