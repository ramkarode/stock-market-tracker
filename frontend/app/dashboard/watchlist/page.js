// Starter file
import StockSearch from "@/components/stocks/StockSearch";

import WatchlistTable from "@/components/stocks/WatchlistTable";

import StockCard from "@/components/stocks/StockCard";

const WatchlistPage = () => {
  return (
    <div className="pb-28">

      {/* SEARCH */}
      <StockSearch />



      {/* PAGE HEADING */}
      <section className="px-5 mt-10">

        <h1
          className="
            text-4xl
            font-semibold
            text-[#44475b]
          "
        >
          Your Watchlist
        </h1>

        <p className="text-gray-500 mt-2">
          Track your favourite stocks
        </p>

      </section>



      {/* WATCHLIST TABLE */}
      <section className="px-5 mt-8">
        <WatchlistTable />
      </section>



      {/* TRENDING STOCKS */}
      <section className="px-5 mt-10">

        <h2
          className="
            text-3xl
            font-semibold
            text-[#44475b]
            mb-6
          "
        >
          Trending Stocks
        </h2>

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-5
          "
        >
          <StockCard
            company="Adani Power"
            price="₹752.50"
            profit="+5.22%"
            positive={true}
          />



          <StockCard
            company="IREDA"
            price="₹184.10"
            profit="+2.65%"
            positive={true}
          />



          <StockCard
            company="Zomato"
            price="₹244.60"
            profit="-1.12%"
            positive={false}
          />



          <StockCard
            company="Suzlon"
            price="₹62.80"
            profit="+8.15%"
            positive={true}
          />
        </div>

      </section>

    </div>
  );
};

export default WatchlistPage;