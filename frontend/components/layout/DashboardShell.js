"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";
import useSocket from "../../hooks/useSocket";
import { useEffect, useState } from "react";

const DashboardShell = ({ children }) => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const socket = useSocket(userId); // Initialize the socket connection

  return (
    <div className="min-h-screen max-w-5xl mx-auto bg-[#fafafa]">
      {/* TOP NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="pb-24">{children}</main>

      {/* MOBILE FOOTER */}
      <Footer />
    </div>
  );
};

export default DashboardShell;
