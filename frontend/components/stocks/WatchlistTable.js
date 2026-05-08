"use client";

const watchlistData = [
  {
    symbol: "TCS",
    company: "Tata Consultancy",
    price: "₹3,875.45",
    change: "+2.35%",
    positive: true,
  },

  {
    symbol: "RELIANCE",
    company: "Reliance Industries",
    price: "₹2,856.10",
    change: "+1.85%",
    positive: true,
  },

  {
    symbol: "HDFCBANK",
    company: "HDFC Bank",
    price: "₹1,678.90",
    change: "-0.45%",
    positive: false,
  },
];

const WatchlistTable = () => {
  return (
    <section
      className="
        bg-white
        rounded-[30px]
        border
        border-gray-200
        overflow-hidden
      "
    >
      {/* HEADER */}
      <div
        className="
          flex
          items-center
          justify-between
          px-6
          py-5
          border-b
          border-gray-100
        "
      >
        <h2
          className="
            text-2xl
            font-semibold
            text-[#44475b]
          "
        >
          Your Watchlist
        </h2>
      </div>



      {/* TABLE */}
      <div className="divide-y divide-gray-100">
        {watchlistData.map((stock, index) => (
          <div
            key={index}
            className="
              flex
              items-center
              justify-between
              px-6
              py-5
            "
          >
            {/* LEFT */}
            <div className="flex items-center gap-4">
              
              <div
                className="
                  w-14
                  h-14
                  rounded-2xl
                  bg-gray-100
                  flex
                  items-center
                  justify-center
                  font-bold
                "
              >
                {stock.symbol[0]}
              </div>

              <div>
                <h3 className="font-semibold">
                  {stock.symbol}
                </h3>

                <p
                  className="
                    text-sm
                    text-gray-500
                  "
                >
                  {stock.company}
                </p>
              </div>
            </div>



            {/* RIGHT */}
            <div className="text-right">
              
              <p className="font-semibold">
                {stock.price}
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
          </div>
        ))}
      </div>

    </section>
  );
};

export default WatchlistTable;