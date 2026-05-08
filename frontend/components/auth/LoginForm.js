// Starter file
"use client";

import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/redux/slices/authSlice";
import { useRouter} from "next/navigation";
import Link from 'next/link'

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
    <form
      onSubmit={handleSubmit}
      className="
        bg-white
        p-8
        rounded-3xl
        shadow-xl
        w-full
        max-w-md
        flex
        flex-col
        gap-5
      "
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold">
          Welcome Back
        </h2>

        <p className="text-gray-500 mt-2">
          Login to continue
        </p>
      </div>

      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />

      <Button type="submit" disabled={loading}>
        {loading ? "Loading..." : "Login"}
      </Button>
      <div>not a user? <Link href="/auth/register" className="text-blue-500">Register</Link></div>
    </form>
  );
};

export default LoginForm;