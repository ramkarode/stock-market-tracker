// Starter file
"use client";

const holdings = [
  {
    symbol: "TCS",
    qty: 12,
    avg: "₹3,420",
    ltp: "₹3,875",
    pnl: "+₹5,460",
    positive: true,
  },

  {
    symbol: "RELIANCE",
    qty: 20,
    avg: "₹2,500",
    ltp: "₹2,856",
    pnl: "+₹7,120",
    positive: true,
  },

  {
    symbol: "HDFCBANK",
    qty: 15,
    avg: "₹1,750",
    ltp: "₹1,678",
    pnl: "-₹1,080",
    positive: false,
  },
];

const HoldingsTable = () => {
  return (
    <section
      className="
        bg-white
        border
        border-gray-200
        rounded-[30px]
        overflow-hidden
      "
    >
      {/* HEADER */}
      <div
        className="
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
          Your Holdings
        </h2>
      </div>



      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>
            <tr
              className="
                text-left
                text-gray-500
                text-sm
                border-b
                border-gray-100
              "
            >
              <th className="px-6 py-4">
                Stock
              </th>

              <th className="px-6 py-4">
                Qty
              </th>

              <th className="px-6 py-4">
                Avg
              </th>

              <th className="px-6 py-4">
                LTP
              </th>

              <th className="px-6 py-4">
                P&L
              </th>
            </tr>
          </thead>



          <tbody>
            {holdings.map((stock, index) => (
              <tr
                key={index}
                className="
                  border-b
                  border-gray-100
                "
              >
                <td
                  className="
                    px-6
                    py-5
                    font-semibold
                    text-[#44475b]
                  "
                >
                  {stock.symbol}
                </td>

                <td className="px-6 py-5">
                  {stock.qty}
                </td>

                <td className="px-6 py-5">
                  {stock.avg}
                </td>

                <td className="px-6 py-5">
                  {stock.ltp}
                </td>

                <td
                  className={`
                    px-6
                    py-5
                    font-semibold
                    ${
                      stock.positive
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  `}
                >
                  {stock.pnl}
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>
    </section>
  );
};

export default HoldingsTable;