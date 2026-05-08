"use client";

import Link from "next/link";

import {
  LayoutDashboard,
  LineChart,
  Bell,
  Wallet,
  User,
} from "lucide-react";

import { usePathname } from "next/navigation";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },

  {
    title: "Watchlist",
    icon: LineChart,
    path: "/dashboard/watchlist",
  },

  {
    title: "Alerts",
    icon: Bell,
    path: "/dashboard/alerts",
  },

  {
    title: "Portfolio",
    icon: Wallet,
    path: "/dashboard/portfolio",
  },

  {
    title: "Profile",
    icon: User,
    path: "/dashboard/profile",
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside
      className="
        hidden
        lg:flex
        w-[240px]
        bg-white
        border-r
        border-gray-100
        flex-col
        px-5
        py-6
      "
    >
      {/* LOGO */}
      <div className="mb-10">
        <h1
          className="
            text-3xl
            font-bold
            text-green-500
            tracking-tight
          "
        >
          groww
        </h1>
      </div>

      {/* NAVIGATION */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.path;

          return (
            <Link
              key={index}
              href={item.path}
              className={`
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                text-sm
                font-medium
                transition-all

                ${
                  isActive
                    ? "bg-green-50 text-green-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                }
              `}
            >
              <Icon size={20} />

              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;