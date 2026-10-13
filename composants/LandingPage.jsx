"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  LuWallet,
  LuLayoutDashboard,
  LuPiggyBank,
  LuArrowLeftRight,
  LuChartPie,
  LuShieldCheck,
  LuTrendingUp,
  LuTarget,
  LuArrowRight,
  LuMenu,
  LuX,
  LuCircleCheck,
} from 'react-icons/lu'

/* ─────────────────────────────────────────────────────────────────────────────
   LandingPage
   Page d'accueil publique de TopBudget.
   Permet d'accéder aux pages Connexion (/) et Inscription (/Inscription).
   Design System : "Clarté Verte" — DECISION.md Lots 1 à 10
───────────────────────────────────────────────────────────────────────────── */

// ── Données statiques ───────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: LuPiggyBank,
    title: "Budgets intelligents",
    description:
      "Créez des enveloppes budgétaires par catégorie et visualisez votre avancement en temps réel grâce à des jauges de progression visuelles.",
    color: "#16a34a",
    bg: "#f0fdf4",
  },
  {
    icon: LuArrowLeftRight,
    title: "Suivi des transactions",
    description:
      "Enregistrez chaque dépense ou revenu, filtrez par budget et comprenez où va réellement votre argent chaque mois.",
    color: "#2563eb",
    bg: "#eff6ff",
  },
  {
    icon: LuChartPie,
    title: "Statistiques détaillées",
    description:
      "Des graphiques clairs sur la répartition de vos dépenses et l'évolution de vos finances sur plusieurs mois.",
    color: "#d97706",
    bg: "#fffbeb",
  },
  {
    icon: LuLayoutDashboard,
    title: "Tableau de bord unifié",
    description:
      "Un coup d'œil suffit : solde disponible, montant dépensé, taux de maîtrise budgétaire et dernières opérations.",
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    icon: LuShieldCheck,
    title: "Sécurité Firebase",
    description:
      "Authentification Google ou email/mot de passe, chiffrement des données et accès personnalisé protégé.",
    color: "#0891b2",
    bg: "#ecfeff",
  },
  {
    icon: LuTrendingUp,
    title: "Santé budgétaire",
    description:
      "Diagnostics automatiques (\"Sous contrôle\", \"À surveiller\", \"Dépassé\") pour réagir avant qu'il ne soit trop tard.",
    color: "#16a34a",
    bg: "#f0fdf4",
  },
]

const ADVANTAGES = [
  "Gratuit et sans publicité",
  "Données sécurisées Firebase",
  "Interface 100 % responsive",
  "Connexion via Google",
  "Statistiques visuelles",
  "Mises à jour en temps réel",
]

/*const TESTIMONIALS = [
  {
    initials: "AM",
    name: "Aminata M.",
    role: "Consultante",
    text: "Depuis TopBudget, je sais exactement où part mon salaire. Les jauges de progression sont super claires.",
    color: "#16a34a",
  },
  {
    initials: "KB",
    name: "Kofi B.",
    role: "Étudiant",
    text: "J'avais du mal à tenir mon budget mensuel. Avec les alertes automatiques, j'anticipe mieux mes dépenses.",
    color: "#2563eb",
  },
  {
    initials: "FD",
    name: "Fatou D.",
    role: "Entrepreneur",
    text: "L'interface est propre et les statistiques m'ont aidée à identifier mes postes de dépenses inutiles.",
    color: "#d97706",
  },
]*/

