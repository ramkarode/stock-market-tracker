import { Confirm, Notify } from "notiflix";
import React, { useEffect } from "react";
import { logoutUser } from "../../services/apiCollections";

const Navbar = () => {
  const handleLogout = async () => {
    try {
      Confirm.show(
        "Logout",
        "are you sure to logout?",
        "Logout",
        "cancel",
        async () => {
          await logoutUser();
          Notify.success("logout successfully");
        },
        () => {
          Notify.info("logout aborted!");
        },
      );
    } catch (error) {
      console.log(error.message);
      Notify.error("Something went wrong. Try again after some time.");
    }
  };

  useEffect(() => {
    Confirm.init({
      // backgroundColor: "black",
      okButtonBackground: "red",
      okButtonColor: "white",
      cancelButtonBackground: "black",
      cancelButtonColor: "white",
    });
  }, []);

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13l4-4 4 4 4-6 4 4"
              />
            </svg>
          </div>
          <span className="text-base font-bold text-slate-900 tracking-tight">
            Stockr
          </span>
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-1 rounded-md text-white "
          >
            Logout
          </button>
        </div>

        {/* {watchlist.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span className="text-xs bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-full">
                ★ {watchlist.length} watchlist
              </span>
            </div>
          )} */}
      </div>
    </header>
  );
};

export default Navbar;
