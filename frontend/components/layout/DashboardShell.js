"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";

const DashboardShell = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      
      {/* TOP NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="pb-24">
        {children}
      </main>

      {/* MOBILE FOOTER */}
      <Footer />
    </div>
  );
};

export default DashboardShell;