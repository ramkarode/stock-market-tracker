// Starter file
"use client";

const HoldingCard = ({
  symbol,
  company,
  invested,
  current,
  pnl,
  positive = true,
}) => {
  return (
    <div
      className="
        bg-white
        border
        border-gray-200
        rounded-[28px]
        p-5
      "
    >
      {/* TOP */}
      <div className="flex items-center gap-4">
        
        {/* LOGO */}
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
            text-lg
          "
        >
          {symbol[0]}
        </div>

        {/* INFO */}
        <div>
          <h2
            className="
              text-lg
              font-semibold
              text-[#44475b]
            "
          >
            {symbol}
          </h2>

          <p
            className="
              text-sm
              text-gray-500
            "
          >
            {company}
          </p>
        </div>
      </div>



      {/* VALUES */}
      <div className="mt-8 space-y-4">

        <div className="flex justify-between">
          <span className="text-gray-500">
            Invested
          </span>

          <span className="font-medium">
            {invested}
          </span>
        </div>



        <div className="flex justify-between">
          <span className="text-gray-500">
            Current
          </span>

          <span className="font-medium">
            {current}
          </span>
        </div>



        <div className="flex justify-between">
          <span className="text-gray-500">
            P&L
          </span>

          <span
            className={`
              font-semibold
              ${
                positive
                  ? "text-green-500"
                  : "text-red-500"
              }
            `}
          >
            {pnl}
          </span>
        </div>

      </div>
    </div>
  );
};

export default HoldingCard;