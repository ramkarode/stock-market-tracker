"use client";

import Link from "next/link";

import {
  ChartNoAxesCombined,
  Eye,
  Wallet,
  Bell,
  User,
} from "lucide-react";

import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Stocks",
      icon: ChartNoAxesCombined,
      path: "/dashboard",
    },

    {
      title: "Watchlist",
      icon: Eye,
      path: "/dashboard/watchlist",
    },

    {
      title: "Portfolio",
      icon: Wallet,
      path: "/dashboard/portfolio",
    },

    {
      title: "Alerts",
      icon: Bell,
      path: "/dashboard/alerts",
    },

    // {
    //   title: "Profile",
    //   icon: User,
    //   path: "/dashboard/profile",
    // },
  ];

  return (
    <footer
      className="
        fixed
        bottom-0
        left-0
        right-0
        bg-white
        border-t
        border-gray-200
        h-20
        flex
        items-center
        justify-around
        z-50
      "
    >
      {navItems.map((item, index) => {
        const Icon = item.icon;

        const isActive =
          pathname === item.path;

        return (
          <Link
            key={index}
            href={item.path}
            className="
              flex
              flex-col
              items-center
            "
          >
            <Icon
              size={24}
              className={
                isActive
                  ? "text-blue-500"
                  : "text-gray-500"
              }
            />

            <span
              className={`
                text-xs
                mt-1
                ${
                  isActive
                    ? "text-blue-500"
                    : "text-gray-500"
                }
              `}
            >
              {item.title}
            </span>
          </Link>
        );
      })}
    </footer>
  );
};

export default Footer;