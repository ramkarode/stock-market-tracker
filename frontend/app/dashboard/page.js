const DashboardPage = () => {
  return (
    <div className="space-y-6">

      {/* HEADING */}
      <div>
        <h1
          className="
            text-3xl
            font-semibold
            text-gray-900
          "
        >
          Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Track your investments & alerts
        </p>
      </div>



      {/* TOP CARDS */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
      >
        {/* CARD */}
        <div
          className="
            bg-white
            border
            border-gray-100
            rounded-2xl
            p-6
          "
        >
          <p className="text-gray-500 text-sm">
            Portfolio Value
          </p>

          <h2
            className="
              text-3xl
              font-semibold
              mt-3
            "
          >
            ₹2,45,000
          </h2>

          <p className="text-green-500 mt-3 text-sm">
            +12.5%
          </p>
        </div>



        <div
          className="
            bg-white
            border
            border-gray-100
            rounded-2xl
            p-6
          "
        >
          <p className="text-gray-500 text-sm">
            Today's Profit
          </p>

          <h2
            className="
              text-3xl
              font-semibold
              mt-3
            "
          >
            ₹12,400
          </h2>

          <p className="text-green-500 mt-3 text-sm">
            +4.2%
          </p>
        </div>



        <div
          className="
            bg-white
            border
            border-gray-100
            rounded-2xl
            p-6
          "
        >
          <p className="text-gray-500 text-sm">
            Active Alerts
          </p>

          <h2
            className="
              text-3xl
              font-semibold
              mt-3
            "
          >
            8
          </h2>

          <p className="text-red-500 mt-3 text-sm">
            2 Triggered
          </p>
        </div>



        <div
          className="
            bg-white
            border
            border-gray-100
            rounded-2xl
            p-6
          "
        >
          <p className="text-gray-500 text-sm">
            Watchlist Stocks
          </p>

          <h2
            className="
              text-3xl
              font-semibold
              mt-3
            "
          >
            15
          </h2>

          <p className="text-green-500 mt-3 text-sm">
            +3 Added Today
          </p>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;