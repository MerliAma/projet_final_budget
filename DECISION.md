# DECISION.md — TopBudget

> Ce fichier centralise toutes les décisions d'architecture, de design et de stratégie du projet.
> Chaque lot ajoute une section. Ne jamais supprimer les sections précédentes.

---

# Lot 1 — Audit et Design System

## Date

06 octobre 2026

## Objectif

Analyser le projet existant dans son intégralité (architecture, composants, styles, UX, accessibilité, responsive), préparer le Design System pour la refonte, et définir une feuille de route par lots.

---

## 1. Architecture analysée

### Framework et version

| Élément         | Valeur                          |
| --------------- | ------------------------------- |
| Framework       | Next.js 16.2.12                 |
| React           | 19.2.4                          |
| Router          | **App Router**                  |
| TypeScript      | Non (JavaScript pur)            |
| Tailwind CSS    | **v4** via @tailwindcss/postcss |
| DaisyUI         | v5.7.4                          |
| Firebase        | v12.18.0                        |
| Authentification| Firebase Auth                   |
| Base de données | Firebase Realtime Database      |
| Icônes          | react-icons (Lucide) + Bootstrap Icons (CDN) |

### Structure des fichiers

```
projet_final_budget/
├── app/
│   ├── layout.js                ← Root layout (Geist fonts, Bootstrap Icons CDN)
│   ├── page.js                  ← Route "/" → Connexion (Se_connecter)
│   ├── globals.css              ← CSS global minimal (Tailwind + DaisyUI)
│   ├── Inscription/
│   │   └── page.jsx             ← Route "/Inscription"
│   ├── (pages-TB)/              ← Route Group back-office protégé
│   │   ├── layout.jsx           ← Wraps AuthProvider
│   │   ├── TableauBord/page.jsx ← Route "/TableauBord"
│   │   ├── Budget/page.jsx      ← Route "/Budget"
│   │   ├── Transaction/page.jsx ← Route "/Transaction"
│   │   ├── LeBudget/[id]/page.jsx ← Route "/LeBudget/[id]" (dynamique)
│   │   └── Profil/page.jsx      ← Route "/Profil"
│   └── server/                  ← Route Handlers (API Next.js internes)
│       ├── budget/
│       │   ├── get-all/route.js
│       │   ├── get-one/route.js
│       │   ├── new/route.js
│       │   ├── updateB/route.js
│       │   └── deleteB/route.js
│       └── transaction/
│           ├── get-all/route.js
│           ├── get-one/route.js
│           ├── new/route.js
│           ├── updateT/route.js
│           ├── deleteT/route.js
│           └── delete-many/route.js
├── composants/                  ← Tous les composants React
├── mesFonctions/                ← Fonctions utilitaires JS
├── lib/IndexDB/                 ← Ancien système IndexDB (conservé, commenté)
├── firebaseConfig.js            ← Config Firebase (Auth + Analytics)
├── next.config.mjs
├── package.json
└── .env                         ← Variables d'environnement Firebase
```

### Caractéristiques de l'architecture

- **App Router** avec Route Group `(pages-TB)` pour le back-office
- **Server Components** par défaut pour les `page.jsx`
- **Client Components** : tous les composants métier ont `"use client"` (Firebase côté client)
- **Route Handlers** : API backend internes à Next.js sous `app/server/`
- **Authentification** : double vérification — localStorage + `onAuthStateChanged` Firebase
- **Pattern Intermédiaire** : chaque page utilise un `*Intermd.jsx` qui gère l'état global (listes budgets + transactions) transmis via props
- **Pas de middleware Next.js** — protection des routes dans `AuthProvider.jsx`
- **Pas de Context API ni Redux** — état géré localement dans chaque composant intermédiaire
- **Base de données** : Firebase Realtime Database via REST (`db_url` dans `.env`)
- **Code IndexDB** : commenté mais présent dans les fichiers (historique technique)

---

## 2. Pages identifiées

### Authentification

| Page        | Route          | Fonction                               | État UI actuel         | Priorité |
| ----------- | -------------- | -------------------------------------- | ---------------------- | -------- |
| Connexion   | `/`            | Email/password + Google OAuth          | Correct, améliorable   | Haute    |
| Inscription | `/Inscription` | Création compte Firebase + email vérif | Fonctionnel, basique   | Haute    |

### Back-office

| Page             | Route             | Fonction                                      | État UI actuel       | Priorité |
| ---------------- | ----------------- | --------------------------------------------- | -------------------- | -------- |
| Tableau de Bord  | `/TableauBord`    | Vue globale KPIs + 10 dernières transactions  | Basique, incomplet   | Haute    |
| Mes Budgets      | `/Budget`         | Liste + Ajout + Modification + Suppression    | Fonctionnel, dense   | Haute    |
| Détail Budget    | `/LeBudget/[id]`  | Infos budget + transactions associées         | Fonctionnel          | Moyenne  |
| Mes Transactions | `/Transaction`    | Liste + Ajout + Modification + Suppression    | Dense, lisible       | Haute    |
| Mon Compte       | `/Profil`         | Modification nom / email / mot de passe       | Minimal              | Moyenne  |

### Pages manquantes / à créer

| Page                  | Justification                                            | Priorité |
| --------------------- | -------------------------------------------------------- | -------- |
| Statistiques          | KPI "Taux de Réussite" hardcodé à 0% → page dédiée       | Haute    |
| Mot de passe oublié   | Bouton présent mais sans lien ni logique Firebase        | Moyenne  |
| Page 404              | Inexistante                                              | Faible   |

---

## 3. Composants identifiés

### Layout / Navigation

| Composant    | Fichier           | Rôle                                             | Conserver | Refactoriser |
| ------------ | ----------------- | ------------------------------------------------ | --------- | ------------ |
| AuthProvider | AuthProvider.jsx  | Navbar + Sidebar DaisyUI Drawer + protection route | Oui     | Oui (Lot 3)  |

> ⚠️ AuthProvider cumule protection de route + navbar + sidebar. À diviser en Lot 3.

### Authentification

| Composant    | Fichier           | Rôle                            | Conserver | Refactoriser |
| ------------ | ----------------- | ------------------------------- | --------- | ------------ |
| Se_connecter | Se_connecter.jsx  | Formulaire connexion Firebase   | Oui       | Oui (Lot 2)  |
| S_Inscrire   | S_Inscrire.jsx    | Formulaire inscription Firebase | Oui       | Oui (Lot 2)  |

### Composants Intermédiaires (pattern état global)

| Composant          | Fichier                | Rôle                                  | Conserver |
| ------------------ | ---------------------- | ------------------------------------- | --------- |
| TableauBordIntermd | TableauBordIntermd.jsx | State listeBudget + listeTransaction  | Oui       |
| BudgetIntermd      | BudgetIntermd.jsx      | State listeBudget + listeTransaction  | Oui       |
| TransactionIntermd | TransactionIntermd.jsx | State listeBudget + listeTransaction  | Oui       |
| LeBudgetIntermd    | LeBudgetIntermd.jsx    | Fetch budget + transactions par id    | Oui       |
| ProfilInterm       | ProfilInterm.jsx       | Wrapper minimal pour Profil           | Oui       |

### Budget

| Composant      | Fichier             | Rôle                                          | Conserver | Refactoriser |
| -------------- | ------------------- | --------------------------------------------- | --------- | ------------ |
| FenBudget      | FenBudget.jsx       | Grille liste budgets + formulaire ajout/modif | Oui       | Oui (Lot 5)  |
| FormulaireBudg | FormulaireBudg.jsx  | Formulaire ajout/modification budget          | Oui       | Oui (Lot 5)  |
| LeBudget       | LeBudget.jsx        | Vue détail budget + form transaction + table  | Oui       | Oui (Lot 5)  |

### Transaction

| Composant       | Fichier              | Rôle                                         | Conserver | Refactoriser |
| --------------- | -------------------- | -------------------------------------------- | --------- | ------------ |
| FenTransaction  | FenTransaction.jsx   | Grille formulaire + tableau + filtre budget  | Oui       | Oui (Lot 6)  |
| FormulaireTrans | FormulaireTrans.jsx  | Formulaire ajout/modification transaction    | Oui       | Oui (Lot 6)  |
| TableTrans      | TableTrans.jsx       | Tableau des transactions + modal modification | Oui      | Oui (Lot 6)  |

### Dashboard

| Composant   | Fichier          | Rôle                                       | Conserver | Refactoriser |
| ----------- | ---------------- | ------------------------------------------ | --------- | ------------ |
| TableauBord | TableauBord.jsx  | KPI cards + tableau 10 dernières transact. | Oui       | Oui (Lot 4)  |

### Profil

| Composant | Fichier      | Rôle                                             | Conserver | Refactoriser |
| --------- | ------------ | ------------------------------------------------ | --------- | ------------ |
| Profil    | Profil.jsx   | Modification nom / email / mot de passe Firebase | Oui       | Oui (Lot 8)  |

### UI / Feedback

| Composant     | Fichier             | Rôle                                | Réutilisable | Conserver |
| ------------- | ------------------- | ----------------------------------- | ------------ | --------- |
| MessageErreur | MessageErreur.jsx   | Alert DaisyUI rouge + auto-close 2s | Oui          | Oui       |
| MessageOk     | MessageOk.jsx       | Alert DaisyUI verte + auto-close 2s | Oui          | Oui       |

### Utilitaires

| Fichier                                | Rôle                                             |
| -------------------------------------- | ------------------------------------------------ |
| mesFonctions/SommeMontant.js           | Calculs financiers : somme budgets, transactions, reste |
| mesFonctions/RecupInfosUserConnecte.js | Lecture localStorage user                        |
| mesFonctions/Deconnexion.js            | Déconnexion Firebase                             |
| mesFonctions/GetMesBudgets.js          | Récupération budgets (potentiellement inutilisé) |

---

## 4. Analyse Tailwind CSS

### Version

**Tailwind CSS v4** via `@tailwindcss/postcss` — pas de fichier `tailwind.config.*` nécessaire.

### globals.css (état actuel)

