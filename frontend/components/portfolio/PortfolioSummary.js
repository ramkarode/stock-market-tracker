// Starter file
"use client";

const PortfolioSummary = () => {
  return (
    <section
      className="
        bg-white
        border
        border-gray-200
        rounded-[30px]
        p-6
      "
    >
      {/* TOP */}
      <div>
        <p
          className="
            text-gray-500
            text-sm
          "
        >
          Portfolio Value
        </p>

        <h2
          className="
            text-4xl
            font-semibold
            mt-3
            text-[#44475b]
          "
        >
          ₹2,45,000
        </h2>

        <p
          className="
            mt-3
            text-green-500
            font-medium
          "
        >
          +₹12,450 (5.35%)
        </p>
      </div>



      {/* ALLOCATION */}
      <div className="mt-10">

        <div
          className="
            flex
            items-center
            justify-between
            py-3
          "
        >
          <div className="flex items-center gap-3">
            
            <div
              className="
                w-4
                h-4
                rounded-full
                bg-green-500
              "
            />

            <span className="text-gray-600">
              Large Cap
            </span>
          </div>

          <span className="font-medium">
            65%
          </span>
        </div>



        <div
          className="
            flex
            items-center
            justify-between
            py-3
          "
        >
          <div className="flex items-center gap-3">
            
            <div
              className="
                w-4
                h-4
                rounded-full
                bg-blue-500
              "
            />

            <span className="text-gray-600">
              Mid Cap
            </span>
          </div>

          <span className="font-medium">
            20%
          </span>
        </div>



        <div
          className="
            flex
            items-center
            justify-between
            py-3
          "
        >
          <div className="flex items-center gap-3">
            
            <div
              className="
                w-4
                h-4
                rounded-full
                bg-purple-500
              "
            />

            <span className="text-gray-600">
              Small Cap
            </span>
          </div>

          <span className="font-medium">
            15%
          </span>
        </div>

      </div>
    </section>
  );
};

export default PortfolioSummary;