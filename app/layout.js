import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Police principale : Inter (définie dans DECISION.md — Lot 2)
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "TopBudget — Ma Gestion de Budget simplifiée",
    template: "%s — TopBudget",
  },
  description: "TopBudget vous aide à gérer vos budgets personnels, suivre vos dépenses et analyser vos habitudes financières.",
  keywords: ["budget", "gestion financière", "dépenses", "épargne", "finances personnelles"],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css" />
      </head>
      
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
