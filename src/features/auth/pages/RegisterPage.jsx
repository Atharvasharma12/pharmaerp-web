// src/features/auth/pages/RegisterPage.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiPlus,
  FiShield,
  FiCloud,
  FiBarChart2,
  FiHeadphones,
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiLock,
  FiEye,
  FiEyeOff,
  FiMapPin,
  FiBriefcase,
} from "react-icons/fi";

import { ROUTES, API_STATUS } from "@/constants";
import { validateRegisterForm } from "@/utils";
import useAuth from "../hooks/useAuth";

const RegisterPage = () => {
  const navigate = useNavigate();

  const { register, status, error, clearError } = useAuth();

  const [agree, setAgree] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    state: "",
    city: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const isLoading = status === API_STATUS.LOADING;

  const features = [
    {
      icon: <FiShield />,
      title: "Secure & Reliable",
      desc: "Your data is safe with us. 100% secure.",
    },
    {
      icon: <FiCloud />,
      title: "Cloud Based",
      desc: "Access your business from anywhere.",
    },
    {
      icon: <FiBarChart2 />,
      title: "Powerful Insights",
      desc: "Get real-time reports and growth.",
    },
    {
      icon: <FiHeadphones />,
      title: "Dedicated Support",
      desc: "Our team is always ready to help.",
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
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      phone: formData.phone.trim(),
    };

    const validationErrors = validateRegisterForm(payload);

    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = "Passwords do not match";
    }

    if (!agree) {
      validationErrors.agree = "Please accept terms and privacy policy";
    }

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    if (!payload.phone) {
      delete payload.phone;
    }

    try {
      await register(payload);
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

            <h2 className="mt-10 max-w-[430px] text-[28px] font-extrabold leading-[1.2] tracking-[-0.6px] text-slate-900">
              Create Your Account
              <span className="block">and Get Started</span>
            </h2>

            <p className="mt-4 max-w-[430px] text-[14px] leading-7 text-slate-600">
              Manage your pharmacy operations smarter, faster and easier with{" "}
              <span className="font-bold text-[#08a84f]">PharmaERP</span>.
            </p>

            <div className="mt-7 grid max-w-[460px] gap-4">
              {features.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[18px] text-[#08a84f]">
                    {item.icon}
                  </div>

                  <div>
                    <h3 className="text-[13px] font-extrabold text-slate-900">
                      {item.title}
                    </h3>

                    <p className="mt-0.5 text-[12px] leading-5 text-slate-600">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-2 flex h-[220px] items-end justify-center">
            <DecorPlus className="left-[75%] top-3" />
            <DecorPlus className="left-[63%] bottom-[115px]" />
            <DecorPlus className="right-5 bottom-[85px]" />
            <DecorPlus className="left-3 bottom-[120px] scale-75" />

            <div className="absolute bottom-0 h-[170px] w-[360px] rounded-[50%] bg-emerald-100/70" />

            <div className="relative z-10 w-[290px]">
              <div className="mx-auto h-2 w-[200px] rounded-t-md bg-slate-100 shadow-sm" />

              <div className="mx-auto flex h-[148px] w-[225px] flex-col items-center rounded-t-xl bg-white shadow-[0_12px_24px_rgba(15,23,42,0.12)]">
                <div className="mt-3 rounded-lg bg-[#08a84f] px-3.5 py-1 text-[15px] font-extrabold text-white shadow-md">
                  <span className="mr-1">✚</span> PHARMACY
                </div>

                <div className="mt-3 flex h-11 w-[195px] overflow-hidden rounded-t-lg">
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

                <div className="flex w-[195px] bg-emerald-700">
                  <div className="grid h-[66px] flex-1 grid-cols-3 gap-1 bg-emerald-600 p-1.5">
                    {[...Array(9)].map((_, i) => (
                      <span key={i} className="rounded-sm bg-emerald-200/70" />
                    ))}
                  </div>

                  <div className="h-[66px] w-14 border-l border-emerald-500 bg-slate-600">
                    <div className="mx-auto mt-3 h-8 w-7 rounded bg-emerald-300/50" />
                  </div>
                </div>

                <div className="h-3 w-[225px] bg-emerald-700" />
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex min-h-0 flex-col justify-start pt-2">
          <div className="mx-auto w-full max-w-[700px] rounded-2xl bg-white px-7 py-6 shadow-[0_14px_40px_rgba(15,23,42,0.08)] sm:px-8 lg:px-9">
            <h2 className="text-[26px] font-extrabold tracking-[-0.5px] text-slate-900">
              Create Account
            </h2>

            <p className="mt-1.5 text-[14px] text-slate-600">
              Fill in the details below to create your PharmaERP account.
            </p>

            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">
                {error}
              </div>
            )}

            <form className="mt-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isLoading}
                  error={formErrors.fullName}
                  icon={<FiUser />}
                  placeholder="Enter your full name"
                />

                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  error={formErrors.email}
                  icon={<FiMail />}
                  placeholder="Enter your email address"
                />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <PhoneField
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isLoading}
                  error={formErrors.phone}
                />

                <InputField
                  label="Business / Pharmacy Name"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  disabled={isLoading}
                  icon={<FiBriefcase />}
                  placeholder="Enter pharmacy name"
                />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={isLoading}
                  icon={<FiMapPin />}
                />

                <SelectField
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={isLoading}
                  icon={<FiHome />}
                />
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <PasswordField
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  error={formErrors.password}
                  placeholder="Create a password"
                  showPassword={showPassword}
                  onTogglePassword={() => setShowPassword((prev) => !prev)}
                  helperText="Minimum 6 characters"
                />

                <PasswordField
                  label="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  error={formErrors.confirmPassword}
                  placeholder="Confirm your password"
                  showPassword={showConfirmPassword}
                  onTogglePassword={() =>
                    setShowConfirmPassword((prev) => !prev)
                  }
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setAgree(!agree);

                  if (formErrors.agree) {
                    setFormErrors((prev) => ({
                      ...prev,
                      agree: "",
                    }));
                  }
                }}
                disabled={isLoading}
                className="mt-5 flex items-center gap-2 text-[12px] text-slate-700 disabled:cursor-not-allowed"
              >
                <span
                  className={`flex h-[18px] w-[18px] items-center justify-center rounded-md border text-[10px] ${
                    agree
                      ? "border-[#08a84f] bg-[#08a84f] text-white"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {agree && "✓"}
                </span>

                <span>
                  I agree to the{" "}
                  <span className="font-semibold text-[#08a84f]">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="font-semibold text-[#08a84f]">
                    Privacy Policy
                  </span>
                </span>
              </button>

              {formErrors.agree && (
                <p className="mt-1 text-[12px] font-medium text-red-500">
                  {formErrors.agree}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-5 flex h-[46px] w-full items-center justify-center rounded-lg bg-[#08a84f] text-[15px] font-bold text-white shadow-sm transition hover:bg-[#079447] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>

              <p className="mt-5 text-center text-[14px] text-slate-600">
                Already have an account?{" "}
                <Link to={ROUTES.LOGIN} className="font-bold text-[#08a84f]">
                  Login
                </Link>
              </p>
            </form>
          </div>

          <div className="mx-auto mt-3 grid w-full max-w-[700px] gap-3 text-slate-600 sm:grid-cols-3">
            <SecurityItem icon={<FiShield />} text="256-bit SSL Secured" />
            <SecurityItem icon={<FiLock />} text="Your Data is 100% Safe" />
            <SecurityItem icon={<FiHeadphones />} text="24/7 Support" />
          </div>
        </section>
      </div>
    </main>
  );
};

const InputField = ({
  label,
  icon,
  placeholder,
  name,
  value,
  onChange,
  disabled,
  error,
  helperText,
  type = "text",
}) => {
  return (
    <div>
      <label className="text-[12.5px] font-bold text-slate-900">{label}</label>

      <div
        className={`mt-1.5 flex h-[44px] items-center gap-3 rounded-lg border px-4 text-slate-500 ${
          error ? "border-red-400" : "border-slate-200"
        }`}
      >
        <span className="text-[17px]">{icon}</span>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className="h-full w-full bg-transparent text-[13px] outline-none placeholder:text-slate-500 disabled:cursor-not-allowed"
        />
      </div>

      {(error || helperText) && (
        <p
          className={`mt-1 text-[12px] ${
            error ? "font-medium text-red-500" : "text-slate-500"
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

const PhoneField = ({ name, value, onChange, disabled, error }) => {
  return (
    <div>
      <label className="text-[12.5px] font-bold text-slate-900">
        Phone Number
      </label>

      <div
        className={`mt-1.5 flex h-[44px] overflow-hidden rounded-lg border ${
          error ? "border-red-400" : "border-slate-200"
        }`}
      >
        <div className="flex items-center gap-2 border-r border-slate-200 px-4 text-slate-500">
          <FiPhone className="text-[17px]" />
          <span className="text-[13px]">+91</span>
        </div>

        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          maxLength={10}
          placeholder="Enter your phone number"
          className="h-full w-full px-4 text-[13px] outline-none placeholder:text-slate-500 disabled:cursor-not-allowed"
        />
      </div>

      <p
        className={`mt-1 text-[12px] ${
          error ? "font-medium text-red-500" : "text-slate-500"
        }`}
      >
        {error || "Optional 10-digit Indian mobile number"}
      </p>
    </div>
  );
};

const PasswordField = ({
  label,
  placeholder,
  name,
  value,
  onChange,
  disabled,
  error,
  helperText,
  showPassword,
  onTogglePassword,
}) => {
  return (
    <div>
      <label className="text-[12.5px] font-bold text-slate-900">{label}</label>

      <div
        className={`mt-1.5 flex h-[44px] items-center gap-3 rounded-lg border px-4 text-slate-500 ${
          error ? "border-red-400" : "border-slate-200"
        }`}
      >
        <FiLock className="text-[17px]" />

        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className="h-full w-full bg-transparent text-[13px] outline-none placeholder:text-slate-500 disabled:cursor-not-allowed"
        />

        <button
          type="button"
          onClick={onTogglePassword}
          disabled={disabled}
          className="text-slate-500 disabled:cursor-not-allowed"
        >
          {showPassword ? (
            <FiEye className="text-[17px]" />
          ) : (
            <FiEyeOff className="text-[17px]" />
          )}
        </button>
      </div>

      {(error || helperText) && (
        <p
          className={`mt-1 text-[12px] ${
            error ? "font-medium text-red-500" : "text-slate-500"
          }`}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
};

const SelectField = ({
  label,
  icon,
  name,
  value,
  onChange,
  disabled,
  error,
}) => {
  return (
    <div>
      <label className="text-[12.5px] font-bold text-slate-900">{label}</label>

      <div
        className={`mt-1.5 flex h-[44px] items-center gap-3 rounded-lg border px-4 text-slate-500 ${
          error ? "border-red-400" : "border-slate-200"
        }`}
      >
        <span className="text-[17px]">{icon}</span>

        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="h-full w-full bg-transparent text-[13px] outline-none disabled:cursor-not-allowed"
        >
          <option value="">Select {label.toLowerCase()}</option>
        </select>
      </div>

      {error && (
        <p className="mt-1 text-[12px] font-medium text-red-500">{error}</p>
      )}
    </div>
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

export default RegisterPage;
