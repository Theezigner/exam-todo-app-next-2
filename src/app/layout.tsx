"use client";

import type { ReactNode } from "react";
import { ThemeToggle } from "./components/themeToggle";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./page";
import "./globals.css";

type LayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <main className="relative max-w-lg mx-auto p-4">
            <header className="flex flex-col">
              <div className="flex flex-row gap-2 absolute items-center right-6 ">
                <ThemeToggle />
              </div>
              <h1 className="text-2xl font-bold mt-10 mb-4 text-center">
                Todo App
              </h1>
            </header>
            {children}
          </main>
        </QueryClientProvider>
      </body>
    </html>
  );
}
