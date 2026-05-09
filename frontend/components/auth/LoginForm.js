"use client";

import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TrendingUp, BarChart3 } from "lucide-react";

const LoginForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(login(formData));

    if (result.meta.requestStatus === "fulfilled") {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#ffffff] px-4 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[300px] h-[300px] bg-emerald-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-120px] right-[-120px] w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-3xl"></div>

      <form
        onSubmit={handleSubmit}
        className="
          relative
          z-10
          bg-white
          backdrop-blur-xl
          border border-white/10
          p-8
          rounded-3xl
          shadow-2xl
          w-full
          max-w-md
          flex
          flex-col
          gap-5
        "
      >
        {/* Logo + Branding */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <BarChart3 className="text-black" size={30} />
          </div>

          <h1 className="text-4xl font-extrabold text-black mt-4 tracking-wide">
            STOCKR
          </h1>

          <p className="text-gray-900 mt-2 text-sm">
            Smart stock insights & portfolio tracking
          </p>
        </div>


        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="
              bg-white/10
              border border-white/10
              text-white
              placeholder:text-gray-500
            "
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="
              bg-white/10
              border border-white/10
              text-white
              placeholder:text-gray-500
            "
          />
        </div>

        {/* Forgot Password */}
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-emerald-400 hover:text-emerald-300 transition"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Button */}
        <Button
          type="submit"
          disabled={loading}
          className="
            bg-emerald-500
            hover:bg-emerald-600
            text-white
            font-semibold
            py-3
            rounded-xl
            transition-all
            duration-300
            shadow-lg
            shadow-emerald-500/20
          "
        >
          <div className="flex items-center justify-center gap-2">
            <TrendingUp size={18} />
            {loading ? "Signing In..." : "Login to STOCKR"}
          </div>
        </Button>

        {/* Register */}
        <div className="text-center text-gray-400 text-sm">
          New to STOCKR?{" "}
          <Link
            href="/auth/register"
            className="text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Create Account
          </Link>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 text-center">
          <p className="text-xs text-gray-500">
            Real-time market tracking • AI insights • Secure trading
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;