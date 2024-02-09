"use client"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { Provider } from 'react-redux';
import store from "./redux/store"

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Supporto Studenti",
//   description: "un'applicazione per il supporto studenti",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Provider store={store}>
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="https://png.pngtree.com/png-vector/20190725/ourmid/pngtree-vector-book-icon-png-image_1577305.jpg"
        />
        <title>Supporto Studenti</title>
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
          <Header/>
          {children}
        </body>
    </html>
    </Provider>
  );
}