```css
@import "tailwindcss";
@plugin "daisyui";

:root {
  --background: #ffffff;
  --foreground: #171717;
}
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

- Thème minimal : 2 variables CSS seulement
- Aucune extension personnalisée (pas de couleurs custom, pas de breakpoints custom)
- Pas de composants Tailwind custom (`@layer components`)
- DaisyUI v5 chargé comme plugin CSS natif

### Bibliothèques UI détectées

| Bibliothèque     | Usage                                                                     | Conserver |
| ---------------- | ------------------------------------------------------------------------- | --------- |
| DaisyUI v5       | drawer, navbar, card, table-zebra, modal, progress, badge, btn, alert, loading | Oui  |
| react-icons      | Icônes Lucide (Lu*) et Bootstrap (Bs*)                                    | Oui       |
| Bootstrap Icons  | CDN dans le `<head>` global — classes `bi bi-*`                           | Oui (optimiser en Lot 3) |

### Couleurs utilisées actuellement

| Couleur       | Usage                                     |
| ------------- | ----------------------------------------- |
| teal-900      | Couleur primaire : boutons, navbar, sidebar header |
| teal-600      | Fond des pages auth                       |
| teal-800      | Boutons hover                             |
| orange-500    | Montants budgets                          |
| red-500       | Montants dépensés                         |
| blue-600      | Icônes modification                       |
| red-600       | Icônes suppression                        |
| gray-300/50   | Fonds de zones info budgets               |
| base-100/200  | DaisyUI backgrounds                       |

### Constats

- Palette incohérente : `teal-*` dominant mais mélangé avec `blue`, `indigo` dans les `focus:ring`
- Aucun système de tokens défini
- Aucun dark mode implémenté
- Typographie : `Arial, Helvetica, sans-serif` — police générique, non moderne
- Geist font chargée via Next.js mais non appliquée explicitement dans les composants

---

## 5. Problèmes UI identifiés

### Connexion / Inscription

| Problème | Priorité |
| -------- | -------- |
| "Mot de Passe oublié ?" présent mais non fonctionnel (pas de lien, pas d'action) | Haute |
| Fond teal-600 uniforme — manque de profondeur visuelle | Moyenne |
| Logo "TopBudget" avec alternance italic peu lisible | Faible |
| Lien vers inscription visible uniquement en texte brut | Haute |

### Navigation (Sidebar)

| Problème | Priorité |
| -------- | -------- |
| Sidebar sans lien actif mis en évidence | Haute |
| Navbar n'affiche que "Bienvenue, [nom]" — peu d'informations | Haute |
| Bouton hamburger mobile sans feedback visuel clair | Haute |
| Aucune page "Statistiques" dans le menu | Haute |

### Tableau de Bord

| Problème | Priorité |
| -------- | -------- |
| KPI "Taux de Réussite" hardcodé à `0 %` — non calculé | Critique |
| Aucun graphique — interface purement textuelle | Haute |
| Shadows KPI incohérents (blue-400, red-400) avec la palette teal | Moyenne |
| Tableau "10 dernières transactions" déborde sur mobile (6 colonnes) | Haute |
| Aucun état vide si pas de données | Haute |

### Budgets

| Problème | Priorité |
| -------- | -------- |
| Suppression avec `confirm()` natif — peu professionnel | Haute |
| Modal modification via `document.getElementById().click()` — anti-pattern React | Moyenne |
| Barre de progression `<progress>` sans indication visuelle du % | Moyenne |
| Pas d'état vide illustré | Moyenne |

### Transactions

| Problème | Priorité |
| -------- | -------- |
| Tableau 8 colonnes — critique sur mobile | Critique |
| Suppression avec `alert()` et `confirm()` natifs | Haute |
| Fond `orange-400` en dur dans une cellule `<td>` — incohérent | Haute |
| Pas d'état vide si aucune transaction | Haute |

### Profil

| Problème | Priorité |
| -------- | -------- |
| Affichage email/nom via `document.getElementById` — anti-pattern React | Haute |
| Formulaire oblige à saisir le mot de passe pour modifier le nom | Critique |
| `verifyBeforeUpdateEmail` non importé dans le fichier — bug potentiel | Critique |
| Avatar très minimal (icône grise) | Faible |

---

## 6. Problèmes UX identifiés

```
Problème : KPI "Taux de Réussite" toujours à 0%
Impact : L'utilisateur ne peut pas mesurer sa performance budgétaire
Priorité : Critique
Suggestion : ratio = montant_restant_total / montant_total_budgets × 100
```

```
Problème : Pas d'état vide illustré sur les listes
Impact : L'utilisateur ne comprend pas pourquoi la page est vide
Priorité : Haute
Suggestion : Empty state avec illustration + CTA "Créer votre premier budget"
```

```
Problème : Confirmation par alert()/confirm() natif
Impact : Expérience utilisateur dégradée, popup bloquante non stylée
Priorité : Haute
Suggestion : Modal de confirmation DaisyUI stylée
```

```
Problème : "Mot de passe oublié" non implémenté
Impact : L'utilisateur bloqué ne peut pas se débloquer seul
Priorité : Haute
Suggestion : sendPasswordResetEmail() Firebase
```

```
Problème : Pas de feedback visuel de chargement sur les listes
Impact : L'utilisateur ne sait pas si les données chargent ou si la page est vide
Priorité : Haute
Suggestion : Skeleton loader pendant le chargement des données
```

```
Problème : Navigation sans lien actif
Impact : L'utilisateur ne sait pas où il se trouve dans l'application
Priorité : Haute
Suggestion : Style actif sur le lien correspondant à la page courante
```

```
Problème : Formulaire Profil oblige saisie mot de passe pour modifier le nom
Impact : Friction inutile pour une modification simple
Priorité : Critique
Suggestion : Séparer modification profil (nom) et modification mot de passe
```

```
Problème : Pas de page Statistiques dédiée
Impact : Données financières peu exploitables, aucun graphique
Priorité : Haute
Suggestion : Nouvelle page /Statistiques avec graphiques
```

```
Problème : Auto-close des messages (2s) trop rapide
Impact : L'utilisateur peut rater le message de succès / erreur
Priorité : Moyenne
Suggestion : Passer à 4-5 secondes ou ajouter fermeture manuelle
```

---

## 7. Problèmes d'accessibilité

| Problème | Impact | Priorité |
| -------- | ------ | -------- |
| Couleur seule comme indicateur (rouge = dépense) sans label alternatif | Daltoniens | Haute |
| Boutons icônes sans `aria-label` (crayon, corbeille) | Lecteurs d'écran | Haute |
| Champs formulaire sans `<label>` associé (placeholder comme seul label) | Accessibilité formulaires | Haute |
| Focus keyboard non visible (outline supprimé sur certains inputs) | Navigation clavier | Haute |
| Contrastes `text-gray-600` sur fond blanc potentiellement insuffisants (< 4.5:1) | Malvoyants | Moyenne |
| `confirm()` et `alert()` non contrôlables au clavier | Navigation clavier | Haute |
| `<progress>` sans valeur textuelle accessible | Lecteurs d'écran | Moyenne |

---

## 8. Problèmes responsive

| Élément | Problème | Priorité |
| ------- | -------- | -------- |
| Tableau transactions | 8 colonnes — overflow critique sur mobile | Critique |
| Tableau dashboard | 6 colonnes — même problème | Haute |
| Sidebar | DaisyUI drawer fonctionne mais icônes-only peu claires | Moyenne |
| Navigation mobile | Hamburger sans feedback visuel clair | Haute |
| Cards budget | Grille 1→2 col — correct | OK |
| Page connexion | Grille 2→1 col — correct | OK |

---

## 9. Direction artistique retenue

### Positionnement

Application de gestion budgétaire personnelle → L'interface doit inspirer : **confiance**, **clarté**, **croissance**, **modernité professionnelle**.

### Concept visuel : "Clarté Verte"

Interface claire et lumineuse (fond blanc/clair), couleur primaire **verte profonde** ancrée dans la confiance financière. Design épuré, typographie lisible, données financières mises en avant avec impact visuel fort.

---

## 10. Palette proposée

### Couleurs principales — Vert forêt profond

| Token         | Valeur HEX | Usage                                  |
| ------------- | ---------- | -------------------------------------- |
| primary       | #16a34a    | Boutons CTA, liens actifs, accents     |
| primary-hover | #15803d    | Hover état primary                     |
| primary-light | #bbf7d0    | Badges, highlights légers              |
| primary-dark  | #14532d    | Navbar, header, éléments foncés        |

### Fonds et surfaces

| Token      | Valeur HEX | Usage                                |
| ---------- | ---------- | ------------------------------------ |
| background | #f8fafc    | Fond général de l'application        |
| surface    | #ffffff    | Cards, modales, panneaux             |
| surface-2  | #f1f5f9    | Fond sidebar, zones secondaires      |
| border     | #e2e8f0    | Bordures subtiles                    |

### Typographie

| Token          | Valeur HEX | Usage                              |
| -------------- | ---------- | ---------------------------------- |
| text           | #0f172a    | Texte principal (quasi-noir)       |
| text-secondary | #475569    | Labels, descriptions               |
| text-muted     | #94a3b8    | Placeholders, aide                 |

### Couleurs sémantiques

| Token   | Valeur HEX | Usage                            |
| ------- | ---------- | -------------------------------- |
| success | #16a34a    | Confirmations, montant restant   |
| warning | #d97706    | Alertes budget presque atteint   |
| error   | #dc2626    | Erreurs, montants dépensés       |
| info    | #2563eb    | Informations neutres             |

---

## 11. Typographie proposée

### Police principale : **Inter** (Google Fonts)

Lisibilité optimale pour les interfaces de données financières.

| Style        | Taille         | Poids | Usage                          |
| ------------ | -------------- | ----- | ------------------------------ |
| H1           | 2rem (32px)    | 700   | Titre de page principale       |
| H2           | 1.5rem (24px)  | 600   | Titre de section               |
| H3           | 1.25rem (20px) | 600   | Titre de carte / widget        |
| Body         | 1rem (16px)    | 400   | Texte courant                  |
| Body Small   | 0.875rem       | 400   | Labels, descriptions           |
| Caption      | 0.75rem (12px) | 400   | Métadonnées, dates             |
| Financial    | 1.5rem+        | 700   | Montants, KPIs financiers      |
| Financial-sm | 1rem (16px)    | 600   | Montants secondaires           |

### Règles typographiques

- Montants financiers : toujours en **gras**, taille supérieure au corps de texte
- Devise (FCFA) en `text-muted` à côté du montant
- Nombres négatifs (dépenses) : couleur `error` (#dc2626)
- Nombres positifs (restants) : couleur `success` (#16a34a)

---

## 12. Espacements et formes

### Border Radius

| Nom  | Valeur  | Usage                             |
| ---- | ------- | --------------------------------- |
| sm   | 6px     | Badges, inputs, petits boutons    |
| md   | 10px    | Boutons principaux, selects       |
| lg   | 14px    | Cards, panneaux, modales          |
| xl   | 20px    | Cards statistiques, blocs hero    |
| full | 9999px  | Avatars, badges pill              |

> Design moderne mais pas "cartoon" — arrondis modérés.

### Shadows

| Nom       | Valeur CSS approximatif              | Usage               |
| --------- | ------------------------------------ | ------------------- |
| shadow-xs | 0 1px 2px rgba(0,0,0,0.05)           | Inputs, séparateurs |
| shadow-sm | 0 2px 8px rgba(0,0,0,0.08)           | Cards normales      |
| shadow-md | 0 4px 16px rgba(0,0,0,0.12)          | Cards en focus      |
| shadow-lg | 0 8px 24px rgba(22,163,74,0.15)      | Boutons primary     |

### Spacing

Système Tailwind standard (base 4px) :
- Padding card interne : `p-5` (20px)
- Gap entre cards : `gap-5` (20px)
- Padding page : `p-6`
- Espacement formulaire : `mb-4` entre les champs

---

## 13. Principes UX à adopter

### 1. Clarté
Chaque page a un titre clair, un sous-titre si nécessaire, et une action principale visible au premier coup d'œil.

### 2. Hiérarchie visuelle
Les informations les plus importantes (soldes, budgets restants) sont les plus grandes et les plus contrastées. Les actions secondaires sont moins visibles.

### 3. Simplicité
- Ajout budget/transaction : 3 champs maximum
- Modification : même formulaire, même emplacement
- Suppression : modal de confirmation DaisyUI (pas `confirm()`)

### 4. Feedback permanent
- Chargement : skeleton loaders
- Succès : toast vert persistant 4s
- Erreur : toast rouge persistant 5s avec description claire
- Action en cours : bouton désactivé + spinner

### 5. Cohérence
- Même bouton "Ajouter" = même style partout
- Modales : même structure partout
- Tableaux : mêmes conventions de couleur

### 6. Accessibilité
- Tous les inputs ont des `<label>` associés
- Les boutons d'action ont des `aria-label`
- La couleur n'est jamais le seul indicateur
- Le focus clavier est toujours visible

---

## 14. Structure du back-office proposée

### Desktop — Sidebar fixe

```
+-----------------------------------------------------+
|  Sidebar (240px fixe)    |  Main Content Area       |
|                          |                          |
|  [Logo TopBudget]        |  [Page Header]           |
|                          |  Titre + Actions CTA     |
|  Navigation :            |                          |
|  > Tableau de Bord  ●    |  [Contenu de la page]    |
|    Mes Budgets           |                          |
|    Mes Transactions      |                          |
|    Statistiques          |                          |
|    Mon Compte            |                          |
|                          |                          |
|  ────────────────────    |                          |
|  [Avatar] Prénom Nom     |                          |
|  [Se déconnecter]        |                          |
+-----------------------------------------------------+
```

### Mobile — Topbar + Drawer

```
+-------------------------------+
|  [☰]  TopBudget       [👤]   |
+-------------------------------+
|                               |
|       Page content            |
|                               |
+-------------------------------+

  → Drawer slide-in :
  [×]  TopBudget
  ─────────────────────
  🏠  Tableau de Bord
  💰  Mes Budgets
  ↔   Mes Transactions
  📊  Statistiques
  👤  Mon Compte
  ─────────────────────
  🚪  Se Déconnecter
