import type { Metadata } from "next";
import "../globals.css";
import Providers from "./providers";
import { UserProvider } from "@/contexts/UserContext";
import { Toaster } from "react-hot-toast";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "پنل روان‌درمانگر - ابراز",
  description: "پنل روان‌درمانگر - ابراز",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="flex-1 lg:mr-80 overflow-y-auto h-screen bg-gray-100 dark:bg-gray-900">
        <Toaster />
        <Providers>
          <UserProvider>
            <ThemeProvider>
              <Sidebar />
              <SidebarProvider>{children}</SidebarProvider>
            </ThemeProvider>
          </UserProvider>
        </Providers>
      </body>
    </html>
  );
}
