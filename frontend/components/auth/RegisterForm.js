// Starter file
"use client";

import React, { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { register } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";

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
          Create Account
        </h2>

        <p className="text-gray-500 mt-2">
          Register to continue
        </p>
      </div>

      <Input
        label="Name"
        placeholder="Enter your name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />

      <Input
        label="Email"
        type="email"
        placeholder="Enter email"
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
        {loading ? "Loading..." : "Register"}
      </Button>
    </form>
  );
};

export default RegisterForm;