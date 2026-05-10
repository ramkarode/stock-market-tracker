"use client";

import React from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const Protected = ({ children, access = "dashboard" }) => {
  const router = useRouter();
  const { isLoggedIn, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isLoggedIn && access === "login") {
    router.push("/dashboard");
  }

  if (!isLoggedIn && access === "dashboard") {
    router.push("/auth/login");
  } 

  return children;
};

export default Protected;
