"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import { Provider } from "react-redux";
import store from "./redux/store";
import styled from "styled-components";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Supporto Studenti",
//   description: "un'applicazione per il supporto studenti",
// };

const StyledBody = styled.div`
  background-color: aliceblue;
  height: 100%;
`;

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
            href="https://cdn3.vectorstock.com/i/1000x1000/52/82/book-icon-books-in-various-angles-vector-21995282.jpg"
          />
          <title>Supporto Studenti</title>
        </head>

        <body className={inter.className} suppressHydrationWarning={true}>
          <StyledBody>
            <Header />
            {children}
          </StyledBody>
        </body>
      </html>
    </Provider>
  );
}