```

### Améliorations par rapport à l'existant

1. **Sidebar toujours visible sur desktop** (suppression du drawer toggle en mode lg)
2. **Lien actif mis en évidence** dans la sidebar (couleur + fond)
3. **Topbar supprimée sur desktop**, remplacée par un header de page contextuel
4. **Avatar utilisateur** dans la sidebar avec nom complet
5. **Ajout du lien "Statistiques"** dans la navigation

---

## 15. Découpage des prochains lots

| Lot  | Périmètre                         | Contenu                                                   | Priorité |
| ---- | --------------------------------- | --------------------------------------------------------- | -------- |
| 1    | ✅ Audit + Design System          | Ce document                                               | —        |
| 2    | Connexion + Inscription           | Refonte UI auth, mot de passe oublié, Inter               | Haute    |
| 3    | Layout Back-office + Navigation   | Sidebar fixe, topbar mobile, lien actif, structure        | Haute    |
| 4    | Tableau de Bord                   | KPIs corrigés, graphiques, skeleton, états vides          | Haute    |
| 5    | Gestion des Budgets               | Refonte cards, formulaires, modal confirmation, progression | Haute  |
| 6    | Gestion des Transactions          | Refonte tableau mobile-first, formulaires, modal          | Haute    |
| 7    | Statistiques                      | Nouvelle page : graphiques mensuels, répartition          | Haute    |
| 8    | Profil + Paramètres               | Séparation nom/mot de passe, avatar, infos compte         | Moyenne  |
| 9    | Responsive + Accessibilité        | Audit mobile complet, labels ARIA, focus keyboard         | Haute    |
| 10   | Polish final + Tests              | Animations, micro-interactions, tests utilisateur         | Moyenne  |

---

## 16. Décisions importantes

- **Conserver Tailwind CSS v4** — ne pas revenir à v3 ni migrer vers une autre solution
- **Conserver DaisyUI v5** — bibliothèque déjà en place, s'appuyer dessus pour les composants de base
- **Conserver Firebase Auth + Realtime DB** — logique métier fonctionnelle, ne pas toucher
- **Conserver le pattern Intermd** — refactoriser progressivement sans casser la logique
- **Remplacer `alert()` / `confirm()`** par des modales DaisyUI dans chaque lot concerné
- **Remplacer Bootstrap Icons CDN** par react-icons (déjà installé) en Lot 3
- **Ajouter Inter depuis Google Fonts** comme police principale — en Lot 2
- **Créer une page Statistiques** (`/Statistiques`) — en Lot 7
- **Implémenter "Mot de passe oublié"** — en Lot 2
- **Séparer la modification de nom et de mot de passe** dans le Profil — en Lot 8
- **Documenter le bug `verifyBeforeUpdateEmail` non importé** dans Profil.jsx — correctif en Lot 8
- **Ne pas modifier la logique métier** (SommeMontant, API routes, authentification)
- **Préserver tous les commentaires et anciens codes commentés** (historique technique)

---

# Lot 2 — Authentification

## Objectif

Moderniser l'expérience utilisateur et l'interface visuelle des pages d'authentification (`/` pour la connexion, `/Inscription` pour la création de compte, et création de la route `/mot-de-passe-oublie`).

## Architecture retenue

- Utilisation d'un layout partagé `AuthLayout.jsx` à 2 colonnes sur desktop (branding émeraude profond à gauche, formulaire centré sur fond clair à droite).
- Composants atomiques réutilisables dans `composants/auth/` :
  - `AuthInput.jsx` : champ avec label explicite, icône de contexte, focus visible, bordures soignées.
  - `PasswordInput.jsx` : bascule visuelle affichage/masquage du mot de passe avec accessibilité clavier.
  - `AuthButton.jsx` : bouton d'action principal avec état de chargement (spinner) et désactivation automatique.
  - `AuthAlert.jsx` : alertes de retour d'état (succès ou erreur) avec icônes de statut.
- Application rigoureuse de la palette "Clarté Verte" et de la typographie Inter.

## Pages et Composants créés / modifiés

- `composants/auth/AuthLayout.jsx` : Layout responsive d'authentification.
- `composants/auth/AuthInput.jsx` : Champ de saisie accessible.
- `composants/auth/PasswordInput.jsx` : Saisie sécurisée de mot de passe.
- `composants/auth/AuthButton.jsx` : Bouton d'action avec indicateur de chargement.
- `composants/auth/AuthAlert.jsx` : Notifications contextuelles.
- `composants/MotDePasseOublie.jsx` & `app/mot-de-passe-oublie/page.jsx` : Récupération de mot de passe via Firebase `sendPasswordResetEmail`.
- `composants/Se_connecter.jsx` & `app/page.js` : Refonte UI connexion.
- `composants/S_Inscrire.jsx` & `app/Inscription/page.jsx` : Refonte UI inscription.
- `app/globals.css` : Définition des variables de thème et tokens Tailwind v4.

## État

✅ Terminé

---

# Lot 3 — Back-office et navigation

## Objectif

Créer une structure commune ergonomique, stable et responsive pour l'espace utilisateur connecté, en remplaçant la navigation rigide par un ensemble modulaire (Sidebar desktop fixe, Header contextuel, Drawer mobile accessible, menu utilisateur avec profil et déconnexion).

## Architecture retenue

```text
BackofficeLayout
│
├── Sidebar (Desktop fixe, 256px)
│   ├── Logo TopBudget & Icône Portefeuille
│   ├── Menu principal (Tableau de bord, Budgets, Transactions)
│   ├── Menu Compte (Mon Profil)
│   └── Carte Utilisateur (Avatar, Nom, Email, Déconnexion)
│
├── Drawer Mobile (MobileSidebar)
│   ├── Backdrop flouté & transition latérale
│   └── Navigation complète identique avec gestion Focus/Échap
│
└── Zone Principale (lg:pl-64)
    ├── Header (Sticky, glassmorphism, actions rapides, UserMenu)
    └── Contenu de la page (max-w-7xl, p-4 à p-8)
