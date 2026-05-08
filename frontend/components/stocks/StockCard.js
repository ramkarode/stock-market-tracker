// Starter file
"use client";

const StockCard = ({
  company,
  price,
  profit,
  positive = true,
}) => {
  return (
    <div
      className="
        bg-white
        border
        border-gray-200
        rounded-[30px]
        p-5
        min-h-[220px]
        flex
        flex-col
        justify-between
      "
    >
      {/* LOGO */}
      <div
        className="
          w-16
          h-16
          rounded-2xl
          bg-gray-100
          flex
          items-center
          justify-center
          text-lg
          font-bold
        "
      >
        {company[0]}
      </div>



      {/* DETAILS */}
      <div>
        <h3
          className="
            text-2xl
            font-medium
            text-[#44475b]
          "
        >
          {company}
        </h3>

        <p
          className="
            text-3xl
            font-semibold
            mt-6
          "
        >
          {price}
        </p>

        <p
          className={`
            mt-2
            text-xl
            font-medium
            ${
              positive
                ? "text-green-500"
                : "text-red-500"
            }
          `}
        >
          {profit}
        </p>
      </div>
    </div>
  );
};

export default StockCard;