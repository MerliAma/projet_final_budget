import LandingPage from "@/composants/LandingPage"

export const metadata = {
  title: "TopBudget — Gérez vos finances simplement",
  description:
    "TopBudget vous aide à créer des budgets, suivre vos dépenses et analyser vos habitudes financières. Gratuit, sécurisé et responsive.",
  keywords: ["budget", "gestion financière", "dépenses", "épargne", "finances personnelles", "TopBudget"],
}

export default function Home() {
  //OpenDataBase(callback) — ancien appel IndexDB conservé en commentaire
  return <LandingPage />
}