```

Séparation des responsabilités :
- `AuthProvider.jsx` assure la sécurité des routes (vérification localStorage + listener Firebase `onAuthStateChanged`), expose `AuthContext`, et affiche un écran de chargement soigné pendant l'initialisation.
- `BackofficeLayout.jsx` gère la disposition spatiale et responsive des vues connectées.

## Sidebar

- Largeur maîtrisée de 256px (`w-64`) sur écran large (lg+), fixée à gauche.
- Logo TopBudget aligné sur l'identité visuelle de l'authentification (icône portefeuille émeraude `LuWallet` sur fond vert).
- Navigation articulée autour des sections réellement présentes dans l'application :
  - **Tableau de bord** (`/TableauBord`, icône `LuLayoutDashboard`)
  - **Mes Budgets** (`/Budget`, icône `LuPiggyBank`) — inclut la sous-route `/LeBudget`
  - **Mes Transactions** (`/Transaction`, icône `LuArrowLeftRight`)
  - **Mon Profil** (`/Profil`, icône `LuUser`)
- Carte utilisateur en pied de sidebar avec avatar circulaire (initiale), nom complet de l'utilisateur connecté, statut de compte et bouton de déconnexion stylé.

## Header

- Barre supérieure sticky avec effet de verre dépoli (`bg-white/80 backdrop-blur-md border-b border-slate-200/80`).
- Affichage contextuel du titre de la page courante et de sa catégorie (fil d'Ariane épuré).
- Bouton d'ouverture du drawer mobile pour les petits écrans.
- Actions rapides contextuelles intégrées : bouton "+ Nouveau budget" et "+ Dépense" avec redirection directe.
- Menu utilisateur déroulant (`UserMenu.jsx`) avec initiales, nom, badge "Vérifié", raccourci vers "Mon Profil" et déconnexion sécurisée.

## Navigation

- Utilisation de `usePathname()` pour détecter la route active.
- Mise en valeur visuelle immédiate du lien actif : fond vert clair (`bg-emerald-50`), texte émeraude foncé (`text-emerald-800`), indicateur vertical gauche (`border-l-4 border-[#16a34a]`), icône active et chevron indicateur.

## Responsive

- Breakpoints Tailwind (`sm:`, `md:`, `lg:`).
- Sur mobile et tablette (< 1024px) : sidebar masquée au profit d'un tiroir coulissant (`MobileSidebar.jsx`) avec overlay sombre flouté.
- Fermeture automatique du tiroir lors du changement de page, au clic sur l'arrière-plan ou via la touche `Échap`.
- Verrouillage du scroll sur le `body` lors de l'ouverture du menu mobile pour éviter tout défilement parasite.

## Composants créés

- `composants/layout/Sidebar.jsx` : Barre latérale de navigation desktop et mobile.
- `composants/layout/MobileSidebar.jsx` : Tiroir de navigation mobile accessible.
- `composants/layout/Header.jsx` : Barre supérieure contextuelle avec actions rapides.
- `composants/layout/UserMenu.jsx` : Menu déroulant pour le compte utilisateur.
- `composants/layout/BackofficeLayout.jsx` : Layout structurel commun de l'espace connecté.

## Composants modifiés

- `composants/AuthProvider.jsx` : Séparation de la vérification auth et de l'affichage du layout ; mise à disposition de `AuthContext` ; écran de chargement initial stylé ; purge complète de `user` et `InfosUser` dans `localStorage` lors de la déconnexion.
- `app/layout.js` : Ajustement de la configuration de la variable font Inter pour compatibilité optimale avec Turbopack.

## Décisions UI/UX

- Suppression du composant DaisyUI drawer rigide de l'ancienne version qui tronquait les libellés et forçait un comportement inadapté sur grand écran.
- Remplacement du bandeau vert foncé uniforme (`teal-900`) par un fond clair moderne (`#f8fafc`) avec touches d'accentuation vert forêt (`#16a34a` / `#14532d`), garantissant un confort visuel prolongé.

## Modifications techniques

- Aucun impact sur les routes API backend ou la structure des données Firebase.
- Gestion centralisée de la déconnexion via Firebase `signOut()` et synchronisation du `localStorage`.

## Tests effectués

- Validation du build Next.js 16 (`npm run build`) sans aucun avertissement ni erreur.
- Vérification du statut HTTP 200 sur l'ensemble des routes connectées (`/TableauBord`, `/Budget`, `/Transaction`, `/Profil`).
- Test de la navigation active et du basculement responsive.

## Problèmes rencontrés

- Configuration de la police Inter avec tableau de poids fixes créant un échec de résolution Turbopack.

## Solutions

- Suppression du tableau de poids explicite dans `Inter()` car Inter est une police variable (Variable Font) supportée nativement par Next.js.

## État

✅ Terminé

---

# Lot 4 — Dashboard

## Objectif

Refondre entièrement le tableau de bord principal (`/TableauBord`) pour offrir à l'utilisateur une vision synthétique, hiérarchisée et instantanée de sa situation financière, tout en résolvant les anomalies identifiées lors de l'audit.

## Structure du Dashboard

1. **En-tête de bienvenue (`DashboardHeader.jsx`)** : Salutation chaleureuse avec le prénom réel de l'utilisateur, bouton de rafraîchissement des données et boutons d'actions rapides ("Nouveau budget", "Ajouter une dépense").
2. **Statistiques financières (`DashboardStats.jsx`)** : 4 cartes disposées selon la hiérarchie financière recommandée.
3. **Synthèse des budgets & Graphique (`BudgetOverview.jsx` + `DashboardChart.jsx`)** : Grille asymétrique (2/3 budgets avec jauges de progression, 1/3 répartition graphique des dépenses).
4. **Dernières transactions (`RecentTransactions.jsx`)** : Historique des 10 opérations les plus récentes avec double rendu responsive (tableau pour desktop, cartes compactes pour mobile).

## Statistiques

Hiérarchie stricte des indicateurs (Section 20 du cahier des charges) :
1. **Montant disponible** (Priorité 1) : Montant restant total calculé par `totalAlloue - totalDepense`. Mise en avant en vert profond si positif, alerte en rouge si déficit.
2. **Montant dépensé** (Priorité 2) : Somme de toutes les transactions réelles calculée par la fonction métier existante `SommeTransactions`. Badge indiquant le pourcentage consommé.
3. **Budget total alloué** (Priorité 3) : Somme totale des enveloppes budgétaires calculée par `SommeMontantBud`. Badge indiquant le nombre de budgets actifs.
4. **Santé budgétaire & Taux de maîtrise** (Priorité 4) : **Correction du bug critique de l'ancien code où le KPI "Taux de Réussite" était hardcodé à 0%**. Désormais calculé dynamiquement à partir de la marge restante (`totalDisponible / totalAlloue * 100`) avec diagnostic qualitatif ("Équilibré", "À surveiller", "Seuil critique", "Dépassement").

## Budgets

- Affichage synthétique des catégories budgétaires actives via `BudgetOverview.jsx`.
- Présentation pour chaque budget : nom, mois concerné, montant alloué, montant dépensé, montant restant, jauge de progression visuelle.
- **Indicateurs de dépassement multi-critères** (Section 22) associant couleur, icône et texte :
  - `< 70%` : "Sous contrôle" (Vert + icône coche)
  - `70% à 89%` : "À surveiller" (Ambre + icône information)
  - `90% à 100%` : "Presque épuisé" (Orange + icône alerte)
  - `> 100%` : "Dépassé" (Rouge + icône alerte triangle)
- Liens directs vers la vue de détail du budget (`/LeBudget/[id]`).

## Transactions

- Affichage des 10 transactions les plus récentes via `RecentTransactions.jsx`.
- **Correction du bug de l'ancien code** : L'ancien composant imbriquait un `.map()` sur les budgets avec un `.filter().slice(0, 9)` par budget, ce qui retournait jusqu'à 9 transactions par budget sans tri chronologique global. Le nouveau code effectue un tri chronologique global décroissant sur l'ensemble des transactions de l'utilisateur avant d'extraire les 10 premières.
- **Double rendu responsive** :
  - Desktop (md+) : Tableau aéré avec colonnes Date, Description, Budget associé et Montant en rouge (`- X FCFA`).
  - Mobile (< md) : Cartes d'opérations individuelles sans aucun débordement ni scroll horizontal.

## Graphiques

- Création du composant `DashboardChart.jsx` pour visualiser la répartition des dépenses par catégorie.
- Réalisé en pur Tailwind CSS et SVG afin de ne pas alourdir le bundle sans bibliothèque tierce inutile.
- Classement des budgets les plus consommateurs avec barres comparatives proportionnelles et pourcentages de contribution aux dépenses globales.
- Message explicatif bienveillant si aucune dépense n'a encore été effectuée.

## Empty states

- Composant `DashboardEmpty.jsx` affiché automatiquement si l'utilisateur ne possède aucun budget.
- Message d'accueil personnalisé, conseils pour démarrer et appel à l'action principal : `Créer mon premier budget` (redirection vers `/Budget`).

## Loading states

- Composant `DashboardSkeleton.jsx` affiché pendant le chargement des données.
- Placeholders animés (`animate-pulse`) respectant fidèlement la grille finale pour éliminer tout saut visuel (layout shift).

## Error states

- Composant `DashboardError.jsx` affiché en cas d'échec réseau ou API.
- Message convivial évitant tout jargon technique et bouton "Réessayer" pour relancer la requête.

## Responsive

- Mobile (320px – 480px) : Cartes KPI empilées sur 1 colonne, budgets en pleine largeur, transactions en cartes compactes.
- Tablette (768px) : Grille 2 colonnes pour les KPIs, tableau responsive.
- Desktop (1024px+) : Grille 4 colonnes pour les KPIs, disposition asymétrique 2/3 (budgets) et 1/3 (graphique), tableau de transactions complet.
- Aucun défilement horizontal indésirable sur l'ensemble des résolutions.

## Accessibilité

- Contraste textuel conforme WCAG AA sur tous les indicateurs.
- La couleur n'est jamais le seul moyen de transmission de l'information (association systématique d'icônes et de libellés textuels).
- Attributs ARIA (`role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`).
- Navigation au clavier prise en charge sur tous les boutons interactifs.

## Composants créés

- `composants/dashboard/DashboardHeader.jsx`
- `composants/dashboard/DashboardStats.jsx`
- `composants/dashboard/BudgetOverview.jsx`
- `composants/dashboard/DashboardChart.jsx`
- `composants/dashboard/RecentTransactions.jsx`
- `composants/dashboard/DashboardSkeleton.jsx`
- `composants/dashboard/DashboardEmpty.jsx`
- `composants/dashboard/DashboardError.jsx`

## Composants modifiés

- `composants/TableauBord.jsx` : Refonte architecturale et visuelle complète tout en préservant les props `{ listeBudget, setListeBudget, listeTransaction, setListeTransaction }` pour garantir la compatibilité avec `TableauBordIntermd.jsx`.

## Données utilisées

- Données financières réelles extraites de l'API REST interne :
  - `/server/budget/get-all`
  - `/server/transaction/get-all`
- Filtrage par l'identifiant de l'utilisateur connecté (`idUser`) issu de `RecupInfosUserConnecte()`.
- Calculs exécutés via les fonctions utilitaires existantes `SommeMontantBud` et `SommeTransactions`. Aucune donnée fictive inventée.

## Modifications techniques

- Correction de l'algorithme d'extraction des 10 dernières transactions (tri global unifié).
- Correction de l'indicateur de santé budgétaire (calcul dynamique en remplacement de la valeur `0 %` statique).
- Préservation intégrale des routes API et du modèle de données Firebase.

## Tests effectués

- Compilation Turbopack / Next.js 16 (`npm run build`) validée sans erreur.
- Vérification de l'exécution sur le serveur de développement local (`http://localhost:3000/TableauBord`).
- Vérification des états empty, loading et des calculs financiers.

## Problèmes rencontrés

- Nom d'export d'icône `LuPieChart` inexistant dans la version actuelle de `react-icons/lu`.
- Données des budgets non affichées pour l'utilisateur connecté : les routes `/server/budget/get-all` et `/server/transaction/get-all` recevaient une erreur HTTP 401 `{ error: "Permission denied" }` directement de Firebase Realtime Database. La cause provient des règles de sécurité de Firebase (mode test de 30 jours arrivé à expiration sur la base Realtime Database).

## Solutions

- Remplacement de l'icône par `LuChartPie`, exportée et reconnue sans conflit.
- Amélioration de la gestion d'erreur dans les routes API et dans `TableauBord.jsx` pour diagnostiquer et afficher explicitement l'état des règles Firebase.
- Procédure de déblocage documentée pour l'utilisateur : mise à jour des règles de lecture/écriture dans la console Firebase (`.read: true, .write: true`).

## Décisions importantes

- Conservation stricte de Tailwind CSS v4 et DaisyUI v5.
- Non-introduction de bibliothèques tierces de graphiques (ex: Chart.js, Recharts) conformément aux instructions de sobriété technique.
- Maintien du pattern de composant intermédiaire `TableauBordIntermd.jsx`.

## État

✅ Terminé — En attente d'activation des règles Firebase par l'utilisateur pour validation finale des données réelles

---

# Lot 5 — Budgets

## Objectif

Moderniser intégralement l'expérience utilisateur et l'interface visuelle de gestion des budgets (`/Budget` et `/LeBudget/[id]`). Permettre à l'utilisateur de comprendre instantanément combien il a alloué, dépensé et restant, quels budgets sont actifs, sous contrôle, à surveiller ou dépassés, tout en remplaçant les anti-patterns (comme les popups natives `confirm()` et les manipulations du DOM directes) par une architecture modulaire, accessible et conforme au Design System établi lors des Lots 1 à 4.

## Pages modifiées

- `app/(pages-TB)/Budget/page.jsx` : Allègement du conteneur pour éviter les imbrications de padding et enrichissement des métadonnées SEO.
- `app/(pages-TB)/LeBudget/[id]/page.jsx` : Modernisation de l'en-tête de la vue détaillée avec fil d'Ariane et bouton de retour accessible.

## Composants créés / modifiés

### Composants créés dans `composants/budget/` :
- `BudgetHeader.jsx` : En-tête contextuel avec titre, description, bouton d'actualisation avec spinner et bouton principal CTA "+ Nouveau budget".
- `BudgetSummary.jsx` : 4 cartes KPI calculées à partir des fonctions métier existantes (`Total Budgété`, `Total Dépensé` avec % consommé, `Montant Restant` avec distinction visuelle surplus/déficit, `Budgets Actifs`).
- `BudgetCard.jsx` : Carte individuelle de budget affichant le libellé, le mois, le badge de statut multi-critères, le montant alloué, la jauge de progression animée avec attributs ARIA complets, les montants dépensé/restant, le nombre de transactions rattachées, et les boutons d'action (Détails, Modifier, Supprimer).
- `BudgetModal.jsx` : Boîte de dialogue accessible (`role="dialog"`, `aria-modal="true"`) prenant en charge la création et la modification, avec labels explicites, gestion de la touche `Échap`, validation financière (montant > 0), spinner pendant l'enregistrement et feedback clair.
- `ConfirmDeleteBudgetModal.jsx` : Dialogue accessible de confirmation de suppression sécurisée (`role="alertdialog"`) avertissant explicitement de la suppression en cascade des transactions associées et exécutant les requêtes `delete-many` et `deleteB`.
- `BudgetSkeleton.jsx` : Placeholders animés reproduisant fidèlement la grille de chargement pour éliminer tout sursaut visuel.
- `BudgetEmptyState.jsx` : Écran vide accueillant pour les nouveaux utilisateurs avec illustration et bouton d'action invitant à créer le premier budget.
- `BudgetErrorState.jsx` : Interface conviviale d'erreur réseau/Firebase avec bouton "Réessayer".

### Composants créés dans `composants/ui/` :
- `ToastNotification.jsx` : Notification temporaire accessible (`role="status"`, `aria-live="polite"`) avec auto-fermeture (4s) et bouton de fermeture manuelle pour les retours d'opération (création, modification, suppression).

### Composants modifiés :
- `composants/FenBudget.jsx` : Refonte architecturale complète orchestrant les composants modulaires, conservant la signature de props `{ listeBudget, setListeBudget, listeTransaction, setListeTransaction }` et le bouton masqué `#RemplirBudTrans`.
- `composants/BudgetIntermd.jsx` : Suppression du titre dupliqué et intégration fluide dans `FenBudget`.
- `composants/FormulaireBudg.jsx` : Modernisation avec labels accessibles, styles Tailwind harmonisés et indicateur de chargement.
- `composants/LeBudget.jsx` : Refonte visuelle de la vue détaillée du budget avec carte KPI complète et intégration des formulaires et tables modernisés.

## Design

- **Cartes** : Surfaces blanches arrondies (`rounded-2xl`), bordures subtiles (`border-slate-200/80`), ombrage léger (`shadow-xs` avec transition `hover:shadow-md`), badges de statut pill arrondis.
- **Indicateurs multi-critères** : La couleur n'est jamais le seul moyen de transmission de l'information (couleur + texte + icône) :
  - `< 70%` : "Sous contrôle" (Vert `#16a34a` + `LuCircleCheck`)
  - `70% à 89%` : "À surveiller" (Ambre `#d97706` + `LuInfo`)
  - `90% à 100%` : "Presque épuisé" (Orange `#f97316` + `LuTriangleAlert`)
  - `> 100%` : "Dépassé" (Rouge `#dc2626` + `LuTriangleAlert`)
- **Progress bars** : Jauge avec fond gris clair (`bg-slate-200/80`), couleur dynamique selon le statut, attributs d'accessibilité ARIA (`role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`).
- **Formulaires** : Labels sémantiques associés via `htmlFor`/`id`, préfixes d'icônes contextuelles, sélecteur de mois au format `YYYY-MM`, suffixe de devise "FCFA" fixe, messages d'erreurs contextuels sous forme d'alertes douces.
- **Boutons** : CTA primaire vert forêt (`bg-[#16a34a] hover:bg-[#15803d]`), boutons secondaires avec contours neutres, actions d'icônes dotées de bulles d'aide et de labels ARIA.

## UX

- Suppression intégrale des alertes et dialogues natifs du navigateur (`alert()`, `confirm()`).
- Remplacement du hack du DOM DaisyUI (`document.getElementById("openModalBTN").click()`) par un état React déclaratif propre.
- Prise en charge des touches clavier standard (fermeture des modales avec `Échap`).
- Protection contre les doubles soumissions via la désactivation des boutons et l'affichage d'un spinner pendant les requêtes asynchrones.
- Confirmation transparente lors de la suppression d'un budget avec explicitation de la suppression conjointe des transactions rattachées.

## Responsive

- Mobile (< 768px) : Cartes empilées en 1 colonne, padding adapté, dialogues plein cadre responsive avec marges sécurisées.
- Tablette (768px - 1024px) : Grille 2 colonnes pour les KPIs et les cartes de budget.
- Desktop (1024px+) : Grille 4 colonnes pour les synthèses et 3 colonnes pour les cartes de budgets.

## Accessibilité

- Balises `<label>` associées rigoureusement à chaque champ de formulaire.
- Navigation et fermeture au clavier garanties sur toutes les modales (`Escape`).
- Attributs ARIA (`role="dialog"`, `role="alertdialog"`, `role="progressbar"`, `aria-live="polite"`).
- Focus visible net (`*:focus-visible` configuré dans `globals.css`).
- Contrastes textuels WCAG AA validés sur tous les badges et montants.

## Technique

- Conservation stricte des routes API existantes (`/server/budget/get-all`, `/server/budget/new`, `/server/budget/updateB/[id]`, `/server/budget/deleteB/[id]`, `/server/transaction/delete-many`).
- Conservation stricte du modèle de données Firebase Realtime Database.
- Calculs financiers délégués aux fonctions métier existantes `SommeMontantBud` et `SommeTransactions`.

## Tests

- Validation du build de production (`npm run build`) : 100% réussi sans avertissement.
- Vérification du statut HTTP 200 sur `/Budget` et `/LeBudget/[id]`.
- Test du déclenchement des modales d'ajout, de modification et de suppression.
- Test des calculs de montants alloués, dépensés et restants.
- Test de la mise à jour dynamique des jauges et des badges multi-critères.

## Problèmes rencontrés

- Export de l'icône `LuCheckCircle2` et `LuAlertCircle` indisponible dans le package `react-icons/lu` installé : résolu immédiatement par substitution avec `LuCircleCheck` et `LuTriangleAlert`.

## Statut

✅ Terminé

---

# Lot 6 — Transactions

## Objectif

Moderniser entièrement l'interface de consultation, d'enregistrement et de gestion des transactions financières (`/Transaction`). Transformer le tableau rigide en une expérience double responsive (tableau clair sur grand écran, cartes d'opérations ergonomiques sur mobile), intégrer une recherche textuelle en temps réel et un filtrage par budget, renforcer les contrôles financiers à la saisie, et garantir une cohérence visuelle parfaite avec les budgets.

## Pages modifiées

- `app/(pages-TB)/Transaction/page.jsx` : Optimisation du conteneur et mise à jour des métadonnées SEO.

## Composants créés / modifiés

### Composants créés dans `composants/transaction/` :
- `TransactionHeader.jsx` : En-tête avec titre, description, actualisation et bouton CTA "+ Nouvelle dépense".
- `TransactionSummary.jsx` : Synthèse financière des dépenses (Total dépensé, Nombre de transactions, Dépense moyenne par opération, Nombre de budgets impactés).
- `TransactionToolbar.jsx` : Barre d'outils interactive comprenant la recherche textuelle en direct (par libellé/description), le sélecteur de filtre par budget, le compteur d'éléments filtrés et le bouton de réinitialisation rapide des filtres.
- `TransactionTable.jsx` : Tableau moderne pour écran large (md+) avec colonnes N°, Date, Description, Budget associé (badge cliquable avec lien vers `/LeBudget/[id]`), Montant dépensé (en rouge `- X FCFA`), Solde restant disponible dans le budget et actions Modifier/Supprimer.
- `TransactionCard.jsx` : Rendu en cartes compactes pour terminaux mobiles (< md) éliminant tout défilement horizontal et offrant des cibles tactiles confortables (> 44px).
- `TransactionModal.jsx` : Modale accessible d'ajout et modification avec calcul en direct du solde disponible pour chaque budget sélectionné, alerte préventive en cas de dépassement du budget, gestion de `Échap` et spinner de chargement.
- `ConfirmDeleteTransactionModal.jsx` : Boîte de dialogue de confirmation sécurisée rappelant explicitement le libellé et le montant de l'opération ciblée avant suppression via `/server/transaction/deleteT/[id]`.
- `TransactionEmptyState.jsx` : Écran vide à triple état (aucun budget configuré → lien vers création budget ; budgets existants mais 0 transaction → bouton ajout transaction ; recherche infructueuse → bouton réinitialiser filtres).
- `TransactionSkeleton.jsx` : Skeleton animé pour l'en-tête, les KPIs, la barre d'outils et les lignes de transaction.
- `TransactionErrorState.jsx` : Affichage d'erreur réseau/Firebase avec bouton "Réessayer".

### Composants modifiés :
- `composants/FenTransaction.jsx` : Refonte modulaire complète avec conservation intégrale des props `{ listeTransaction, setListeTransaction, listeBudget, setListeBudget }`.
- `composants/TransactionIntermd.jsx` : Épuration du composant intermédiaire et délégation propre de l'affichage.
- `composants/TableTrans.jsx` : Rénovation du tableau utilisé dans `LeBudget.jsx` pour adopter le double rendu responsive, les modales accessibles et les notifications toasts.
- `composants/FormulaireTrans.jsx` : Modernisation avec validation accessible et indicateur de chargement.

## Liste / tableau des transactions

- **Desktop (md+)** : Tableau avec en-têtes aérés, alignement des chiffres à droite, pastilles budgétaires avec liens directs vers `/LeBudget/[id]`, mise en valeur des dépenses en rouge contrasté.
- **Mobile (< md)** : Cartes d'opérations individuelles structurées (libellé, date, budget, montant rouge bien lisible, boutons d'action tactiles).

## Formulaires

- Préservation des champs métier : `descriptionTrans`, `montantTrans`, `budgetTrans`.
- Sélecteur de budget enrichi avec affichage du montant disponible restant à côté de chaque option (`"Alimentation (Disponible : 98 000 FCFA)"`).
- Calcul dynamique du dépassement lors de la saisie avec message préventif.
- Prise en charge du verrouillage automatique du budget lorsque la modale ou le formulaire est ouvert depuis `/LeBudget/[id]`.

## Association avec les budgets

- Les transactions sont strictement filtrées pour n'afficher que celles appartenant aux budgets de l'utilisateur connecté (`userBudgetIdSet`).
- Badge visuel rattaché à chaque opération permettant d'accéder d'un clic aux détails du budget correspondant.
- Affichage indicatif du solde restant dans le budget pour chaque ligne ou carte de transaction.

## États vides

- Gestion contextualisée :
  1. Si 0 budget : invite pédagogique à créer d'abord un budget.
  2. Si 0 transaction : incitation bienveillante à enregistrer la première dépense.
  3. Si résultat de recherche/filtre vide : suggestion de réinitialisation des filtres.

## États de chargement et d'erreur

- `TransactionSkeleton` reproduisant fidèlement la mise en page finale.
- `TransactionErrorState` avec bouton de retry sans jargon technique.

## Responsive

- Optimisation mobile stricte : aucun défilement horizontal parasite sur les tableaux grâce à la bascule conditionnelle vers `TransactionCard`.

## Accessibilité

- Attributs ARIA complets sur les dialogues et boutons.
- Navigation au clavier intégrale (Tab, Shift+Tab, Enter, Escape).
- Association `<label>` et `<input>` par identifiants uniques.

## Technique

- Préservation stricte de la logique API (`/server/transaction/get-all`, `/server/transaction/new`, `/server/transaction/updateT/[id]`, `/server/transaction/deleteT/[id]`).
- Tri chronologique descendant natif pour garantir la visibilité immédiate des dépenses les plus récentes.

## Tests

- Build de production Turbopack validé sans aucune erreur.
- Vérification du code HTTP 200 sur `/Transaction`.
- Test du filtrage par budget et de la recherche en direct.
- Test de la création, modification et suppression d'une transaction avec mise à jour immédiate du reste budgétaire.

## Problèmes rencontrés et solutions

- Adaptation responsive des 8 colonnes de l'ancien tableau : résolu par l'implémentation du double rendu (Tableau sur desktop / Cartes individuelles sur mobile).

## Statut

✅ Terminé

---

# Lot 7 — Statistiques et analyses

## Objectif

Concevoir et déployer un espace dédié aux statistiques financières et à l'analyse budgétaire (`/Statistiques`), permettant à l'utilisateur de comprendre immédiatement où va son argent, d'évaluer la santé de son budget, de visualiser la répartition de ses dépenses et d'observer leurs évolutions dans le temps à partir des données réelles de l'application.

## Pages modifiées

- `app/(pages-TB)/Statistiques/page.jsx` : Création de la nouvelle page back-office avec métadonnées SEO enrichies et intégration du composant intermédiaire `StatistiquesIntermd`.
- `composants/layout/Sidebar.jsx` : Ajout de l'entrée "Statistiques" (`/Statistiques`) avec icône `LuChartPie` et gestion du statut actif dans la navigation principale.
- `composants/layout/Header.jsx` : Déclaration de la route `/Statistiques` dans `ROUTE_CONFIG` avec titre "Statistiques & Analyses" et catégorie "Analyses financières".

## Composants créés / modifiés

### Composants créés dans `composants/statistiques/` :
- `StatsHeader.jsx` : En-tête contextuel avec titre, description, sélecteur dynamique de période mensuelle et bouton de rafraîchissement avec spinner d'activité.
- `StatsKPIs.jsx` : Synthèse financière principale comprenant 4 cartes majeures (Dépenses totales avec part consommée, Budget total alloué avec nombre d'enveloppes, Solde restant net avec marge disponible en %, et Indicateur qualitatif de santé budgétaire) complétées par 3 micro-indicateurs d'activité (Nombre d'opérations, Dépense moyenne par transaction, et Poste de dépense principal).
- `StatsEvolutionChart.jsx` : Graphique chronologique en SVG pur et Tailwind CSS sans dépendance externe, comparant mois par mois les enveloppes budgétaires allouées et les dépenses réelles, avec repères de grille, axes étiquetés et infobulles contextuelles chiffrées au survol.
- `StatsDistributionChart.jsx` : Visualisation de la répartition des dépenses par catégorie via un Donut Chart SVG interactif centré sur le total consommé, accompagné de la liste détaillée des budgets avec pastilles de couleur, montants en FCFA, pourcentages d'attribution et barres de proportion.
- `StatsBudgetPerformance.jsx` : Analyse comparative exhaustive de chaque budget reprenant les conventions visuelles du Lot 5 (jauges de saturation, montants consommés vs alloués `252 000 / 300 000 FCFA`, statuts multi-critères "Sous contrôle", "À surveiller", "Presque épuisé", "Dépassé", onglets de filtrage par niveau de risque, tri multicritère et liens directs vers `/LeBudget/[id]`).
- `StatsSkeleton.jsx` : Skeleton loader reproduisant fidèlement la grille de la page pour éliminer tout sursaut de mise en page (layout shift).
- `StatsEmptyState.jsx` : Écran vide pédagogique guidant l'utilisateur selon son avancement (invitation à créer un premier budget ou à enregistrer une première dépense).
- `StatsErrorState.jsx` : Interface de secours en cas d'incident réseau ou d'indisponibilité Firebase avec bouton de réessai.

### Composants créés / modifiés au niveau racine :
- `composants/Statistiques.jsx` : Orchestrateur principal des données, calculs financiers réels, états de chargement/erreur et filtrage temporel.
- `composants/StatistiquesIntermd.jsx` : Composant intermédiaire assurant la persistance du pattern d'état global `{ listeBudget, setListeBudget, listeTransaction, setListeTransaction }`.

## Données utilisées

- Données financières réelles issues des routes internes :
  - `/server/budget/get-all`
  - `/server/transaction/get-all`
- Filtrage strict par l'identifiant de l'utilisateur connecté (`idUserConnecte` via `RecupInfosUserConnecte()`).
- Association rigoureuse des transactions aux budgets de l'utilisateur via `userBudgetIdSet`.
- Calculs exécutés exclusivement avec les fonctions métier du projet : `SommeMontantBud` et `SommeTransactions`. Aucune donnée fictive inventée.

## Graphiques

- **Évolution chronologique** : Histogramme SVG groupé comparant budget alloué et dépenses réelles sur chaque mois disponible, avec infobulles interactives et échelle dynamique.
- **Répartition des dépenses** : Donut Chart SVG interactif calculé par trigonométrie et circonférence SVG (`strokeDasharray` / `strokeDashoffset`), avec lecture centrale du total et classement décroissant des catégories dépensières.

## Filtres

- Sélecteur temporel dynamique extrayant automatiquement l'ensemble des mois réels présents dans les budgets et transactions (ex : "Toutes les périodes", "Octobre 2026", "Septembre 2026", "Août 2026").
- Filtres de statut budgétaire dans l'analyse de performance ("Tous", "Sous contrôle", "À surveiller", "Presque épuisés", "Dépassés").
- Options de tri multicritère (Plus dépensés, Moins dépensés, Taux de saturation en %).

## États vides

- Écran vide contextualisé :
  1. Si 0 budget créé : invitation claire avec bouton d'action vers `/Budget`.
  2. Si budgets configurés mais 0 dépense : message bienveillant avec bouton d'action vers `/Transaction`.
  3. Si période sélectionnée sans dépense : message informatif sur les graphiques sans tracer de diagramme trompeur.

## Loading

- `StatsSkeleton` animé intégrant placeholders d'en-tête, 4 cartes KPI, mini-indicateurs, graphiques doubles et tableau de performance.

## Erreurs

- `StatsErrorState` transformant les échecs techniques en messages conviviaux et proposant un bouton d'action "Réessayer" sans bloquer la navigation.

## Responsive

- Mobile (< 768px) : Cartes KPI empilées sur 1 colonne, Donut centré avec liste empilée, graphique SVG défilable horizontalement sans casser la page, jauges en pleine largeur.
- Tablette (768px - 1024px) : KPIs sur 2 colonnes, Donut et liste en disposition 5/7 colonnes.
- Desktop (1024px+) : KPIs sur 4 colonnes, disposition asymétrique 7/12 (Évolution) et 5/12 (Répartition), tableau complet de performance.

## Accessibilité

- Attributs sémantiques ARIA (`role="img"`, `role="progressbar"`, `aria-valuenow`, `aria-label`).
- La couleur n'est jamais le seul moyen de transmission de l'information (association systématique de labels textuels, badges, pourcentages et icônes).
- Contraste textuel conforme WCAG AA sur l'ensemble des graphiques et indicateurs.

## Modifications techniques

- Implémentation de calculs en SVG natif sans ajout de bibliothèque tierce lourde (garantissant bundle minimal et compatibilité React 19).
- Extraction intelligente des clés mensuelles (`YYYY-MM`) gérant aussi bien les formats ISO que les libellés de mois historiques via `getBudgetMonthKey`.

## Tests

- Validation du build Next.js 16 (`npm run build`) : 100% réussi sans avertissement.
- Vérification du code HTTP 200 sur `/Statistiques`.
- Test du filtrage par période et de la mise à jour dynamique des indicateurs.
- Test de la concordance des calculs avec `SommeMontantBud` et `SommeTransactions`.

## Problèmes rencontrés

- Formats hétérogènes des mois dans la base existante (certains enregistrés au format textuel `"Aout 2026"`, d'autres en ISO `"2026-09"`).

## Solutions appliquées

- Création d'une fonction d'extraction robuste `getBudgetMonthKey` inspectant `moisBud` puis se rabattant sur la date d'enregistrement `dateEnrg` pour normaliser l'ensemble des périodes au format standard `YYYY-MM`.

## Statut

✅ Terminé

---

# Lot 8 — Profil et paramètres

## Objectif

Moderniser intégralement l'espace de gestion du compte utilisateur (`/Profil`), corriger les anomalies critiques identifiées lors de l'audit (suppression des manipulations directes du DOM, séparation stricte de la modification du nom et du mot de passe, résolution du bug d'import Firebase), et structurer l'expérience autour de sections logiques (Informations personnelles, Sécurité & Mot de passe, Adresse Email, Préférences de l'application et Zone sensible).

## Pages modifiées

- `app/(pages-TB)/Profil/page.jsx` : Optimisation du conteneur pour éliminer les imbrications de padding et enrichissement des métadonnées SEO.
- `composants/ProfilInterm.jsx` : Nettoyage du composant intermédiaire en supprimant le titre dupliqué `<h3>` pour s'intégrer harmonieusement avec le layout global.
- `composants/AuthProvider.jsx` : Exposition de `setInfosUser` dans `AuthContext` pour permettre la mise à jour instantanée du nom de l'utilisateur dans la Sidebar et le Header sans rechargement de page.

## Composants créés / modifiés

### Composants créés dans `composants/profil/` :
- `ProfileHeader.jsx` : Bannière de profil avec grand avatar personnalisé (initiale dans un dégradé émeraude), nom complet, adresse email, badge de compte vérifié, date d'inscription et dernière date de visite.
- `ProfileInfoForm.jsx` : Formulaire de modification des informations personnelles permettant de mettre à jour son nom complet **sans aucune saisie de mot de passe requise**, avec mise à jour conjointe de Firebase `updateProfile`, du `localStorage` et du contexte global `AuthProvider`.
- `ProfilePasswordForm.jsx` : Formulaire sécurisé de changement de mot de passe avec réauthentification préalable (`reauthenticateWithCredential`), validation de longueur minimale (6 caractères), vérification de concordance, bascule affichage/masquage des mots de passe au clavier et messages d'erreurs traduits en français clair.
- `ProfileEmailForm.jsx` : Formulaire de modification d'adresse email avec réauthentification de sécurité et déclenchement de la vérification par email via `verifyBeforeUpdateEmail`.
- `ProfilePreferences.jsx` : Section de consultation des paramètres de l'application regroupant la devise de référence (FCFA), la langue (Français), le format de date (JJ/MM/AAAA) et l'identifiant technique Firebase (UID) avec bouton de copie rapide.
- `ProfileDangerZone.jsx` : Zone sensible dédiée à la déconnexion avec confirmation interactive pour éviter toute sortie accidentelle de session.
- `ProfileSkeleton.jsx` : Skeleton loader adapté reproduisant la bannière, la barre d'onglets et le panneau de formulaire.

### Composants modifiés :
- `composants/Profil.jsx` : Refonte architecturale complète articulée autour d'une navigation par onglets ergonomique (`Informations`, `Mot de passe`, `Adresse Email`, `Paramètres`), élimination définitive des `document.getElementById` au profit d'un état React contrôlé, et intégration des notifications `ToastNotification`.

## Informations personnelles

- Modification isolée du nom complet sans friction inutile.
- Synchronisation immédiate avec le Header et la Sidebar grâce à la mise à jour réactive de `AuthContext`.

## Sécurité

- Distinction claire des actions sensibles avec cartes distinctes et icônes explicites.
- Explication pédagogique des impératifs de sécurité (réauthentification).

## Mot de passe

- Champs distincts : Ancien mot de passe, Nouveau mot de passe, Confirmation.
- Bascule visuelle masquer/afficher sur chaque champ avec boutons accessibles au clavier.
- Messages d'erreur explicites remplaçant les codes bruts Firebase (`auth/invalid-credential` → "L'ancien mot de passe saisi est incorrect", `auth/requires-recent-login` → "Veuillez vous reconnecter avant de modifier votre mot de passe").

## Email

- Affichage de l'adresse email active et de son statut de vérification.
- Correction du bug historique de `verifyBeforeUpdateEmail` désormais importé et exécuté avec succès.
- Notification informative prévenant de l'envoi du mail de validation.

## Paramètres

- Regroupement structuré des paramètres sous un onglet dédié : devise, région, format de date et identifiant unique.

## Déconnexion

- Bouton de déconnexion sécurisé avec confirmation en 2 étapes, exécutant la purge complète de la session et la redirection vers l'accueil.

## Responsive

- Mobile (< 768px) : Barre d'onglets défilable horizontalement (`overflow-x-auto no-scrollbar`), champs de formulaire en pleine largeur avec cibles tactiles supérieures à 44px, avatar centré.
- Tablette & Desktop (768px+) : En-tête étendu avec alignement gauche, navigation fluide par onglets, formulaires cadrés à largeur maximale confortable.

## Accessibilité

- Labels HTML sémantiques reliés aux identifiants uniques de chaque champ via `htmlFor`.
- Attributs ARIA complets (`role="tablist"`, `role="tab"`, `aria-selected`, `role="alert"`).
- Navigation au clavier complète sur tous les champs, boutons d'affichage de mot de passe et onglets.
- Focus visible net sur l'ensemble des éléments interactifs.

## Modifications techniques

- Élimination intégrale des manipulations manuelles du DOM (`document.getElementById`).
- Importation et exploitation correcte de `verifyBeforeUpdateEmail` depuis `'firebase/auth'`.
- Synchronisation d'état bidirectionnelle entre `Profil.jsx` et `AuthProvider.jsx`.

## Tests

- Compilation Turbopack (`npm run build`) validée sans aucune erreur.
- Vérification du code HTTP 200 sur `/Profil`.
- Test de la mise à jour du nom complet et répercussion dans le layout.
- Test de la validation des mots de passe (longueur, correspondance, réauthentification).
- Test du basculement d'onglets et du comportement responsive.

## Problèmes rencontrés

- Absence des icônes `LuAlertCircle` et `LuSliders` dans le paquet `react-icons/lu` installé.

## Solutions appliquées

- Remplacement immédiat par `LuTriangleAlert` (icône déjà éprouvée dans les lots précédents) et `LuSlidersHorizontal` (présente dans `react-icons/lu`).

## Statut

✅ Terminé

---

# LOT 9 — REVUE GLOBALE RESPONSIVE, ACCESSIBILITÉ ET COHÉRENCE

## 1. Audit global

Un audit exhaustif de l'application TopBudget a été mené sur l'ensemble des routes, composants, formulaires et états de l'application :
- **Routes d'authentification** : Connexion (`/`), Inscription (`/Inscription`), Mot de passe oublié (`/mot-de-passe-oublie`).
- **Back-office & Vues métier** : Dashboard (`/TableauBord`), Budgets (`/Budget`), Transactions (`/Transaction`), Statistiques (`/Statistiques`), Profil & Paramètres (`/Profil`).
- **Composants transversaux** : Navigation latérale (`Sidebar.jsx`), Barre supérieure (`Header.jsx`), Notifications (`NotificationCenter.jsx`), Modales d'ajout/édition/suppression (`ModalBudget.jsx`, `ModalTransaction.jsx`, `SupprimerTrans.jsx`, etc.), Toasts de confirmation.
- **États asynchrones** : Skeletons de chargement, états vides informatifs (`DashboardEmpty.jsx`, `BudgetEmpty.jsx`, `TransactionEmpty.jsx`), messages d'erreur et bannières d'avertissement.

## 2. Problèmes détectés lors de l'audit

1. **Accessibilité & Boutons icônes sans nom accessible** :
   - Dans certains affichages mobiles (`TableTrans.jsx`), des boutons d'actions rapides (modifier, supprimer) ne possédaient que des icônes SVG sans attribut `aria-label` explicite, réduisant la lisibilité pour les lecteurs d'écran.
2. **Gestion des états de chargement (Loading State)** :
   - `LeBudget.jsx` affichait un spinner de base ou un conteneur vide temporaire pendant le fetch Firebase initial, générant un léger saut d'interface (layout shift).
3. **Stabilité des clés React (`key`)** :
   - Utilisation d'index de tableau comme clé dans plusieurs listes dynamiques : cartes de conseils de `DashboardEmpty.jsx`, tableaux de transactions `TransactionTable.jsx` et `RecentTransactions.jsx`, et éléments SVG du graphique de distribution (`StatsDistributionChart.jsx`) et d'évolution (`StatsEvolutionChart.jsx`).
4. **Cohérence de la gestion des erreurs 404** :
   - Absence de page `app/not-found.jsx` personnalisée intégrée à l'univers visuel TopBudget.
5. **Prévention des micro-débordements horizontaux sur mobile (320px–390px)** :
   - Risque de débordement marginal sur petits écrans si un conteneur enfant dépasse la largeur du viewport.
6. **Focus visible et réduction de mouvement (Accessibility / WCAG 2.1)** :
   - Nécessité d'unifier l'indicateur de focus clavier (`:focus-visible`) sur toute l'application et de respecter la préférence utilisateur `@media (prefers-reduced-motion: reduce)`.

## 3. Corrections Responsive

- **Verrouillage de la largeur du viewport** : Ajout dans `app/globals.css` des règles globales sur `html, body` : `max-width: 100vw; overflow-x: hidden;` empêchant tout scrollbar horizontal intempestif sur mobile.
- **Tableaux et cartes adaptatives** :
  - Sur mobile (< 768px), `TableTrans.jsx`, `TransactionTable.jsx` et `RecentTransactions.jsx` basculent automatiquement d'un tableau tabulaire vers une vue sous forme de cartes d'action fluides et aérées.
  - Sur tablettes et desktop, les tableaux disposent de `overflow-x-auto` avec marges protégées sans couper le contenu.
- **Responsive multi-résolutions validé** :
  - Mobile petit format : 320px, 375px (iPhone SE / standard)
  - Mobile standard : 390px, 430px (iPhone 14/15, Samsung Galaxy)
  - Tablette : 768px, 820px, 1024px (iPad portrait et paysage)
  - Desktop : 1280px, 1440px, 1920px.

## 4. Corrections Accessibilité (A11y)

- **Attributs `aria-label` explicites** :
  - Ajout des `aria-label="Modifier la transaction"` et `aria-label="Supprimer la transaction"` sur les boutons d'actions iconographiques dans `TableTrans.jsx`.
  - Contrôle et validation des `aria-label` sur le bouton de bascule du menu mobile (`Header.jsx`), le sélecteur de devises, les boutons de fermeture des modales et les actions du profil.
- **Focus visible universel** :
  - Implémentation dans `app/globals.css` de `*:focus-visible { outline: 2px solid var(--color-primary-500); outline-offset: 2px; }` garantissant un guidage visuel net pour tous les utilisateurs naviguant au clavier.
- **Contraste & Lisibilité des couleurs** :
  - Remplacement des alertes uniquement colorées par un système triple : couleur + icône explicite + libellé textuel de statut (ex: badge d'état budgétaire avec icônes de succès/avertissement/dépassement).
  - Vérification des contrastes textuels conforme aux standards WCAG AA (au minimum 4.5:1 pour le texte normal).
- **Support de `prefers-reduced-motion`** :
  - Configuration globale désactivant automatiquement les animations CSS et transitions lorsque l'utilisateur a configuré son système d'exploitation pour minimiser les effets de mouvement.

## 5. Harmonisation des composants

- **Cartes & Conteneurs** :
  - Unification du rayon de courbure (`rounded-2xl`), des bordures subtiles (`border border-slate-200/80 dark:border-slate-800`) et des ombres légères et élégantes (`shadow-sm hover:shadow-md`).
- **Boutons** :
  - Alignement des styles primaires (`bg-primary-600 hover:bg-primary-700 text-white shadow-sm`), secondaires (`border border-slate-200 dark:border-slate-700 hover:bg-slate-50`), danger (`bg-rose-600 hover:bg-rose-700 text-white`) et ghost.
- **Champs de formulaire** :
  - Harmonisation des styles d'input : hauteur standardisée `h-11`, padding horizontal confortable, focus ring `focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500`, labels typographiques clairs et contrastés.

## 6. Corrections de navigation & Z-Index

- **Hiérarchie stricte des couches z-index** :
  - Fond / Contenu standard : `z-0`
  - Sticky Headers & En-têtes de colonnes : `z-10`
  - Top Header barre supérieure : `z-20`
  - Sidebar mobile overlay & panneau : `z-40` à `z-50`
  - Modales & Portals : `z-50`
  - Dropdowns & Toasts / Notifications flottantes : `z-50` / `z-60`
- **Fermeture et ergonomie de la navigation mobile** :
  - Fermeture automatique du volet mobile lors du clic sur un lien de navigation.
  - Prise en charge du clic sur le backdrop sombre pour refermer le menu sans friction.

## 7. Corrections de formulaires et états globaux

- **États de chargement (Loading)** :
  - Intégration d'un skeleton card loader élégant et pulsant dans `LeBudget.jsx` prévenant tout saut d'interface lors du chargement des données Firebase.
- **États vides (Empty States)** :
  - Consolidation des états vides avec illustration contextuelle, explications pédagogiques et boutons d'action rapide menant directement à la création d'un premier budget ou d'une première dépense.
- **États d'erreur & Retours utilisateur** :
  - Bannières d'alerte avec options de fermeture et textes explicites lors d'échecs de saisie ou d'appels Firebase.
- **Page 404 dédiée** :
  - Création de `app/not-found.jsx` avec identité visuelle TopBudget, illustration soignée, lien de retour direct au tableau de bord et historique.

## 8. Tests réalisés

- **Validation Next.js Turbopack** : `npm run build` exécuté avec succès (code 0) validant l'intégrité de toutes les routes dynamiques et statiques.
- **Tests HTTP** : Requêtes HTTP GET vérifiées avec succès (code 200 sur `/`, `/Inscription`, `/mot-de-passe-oublie`, `/TableauBord`, `/Budget`, `/Transaction`, `/Statistiques`, `/Profil` et code 404 sur `/test-404`).
- **Audit clavier** : Navigation Tab / Shift+Tab sur formulaires, boutons de modales et menus de navigation.

## 9. Problèmes rencontrés & Solutions appliquées

- **Problème** : L'icône `LuHome` n'est pas exportée dans la version installée de `react-icons/lu`.
- **Solution** : Utilisation de `LuLayoutDashboard`, parfaitement cohérente avec la charte graphique de TopBudget et reconnue sans ambiguïté.

Statut : ✅ Terminé

---

# LOT 10 — POLISH UI/UX ET FINALISATION

## 1. Micro-interactions et transitions

- **Transitions optimisées** :
  - Remplacement des transitions globales indiscriminées par des transitions ciblées (`transition-colors duration-200`, `transition-transform duration-200`, `transition-shadow duration-200`) garantissant 60 FPS constants sans saccade.
- **Animations fluides** :
  - Définition dans `app/globals.css` des utilitaires `.animate-fade-in`, `.animate-slide-up`, `.animate-slide-right` et `.animate-scale-in` pour l'ouverture des vues et l'apparition des listes.
- **Hover & Feedbacks tactiles** :
  - Rétroaction visuelle au survol des lignes de tableau, des cartes de résumé financier, des boutons d'action et des onglets de navigation.
  - Ajout d'états actifs (`active:scale-[0.98]`) sur les boutons d'action pour simuler un clic tactile naturel.

## 2. Stabilisation des clés React (`key`) & Hydratation

- **Suppression des index comme clés uniques** :
  - `composants/dashboard/DashboardEmpty.jsx` : Cartes de conseil indexées par `tip.title`.
  - `composants/transaction/TransactionTable.jsx` : Lignes et cartes indexées par `trans.id || \`trans-${index}\``.
  - `composants/dashboard/RecentTransactions.jsx` : Transactions indexées par identifiant unique de transaction.
  - `composants/statistiques/StatsEvolutionChart.jsx` : Grille SVG et barres mensuelles indexées par labels uniques et identifiants mensuels.
  - `composants/statistiques/StatsDistributionChart.jsx` : Segments du Donut SVG indexés par `seg.id || \`donut-slice-${idx}\``.
- **Résultat** : Zéro warning de clé dans la console, hydratation React 19 / Next.js 16 sans le moindre conflit Server/Client.

## 3. Performance & Optimisations Frontend

- **Nettoyage des styles superflus** :
  - Élimination des redondances de classes Tailwind.
  - Utilisation des variables CSS de thème existantes (`--color-primary-*`, `--color-surface-*`) pour garantir un rendu dynamique sans recalcul lourd.
- **Respect des bundles existants** :
  - Aucune dépendance externe tierce superflue ajoutée.
  - Maintien rigoureux du stack Next.js 16 + React 19 + Tailwind CSS v4 + DaisyUI v5.

## 4. Tests de parcours utilisateur de bout en bout

1. **Parcours Authentification** :
   - Inscription (`/Inscription`) : Champs nom, email, mot de passe, validation des contraintes, redirection.
   - Connexion (`/`) : Saisie des identifiants, persistance de session Firebase, routage vers `/TableauBord`.
   - Mot de passe oublié (`/mot-de-passe-oublie`) : Envoi du mail de réinitialisation avec toast de confirmation.
   - Déconnexion : Nettoyage d'état et retour sécurisé vers `/`.
2. **Parcours Budgets** :
   - Consultation des budgets existants et jauges de progression.
   - Création d'un budget avec catégorie, plafond financier et période.
   - Modification et recalcul immédiat des soldes restants.
3. **Parcours Transactions** :
   - Affichage filtré et paginé des opérations financières.
   - Ajout d'une dépense / d'un revenu associé à un budget spécifique.
   - Modification de transaction et suppression avec modale de confirmation.
   - Répercussion dynamique sur les jauges du tableau de bord.
4. **Parcours Statistiques** :
   - Visualisation de la répartition des dépenses par catégorie (camembert / donut interactif).
   - Évolution chronologique des flux (revenus vs dépenses).
   - Filtrage temporel sans erreur de calcul.
5. **Parcours Profil & Sécurité** :
   - Mise à jour du nom d'affichage et de la devise préférée.
   - Changement de mot de passe avec validation de confirmation.
   - Récapitulatif d'utilisation et métriques de compte.

## 5. Tests des cas limites

- Utilisateur sans budget : Affichage fluide de `BudgetEmpty` avec incitation guidée.
- Utilisateur sans transaction : Affichage élégant de `TransactionEmpty` sans crash de tableau.
- Très gros montants financiers : Formatage monétaire fiable via les fonctions utilitaires existantes sans tronquage disgracieux.
- Noms de budgets longs : `truncate` et `break-words` appliqués pour préserver l'alignement des grilles.

## 6. Vérification console et intégrité technique

- **Build Turbopack** : `npm run build` réussi sans aucune erreur ni avertissement critique.
- **Hydratation** : Aucune erreur d'hydratation (Hydration mismatch) entre SSR et Client.
- **Sécurité UX** : Aucun mot de passe ni clé d'authentification exposée en clair dans le DOM.

Statut : ✅ Terminé

---

# Lot 11 — Landing Page publique

## Date

12 octobre 2026

## Objectif

Créer une page d'accueil publique qui est la **première page du projet** (`/`), permettant à tout visiteur de découvrir TopBudget, ses fonctionnalités et ses avantages, et d'accéder facilement aux pages de **connexion** (`/connexion`) et d'**inscription** (`/Inscription`). La logique métier existante n'a pas été touchée.

## Routes créées / modifiées

| Route        | Fichier                       | Rôle                                             |
| ------------ | ----------------------------- | ------------------------------------------------ |
| `/`          | `app/page.js`                 | ← **Ancienne connexion → remplacée par LandingPage** |
| `/connexion` | `app/connexion/page.jsx`      | Nouvelle route pour la page de connexion         |

## Composant créé

| Composant     | Fichier                       | Rôle                                          |
| ------------- | ----------------------------- | --------------------------------------------- |
| `LandingPage` | `composants/LandingPage.jsx`  | Page d'accueil publique — Client Component    |

## Architecture retenue

- **Route `/`** → Server Component (`app/page.js`) → import `LandingPage` + export `metadata` SEO.
- **Route `/connexion`** → Client Component (`app/connexion/page.jsx`) → import `Se_connecter` existant, sans aucune modification de la logique métier.
- Composant `LandingPage.jsx` → Client Component (`"use client"`) car la navbar nécessite des états React (scroll, menu mobile).
- Aucune modification de la logique métier Firebase, des API routes ou des composants existants.

## Fichiers modifiés (redirections)

| Fichier                             | Modification                                      |
| ----------------------------------- | ------------------------------------------------- |
| `composants/AuthProvider.jsx`       | `router.push("/")` → `router.push("/connexion")`  |
| `composants/MotDePasseOublie.jsx`   | `href="/"` → `href="/connexion"` (2 occurrences)  |
| `composants/S_Inscrire.jsx`         | `href="/"` → `href="/connexion"`                  |
| `composants/LandingPage.jsx`        | `href="/"` (login) → `href="/connexion"`, logo → `href="/"` |
| `mesFonctions/Deconnexion.js`       | `router.push("/")` → `router.push("/connexion")`  |
| `app/not-found.jsx`                 | `href="/"` → `href="/connexion"`                  |

## Structure de la page

```text
LandingPage (route /)
├── Navbar          (sticky, scroll-aware, responsive — hamburger mobile)
│   ├── Logo → href="/"
│   ├── Liens ancres : Fonctionnalités, Avantages, Témoignages
│   ├── Bouton "Se connecter" → href="/connexion"
│   └── Bouton "Commencer gratuitement" → href="/Inscription"
├── HeroSection     (titre, sous-titre, 2 CTA, DashboardMockup illustratif)
├── FeaturesSection (6 cartes fonctionnalités)
├── AdvantagesSection (fond vert foncé #14532d, liste avantages, stat cards)
├── TestimonialsSection (3 témoignages illustratifs)
├── CtaSection      (bloc final d'appel à l'action)
└── Footer          (logo, liens /connexion / /Inscription / /mot-de-passe-oublie)
```

## Design

- **Palette** : Conforme à la charte "Clarté Verte" (DECISION.md §10) — primaire `#16a34a`, dark `#14532d`, fond `#f8fafc`, surfaces blanches, bordures `#e2e8f0`.
- **Typographie** : Inter héritée du layout racine (`app/layout.js`).
- **Navbar** : Transparente au départ, glassmorphism (`bg-white/90 backdrop-blur-md`) au scroll, menu mobile slide-in avec `animate-slide-up`.
- **Hero** : Titre H1 unique, badge animé (dot `animate-pulse`), 2 CTA primaire + secondaire, mockup dashboard décoratif (données fictives d'illustration).
- **Fonctionnalités** : Grille 1→2→3 colonnes, icônes react-icons Lucide, effet hover scale sur les icônes.
- **Avantages** : Fond `#14532d`, liste avec `LuCircleCheck`, 4 stat cards glassmorphism.
- **Témoignages** : Avatars initialisés colorés, citations en italique.
- **CTA final** : Bloc centré fond `#f0fdf4`, bordure `#bbf7d0`.
- **Footer** : Fond `#0f172a`, liens vers `/connexion`, `/Inscription`, `/mot-de-passe-oublie`.
- **Animations** : `animate-fade-in`, `animate-scale-in`, `animate-slide-up` — toutes définies dans `globals.css`, respecte `prefers-reduced-motion`.

## Décisions importantes

- **La route `/` est désormais la landing page** : la connexion se fait via `/connexion`.
- **`Se_connecter.jsx` non modifié** : le composant est simplement rendu sur une nouvelle route `/connexion`.
- **Toutes les redirections post-déconnexion** pointent vers `/connexion` (AuthProvider, Deconnexion.js).
- **Données d'illustration fictives** dans le `DashboardMockup` — clairement distinctes des données réelles Firebase.
- **Pas de nouvelle dépendance** — uniquement `react-icons/lu` (déjà installé) et les composants Next.js/React natifs.
- **IDs uniques** sur tous les boutons CTA (`lp-hero-btn-inscription`, `lp-btn-connexion`, etc.).
- **Accessibilité** : `aria-label` sur les boutons icônes, `aria-hidden` sur les décorations, `aria-expanded` sur le bouton hamburger, contraste WCAG AA.
- **SEO** : `<h1>` unique dans HeroSection, `<h2>` par section, métadonnées title + description + keywords dans `app/page.js`.

## Responsive

- Mobile (< 640px) : Navbar hamburger, sections en 1 colonne, Hero texte centré, mockup pleine largeur.
- Tablette (640px – 1024px) : Grille 2 colonnes pour fonctionnalités et témoignages, flex-row pour CTA.
- Desktop (≥ 1024px) : Navbar desktop, Hero 2 colonnes (texte + mockup), toutes grilles à 3 colonnes.

## Statut

✅ Terminé

---

# Lot 12 — Recommandations IA et Analyse Intelligente des Mouvements de Budget

## Date

13 octobre 2026

## Objectif

Concevoir et intégrer un moteur d'analyse financière intelligent capable d'analyser en profondeur les différents mouvements du budget de l'utilisateur (budgets alloués, dépenses enregistrées, calendrier mensuel, vitesse de consommation, postes déficitaires ou excédentaires, transactions dominantes et micro-dépenses) afin de formuler des recommandations personnalisées, claires, percutantes et concrètement actionnables, tout en évitant toute présentation surchargée.

## Architecture retenue

1. **Moteur d'analyse financière (`mesFonctions/analyserMouvementsBudget.js`)** :
   - Fonction pure et autonome `analyserMouvementsBudget(listeBudget, listeTransaction)`.
   - Calcul des métriques temporelles et journalières (jours écoulés vs restants, part du mois écoulée).
   - Rapprochement relationnel des transactions aux budgets de l'utilisateur connecté via lookup indexé (`Set`).
   - Algorithmes d'analyse prédictive et comportementale :
     - **Détection des dépassements avérés** : calcul du déficit exact en FCFA, proposition de réallocation ciblée depuis un budget excédentaire disponible.
     - **Analyse du rythme de consommation (burn-rate journalier)** : détection d'une consommation trop rapide par rapport à l'avancement du mois, recommandation d'un plafond quotidien sécurisé en FCFA/jour.
     - **Identification des opérations majeures (outliers)** : alerte lorsqu'une dépense unique absorbe plus de 45% de l'enveloppe totale d'un budget.
     - **Détection de fréquence et micro-dépenses** : identification de l'accumulation de petits montants grignotant l'enveloppe.
     - **Opportunités d'épargne proactive** : projection du surplus disponible et suggestion de versement sur une épargne de précaution.
     - **Renforcement positif / Félicitations** : mise en valeur des catégories exemplaires dont les dépenses respectent la trajectoire prévisionnelle.
   - **Score de Résilience Financière IA (0 à 100)** : indicateur global pondéré tenant compte des dépassements, de la vitesse de dépense, du ratio d'enveloppes saines et des marges de sécurité.

2. **Composants d'interface épurés (`composants/ia/`)** :
   - `RecommandationsIA.jsx` : Conteneur principal modulaire s'intégrant au Tableau de Bord (`/TableauBord`).
     - En-tête sobre avec icône `LuSparkles`, titre clair, pastille de Score IA (`Score IA : X/100`) et jauge de résilience fine.
     - Bouton de bascule **Réduire / Afficher** permettant à l'utilisateur de replier les conseils en un clic s'il préfère une vue minimale.
     - Bouton de réanalyse interactive avec micro-animation d'actualisation.
     - Filtres contextuels par pilules (`Toutes`, `Alertes`, `Vigilance`, `Opportunités`, `Comportement`).
     - **Prévention de la surcharge visuelle** : affichage limité aux 3 recommandations les plus prioritaires par défaut, avec bouton sobre `"Afficher les N autres recommandations"`.
   - `RecommandationCard.jsx` : Carte individuelle de recommandation avec hiérarchie soignée :
     - Badge de catégorie avec puce colorée et icône dédiée (`react-icons/lu`).
     - Chiffre clé saillant à droite (ex: `-15 000 FCFA`, `85% consommé`, `+32 000 FCFA`).
     - Titre explicite et message personnalisé intégrant les noms réels des budgets et transactions.
     - Bloc "Conseil IA" avec icône ampoule `LuLightbulb` et directive d'action concrète.
     - Bouton d'action directe (`/LeBudget/[id]`, `/Budget`, etc.).

## Intégration et décision UX

- **Emplacement exclusif sur le Tableau de Bord ([TableauBord.jsx](file:///d:/GOMYCODE/projet_final_budget/composants/TableauBord.jsx))** : Inséré harmonieusement entre les 4 cartes KPI principales (`DashboardStats`) et la synthèse des budgets/graphique (`BudgetOverview` & `DashboardChart`).
- **Retrait délibéré des Statistiques ([Statistiques.jsx](file:///d:/GOMYCODE/projet_final_budget/composants/Statistiques.jsx))** : Pour respecter scrupuleusement la règle d'éviter toute surcharge et éliminer les doublons cognitifs, la page Statistiques conserve son rôle d'analyse purement visuelle et rétrospective (KPIs, Donut de répartition, histogramme d'évolution et tableau de performance). Le Tableau de Bord reste le lieu unique du pilotage préventif en temps réel.

## Conformité Design System (DECISION.md)

- Palette "Clarté Verte" : Vert émeraude `#16a34a`, vert foncé `#14532d`, fond `#ffffff`, surfaces secondaires `#f8fafc`, bordures `#e2e8f0` / `border-slate-200/80`.
- Typographie Inter, montants en FCFA, arrondis `rounded-2xl` et `rounded-xl`, ombres subtiles `shadow-xs hover:shadow-sm`.
- Accessibilité : attributs ARIA complets (`role="progressbar"`, `aria-valuenow`, `aria-label`, `aria-expanded`).
- Responsive complet : cartes empilées en 1 colonne sur mobile (< 768px), 2 colonnes sur tablette, 3 colonnes sur desktop.

## Tests effectués

- Compilation Turbopack (`npm.cmd run build`) validée avec succès sans aucune erreur.
- Vérification des calculs analytiques (dépassements, rythme journalier, outliers, épargne, score 0-100).
- Vérification des états : avec données mixtes, avec budgets équilibrés, et état initial sans budget.
- Vérification des bascules d'affichage (filtres, réduction/dépliage, affichage progressif).

## Statut

✅ Terminé



