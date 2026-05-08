"use client";

import { useState } from "react";

import {
  Search,
  Grid2X2,
  X,
} from "lucide-react";

const Navbar = () => {
  const [showSearch, setShowSearch] =
    useState(false);

  return (
    <header
      className="
        sticky
        top-0
        z-50
        bg-white
        border-b
        border-gray-100
      "
    >
      {/* TOP */}
      <div
        className="
          flex
          items-center
          justify-between
          px-5
          py-4
        "
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">
          
          <div
            className="
              w-12
              h-12
              rounded-full
              bg-gradient-to-r
              from-cyan-400
              to-green-400
            "
          />

          <h1
            className="
              text-2xl
              font-semibold
              text-[#44475b]
            "
          >
            Stocks
          </h1>
        </div>



        {/* RIGHT */}
        <div className="flex items-center gap-4">

          {/* SEARCH */}
          <div
            className={`
              flex
              items-center
              overflow-hidden
              transition-all
              duration-300
              bg-[#f5f7fb]
              rounded-full

              ${
                showSearch
                  ? "w-[240px] px-4 py-2"
                  : "w-0"
              }
            `}
          >
            <input
              type="text"
              placeholder="Search stocks..."
              className="
                bg-transparent
                outline-none
                w-full
                text-sm
              "
            />

            <X
              size={18}
              className="
                cursor-pointer
                text-gray-500
              "
              onClick={() =>
                setShowSearch(false)
              }
            />
          </div>



          {/* SEARCH ICON */}
          {!showSearch && (
            <Search
              size={24}
              className="
                text-[#44475b]
                cursor-pointer
              "
              onClick={() =>
                setShowSearch(true)
              }
            />
          )}



          {/* GRID */}
          <Grid2X2
            size={24}
            className="
              text-[#44475b]
              cursor-pointer
            "
          />



          {/* PROFILE */}
          <div
            className="
              w-10
              h-10
              rounded-full
              bg-gray-200
            "
          />
        </div>
      </div>



      {/* MARKET STRIP */}
      <div
        className="
          flex
          items-center
          gap-8
          overflow-x-auto
          px-5
          py-3
          text-sm
          border-t
          border-gray-100
        "
      >
        <div className="flex items-center gap-2 whitespace-nowrap">
          
          <span className="font-semibold">
            NIFTY 50
          </span>

          <span>24,154.60</span>

          <span className="text-red-500">
            -172.05
          </span>
        </div>



        <div className="flex items-center gap-2 whitespace-nowrap">
          
          <span className="font-semibold">
            SENSEX
          </span>

          <span>77,248.75</span>

          <span className="text-red-500">
            -595.77
          </span>
        </div>

      </div>
    </header>
  );
};

export default Navbar;