// Starter file
import PortfolioSummary from "@/components/portfolio/PortfolioSummary";

import HoldingCard from "@/components/portfolio/HoldingCard";

import HoldingsTable from "@/components/portfolio/HoldingsTable";

const PortfolioPage = () => {
  return (
    <div className="px-5 py-6 pb-28">

      {/* HEADING */}
      <div className="mb-8">

        <h1
          className="
            text-4xl
            font-semibold
            text-[#44475b]
          "
        >
          Your Portfolio
        </h1>

        <p className="text-gray-500 mt-2">
          Track your investments & returns
        </p>

      </div>



      {/* SUMMARY + CARD */}
      <div
        className="
          grid
          grid-cols-1
          xl:grid-cols-2
          gap-6
        "
      >
        <PortfolioSummary />



        <HoldingCard
          symbol="TCS"
          company="Tata Consultancy"
          invested="₹41,040"
          current="₹46,500"
          pnl="+₹5,460"
          positive={true}
        />
      </div>



      {/* HOLDINGS TABLE */}
      <div className="mt-8">
        <HoldingsTable />
      </div>

    </div>
  );
};

export default PortfolioPage;