// ── Composant NavBar ────────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0" aria-label="TopBudget — Accueil">
          <div className="bg-[#16a34a] p-2 rounded-xl shadow-sm">
            <LuWallet className="text-white text-lg" aria-hidden="true" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Top<span className="text-[#16a34a]">Budget</span>
          </span>
        </Link>

        {/* Navigation desktop */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Navigation principale">
          <a href="#fonctionnalites" className="text-sm font-medium text-slate-600 hover:text-[#16a34a] transition-colors">
            Fonctionnalités
          </a>
          <a href="#avantages" className="text-sm font-medium text-slate-600 hover:text-[#16a34a] transition-colors">
            Avantages
          </a>
          {/*<a href="#temoignages" className="text-sm font-medium text-slate-600 hover:text-[#16a34a] transition-colors">
            Témoignages
          </a>*/}
          <a href="#demarrer" className="text-sm font-medium text-slate-600 hover:text-[#16a34a] transition-colors">
            Demarrer
          </a>
        </nav>

        {/* CTA desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/connexion"
            id="lp-btn-connexion"
            className="text-sm font-semibold text-slate-700 hover:text-[#16a34a] transition-colors px-4 py-2 rounded-lg hover:bg-slate-100"
          >
            Se connecter
          </Link>
          <Link
            href="/Inscription"
            id="lp-btn-inscription"
            className="text-sm font-semibold bg-[#16a34a] hover:bg-[#15803d] text-white px-5 py-2 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            Commencer gratuitement
          </Link>
        </div>

        {/* Bouton hamburger mobile */}
        <button
          id="lp-btn-menu-mobile"
          type="button"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <LuX className="text-xl" /> : <LuMenu className="text-xl" />}
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-5 pb-5 pt-2 flex flex-col gap-3 animate-slide-up">
          <a
            href="#fonctionnalites"
            className="text-sm font-medium text-slate-700 py-2 border-b border-slate-100"
            onClick={() => setMenuOpen(false)}
          >
            Fonctionnalités
          </a>
          <a
            href="#avantages"
            className="text-sm font-medium text-slate-700 py-2 border-b border-slate-100"
            onClick={() => setMenuOpen(false)}
          >
            Avantages
          </a>
          {/*<a
            href="#temoignages"
            className="text-sm font-medium text-slate-700 py-2 border-b border-slate-100"
            onClick={() => setMenuOpen(false)}
          >
            Témoignages
          </a> */}
          <a
            href="#demarrer"
            className="text-sm font-medium text-slate-700 py-2 border-b border-slate-100"
            onClick={() => setMenuOpen(false)}
          >
            Demarrer
          </a>
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/"
              id="lp-btn-connexion-mobile"
              className="text-center text-sm font-semibold text-slate-700 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/Inscription"
              id="lp-btn-inscription-mobile"
              className="text-center text-sm font-semibold bg-[#16a34a] hover:bg-[#15803d] text-white py-2.5 rounded-xl transition-all shadow-sm"
            >
              Commencer gratuitement
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

