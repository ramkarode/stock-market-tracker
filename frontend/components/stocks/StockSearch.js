// Starter file
"use client";

import { Search } from "lucide-react";

const recentStocks = [
  {
    name: "WAAREE",
    change: "+0.42%",
    positive: true,
  },

  {
    name: "JSWENERGY",
    change: "-1.94%",
    positive: false,
  },

  {
    name: "IOC",
    change: "+1.22%",
    positive: true,
  },

  {
    name: "RENUKA",
    change: "-3.12%",
    positive: false,
  },
];

const StockSearch = () => {
  return (
    <section className="px-5 pt-6">

      {/* SEARCH */}
      <div
        className="
          flex
          items-center
          gap-3
          bg-white
          border
          border-gray-200
          rounded-2xl
          px-4
          py-4
        "
      >
        <Search
          size={20}
          className="text-gray-400"
        />

        <input
          type="text"
          placeholder="Search stocks..."
          className="
            w-full
            outline-none
            text-sm
          "
        />
      </div>



      {/* RECENT STOCKS */}
      <div className="mt-8">

        <h2
          className="
            text-2xl
            font-semibold
            text-[#44475b]
            mb-5
          "
        >
          Recently viewed
        </h2>

        <div
          className="
            flex
            gap-5
            overflow-x-auto
          "
        >
          {recentStocks.map((stock, index) => (
            <div
              key={index}
              className="
                min-w-[90px]
                flex
                flex-col
                items-center
              "
            >
              <div
                className="
                  w-16
                  h-16
                  rounded-2xl
                  bg-white
                  border
                  border-gray-200
                  flex
                  items-center
                  justify-center
                  font-semibold
                "
              >
                {stock.name[0]}
              </div>

              <p
                className="
                  mt-3
                  text-sm
                  font-medium
                "
              >
                {stock.name}
              </p>

              <p
                className={`
                  text-sm
                  mt-1
                  ${
                    stock.positive
                      ? "text-green-500"
                      : "text-red-500"
                  }
                `}
              >
                {stock.change}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default StockSearch;