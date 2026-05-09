"use client";

import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { register } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BarChart3, ArrowUpRight } from "lucide-react";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
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

    const result = await dispatch(register(formData));

    if (result.meta.requestStatus === "fulfilled") {
      router.push("/auth/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center   relative overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="
          relative
          z-10
          bg-white
          border border-gray-100
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
        {/* Branding */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200">
            <BarChart3 className="text-white" size={30} />
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 mt-4 tracking-wide">
            STOCKR
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            Smart investing starts here
          </p>
        </div>

        {/* Heading */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>

          <p className="text-gray-500 mt-1 text-sm">
            Join STOCKR and manage your investments smarter
          </p>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="
              bg-gray-50
              border border-gray-200
              text-gray-900
              focus:border-emerald-500
              focus:ring-emerald-500
            "
          />

          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="
              bg-gray-50
              border border-gray-200
              text-gray-900
              focus:border-emerald-500
              focus:ring-emerald-500
            "
          />

          <Input
            label="Password"
            type="password"
            placeholder="Create password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="
              bg-gray-50
              border border-gray-200
              text-gray-900
              focus:border-emerald-500
              focus:ring-emerald-500
            "
          />
        </div>

        {/* Terms */}
        <div className="text-sm text-gray-500 leading-relaxed">
          By creating an account, you agree to our{" "}
          <span className="text-emerald-600 font-medium cursor-pointer">
            Terms
          </span>{" "}
          &{" "}
          <span className="text-emerald-600 font-medium cursor-pointer">
            Privacy Policy
          </span>
          .
        </div>

        {/* Button */}
        <Button
          type="submit"
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-600 text-white
            font-semibold
            py-3
            rounded-xl
            transition-all
            duration-300
            shadow-lg
            shadow-emerald-200
          "
        >
          <div className="flex items-center justify-center gap-2">
            <ArrowUpRight size={18} />
            {loading ? "Creating Account..." : "Create Account"}
          </div>
        </Button>

        {/* Login Redirect */}
        <div className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-emerald-600 hover:text-emerald-700 font-semibold"
          >
            Login
          </Link>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            Real-time analytics • Portfolio insights • Secure platform
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
