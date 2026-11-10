import type { Metadata } from "next";
import "./globals.css";
import AppTheme from "./components/AppTheme";
import AppHeader from "./components/AppHeader";

export const metadata: Metadata = {
  title: "California Funding Map",
  description: "Data center and AI funding versus school and library funding in California",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <AppTheme>
          <AppHeader />
          {children}
        </AppTheme>
      </body>
    </html>
  );
}
