import "./globals.css";

import ReduxProvider from "@/redux/provider";

import { Toaster } from "react-hot-toast";
import InitialDataLoader from "@/components/InitialDataLoader";

export const metadata = {
  title: "Stock Market App",
  description: "Production Grade App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <InitialDataLoader />
          <Toaster position="top-right" />

          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}