// ── Mockup visuel du tableau de bord ────────────────────────────────────────
function DashboardMockup() {
  return (
    <div className="relative" aria-hidden="true">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg p-5 sm:p-6">
        {/* Topbar mockup */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="bg-[#16a34a] p-1.5 rounded-lg">
              <LuWallet className="text-white text-base" />
            </div>
            <span className="text-sm font-bold text-slate-800">TopBudget</span>
          </div>
          <div className="text-xs text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
            Octobre 2026
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-[#f0fdf4] rounded-2xl p-4 border border-[#bbf7d0]">
            <p className="text-[10px] font-semibold text-[#16a34a] uppercase tracking-wider mb-1">Disponible</p>
            <p className="text-xl font-bold text-[#14532d]">82 500</p>
            <p className="text-[10px] text-[#16a34a] mt-0.5">FCFA</p>
          </div>
          <div className="bg-[#fff7ed] rounded-2xl p-4 border border-orange-200">
            <p className="text-[10px] font-semibold text-orange-600 uppercase tracking-wider mb-1">Dépensé</p>
            <p className="text-xl font-bold text-orange-700">47 500</p>
            <p className="text-[10px] text-orange-500 mt-0.5">FCFA</p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Budget total</p>
            <p className="text-xl font-bold text-slate-800">130 000</p>
            <p className="text-[10px] text-slate-400 mt-0.5">FCFA</p>
          </div>
          <div className="bg-[#eff6ff] rounded-2xl p-4 border border-blue-200">
            <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider mb-1">Maîtrise</p>
            <p className="text-xl font-bold text-blue-700">63%</p>
            <p className="text-[10px] text-blue-500 mt-0.5">Équilibré ✓</p>
          </div>
        </div>

        {/* Barres de progression démo */}
        <div className="space-y-3">
          {[
            { label: "Alimentation", pct: 72, color: "#d97706" },
            { label: "Transport", pct: 45, color: "#16a34a" },
            { label: "Loisirs", pct: 90, color: "#f97316" },
          ].map(({ label, pct, color }) => (
            <div key={label}>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="font-medium text-slate-700">{label}</span>
                <span className="font-semibold" style={{ color }}>{pct}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badge flottant */}
      <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-[#16a34a] text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md border-2 border-white">
        Sous contrôle ✓
      </div>
    </div>
  )
}

// ── Section Hero ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden bg-[#f8fafc]">

      {/* Fond décoratif */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#16a34a]/6" />
        <div className="absolute top-20 -left-32 w-[400px] h-[400px] rounded-full bg-[#bbf7d0]/40" />
      </div>

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Texte */}
          <div className="flex-1 text-center lg:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-pulse" aria-hidden="true" />
              <span className="text-xs font-semibold text-[#15803d] uppercase tracking-wide">
                Gratuit · Sans publicité
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Reprenez le{" "}
              <span className="text-[#16a34a]">contrôle</span>{" "}
              de vos finances
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              TopBudget vous aide à créer des budgets, suivre vos dépenses et analyser vos habitudes
              financières — simplement, gratuitement, en toute sécurité.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
              <Link
                href="/Inscription"
                id="lp-hero-btn-inscription"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold bg-[#16a34a] hover:bg-[#15803d] text-white transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
              >
                Créer mon compte gratuitement
                <LuArrowRight className="text-lg" aria-hidden="true" />
              </Link>
              <Link
                href="/"
                id="lp-hero-btn-connexion"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-xs"
              >
                Se connecter
              </Link>
            </div>

            <p className="mt-6 text-xs text-slate-400 font-medium">
              Aucune carte bancaire requise · Accès immédiat
            </p>
          </div>

          {/* Illustration */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none animate-scale-in">
            <DashboardMockup />
          </div>

        </div>
      </div>
    </section>
  )
}

// ── Section Fonctionnalités ──────────────────────────────────────────────────
function FeaturesSection() {
  return (
    <section id="fonctionnalites" className="py-16 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block text-xs font-semibold text-[#16a34a] uppercase tracking-widest bg-[#f0fdf4] border border-[#bbf7d0] rounded-full px-4 py-1.5 mb-4">
            Fonctionnalités
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
            Un outil complet et intuitif pour gérer vos finances personnelles, comprendre vos habitudes et atteindre vos objectifs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {FEATURES.map(({ icon: Icon, title, description, color, bg }) => (
            <div
              key={title}
              className="group bg-[#f8fafc] hover:bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-6 transition-all duration-200 hover:shadow-md"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110"
                style={{ backgroundColor: bg }}
              >
                <Icon className="text-xl" style={{ color }} aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Section Avantages ────────────────────────────────────────────────────────
function AdvantagesSection() {
  return (
    <section id="avantages" className="py-16 sm:py-24 bg-[#14532d] overflow-hidden relative">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full bg-white/5" />
      </div>

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Texte */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block text-xs font-semibold text-[#bbf7d0] uppercase tracking-widest bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
              Pourquoi TopBudget ?
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Simple, sécurisé et efficace
            </h2>
            <p className="text-white/70 leading-relaxed mb-8">
              TopBudget a été conçu pour être accessible à tous, sans jargon financier. Commencez en 2 minutes
              et reprenez la main sur votre argent.
            </p>

            <ul className="space-y-3 mb-10">
              {ADVANTAGES.map((adv) => (
                <li key={adv} className="flex items-center gap-3 text-white/90 text-sm">
                  <LuCircleCheck className="text-[#16a34a] text-lg flex-shrink-0" aria-hidden="true" />
                  <span>{adv}</span>
                </li>
              ))}
            </ul>

            {/*<div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/Inscription"
                id="lp-adv-btn-inscription"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold bg-[#16a34a] hover:bg-[#15803d] text-white transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                Créer mon compte — c&apos;est gratuit
                <LuArrowRight className="text-base" aria-hidden="true" />
              </Link>
              <Link
                href="/connexion"
                id="lp-adv-btn-connexion"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-sm font-semibold text-white/90 bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
              >
                J&apos;ai déjà un compte
              </Link>
            </div>*/}
          </div>

          {/* Stat cards */}
          <div className="flex-1 w-full max-w-sm mx-auto lg:mx-0">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: LuTarget, value: "100%", label: "Gratuit", color: "#bbf7d0" },
                { icon: LuShieldCheck, value: "Firebase", label: "Sécurisé", color: "#93c5fd" },
                { icon: LuTrendingUp, value: "Temps réel", label: "Mis à jour", color: "#fde68a" },
                { icon: LuLayoutDashboard, value: "Responsive", label: "Sur tous écrans", color: "#c4b5fd" },
              ].map(({ icon: Icon, value, label, color }) => (
                <div
                  key={label}
                  className="bg-white/10 border border-white/20 rounded-2xl p-5 text-center hover:bg-white/15 transition-colors"
                >
                  <Icon className="text-2xl mx-auto mb-2" style={{ color }} aria-hidden="true" />
                  <p className="text-lg font-bold text-white leading-tight">{value}</p>
                  <p className="text-xs text-white/60 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

// ── Section Témoignages ──────────────────────────────────────────────────────
/*function TestimonialsSection() {
  return (
    <section id="temoignages" className="py-16 sm:py-24 bg-[#f8fafc]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-block text-xs font-semibold text-[#16a34a] uppercase tracking-widest bg-[#f0fdf4] border border-[#bbf7d0] rounded-full px-4 py-1.5 mb-4">
            Témoignages
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Ils gèrent mieux leur argent
          </h2>
          <p className="text-slate-500 max-w-md mx-auto">
            Découvrez comment TopBudget a aidé des utilisateurs à reprendre le contrôle de leurs finances.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {TESTIMONIALS.map(({ initials, name, role, text, color }) => (
            <div
              key={name}
              className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all duration-200"
            >
              <p className="text-sm text-slate-600 leading-relaxed mb-6 italic">
                &ldquo;{text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                >
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{name}</p>
                  <p className="text-xs text-slate-400">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}*/

// ── Section CTA final ────────────────────────────────────────────────────────
function CtaSection() {
  return (
    <section className="py-16 sm:py-24 bg-white" id="demarrer">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-3xl p-10 sm:p-14">
          <div className="bg-[#16a34a] w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
            <LuWallet className="text-white text-2xl" aria-hidden="true" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Prêt à démarrer ?
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed max-w-lg mx-auto">
            Créez votre compte en moins de 2 minutes et commencez à suivre vos budgets dès aujourd&apos;hui.
            Aucune carte bancaire requise.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/Inscription"
              id="lp-cta-btn-inscription"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold bg-[#16a34a] hover:bg-[#15803d] text-white transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              Créer mon compte gratuitement
              <LuArrowRight className="text-lg" aria-hidden="true" />
            </Link>
            <Link
              href="/"
              id="lp-cta-btn-connexion"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-all shadow-xs"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white py-10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-[#16a34a] p-1.5 rounded-lg">
              <LuWallet className="text-white text-base" aria-hidden="true" />
            </div>
            <span className="text-base font-bold tracking-tight">
              Top<span className="text-[#16a34a]">Budget</span>
            </span>
          </div>

          <nav aria-label="Navigation pied de page" className="flex items-center gap-6 text-sm text-white/50">
            <Link href="/connexion" className="hover:text-white transition-colors">
              Connexion
            </Link>
            <Link href="/Inscription" className="hover:text-white transition-colors">
              Inscription
            </Link>
            <Link href="/mot-de-passe-oublie" className="hover:text-white transition-colors">
              Mot de passe oublié
            </Link>
          </nav>

          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} TopBudget
          </p>
        </div>
      </div>
    </footer>
  )
}

// ── Export principal ─────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <AdvantagesSection />
        { /*<TestimonialsSection />*/}
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
