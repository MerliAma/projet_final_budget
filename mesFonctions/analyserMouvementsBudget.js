/**
 * Formate un montant numérique en FCFA avec séparateurs de milliers.
 * @param {number} montant 
 * @returns {string}
 */
export function formaterFCFA(montant) {
  const n = Number(montant) || 0
  return `${Math.round(n).toLocaleString('fr-FR')} FCFA`
}

/**
 * Calcule la somme de tous les budgets alloués.
 */
export function calculerTotalAlloue(budgets = []) {
  if (!Array.isArray(budgets)) return 0
  return budgets.reduce((acc, b) => acc + (Number(b?.montantBud) || 0), 0)
}

/**
 * Calcule la somme des transactions appartenant aux budgets indiqués.
 */
export function calculerTotalDepense(budgets = [], transactions = []) {
  if (!Array.isArray(budgets) || !Array.isArray(transactions)) return 0
  const budgetIdSet = new Set(budgets.map(b => String(b.id)))
  return transactions
    .filter(t => budgetIdSet.has(String(t?.budgetTrans)))
    .reduce((acc, t) => acc + (Number(t?.montantTrans) || 0), 0)
}

/**
 * Analyse complète et intelligente des mouvements de budget (budgets et transactions).
 * Génère des métriques avancées, un score de santé financière (0-100) et des recommandations
 * personnalisées, ciblées et concrètes.
 * 
 * @param {Array} listeBudget - Liste des budgets de l'utilisateur
 * @param {Array} listeTransaction - Liste de toutes les transactions
 * @returns {Object} { scoreIA, diagnostic, synthese, stats, recommandations }
 */
export function analyserMouvementsBudget(listeBudget = [], listeTransaction = []) {
  const budgets = Array.isArray(listeBudget) ? listeBudget : []
  const transactions = Array.isArray(listeTransaction) ? listeTransaction : []

  // Cas limite : aucun budget
  if (budgets.length === 0) {
    return {
      scoreIA: 0,
      diagnostic: 'En attente de budget',
      synthese: 'Créez votre premier budget pour activer les analyses et recommandations IA.',
      stats: {
        totalAlloue: 0,
        totalDepense: 0,
        soldeRestant: 0,
        tauxConsommation: 0,
        nbBudgets: 0,
        nbTransactions: 0,
        nbDepasses: 0,
        nbSousControle: 0
      },
      recommandations: []
    }
  }

  // 1. Calendrier et temporalité du mois en cours
  const maintenant = new Date()
  const jourActuel = maintenant.getDate()
  const joursDansMois = new Date(maintenant.getFullYear(), maintenant.getMonth() + 1, 0).getDate()
  const joursRestants = Math.max(1, joursDansMois - jourActuel + 1)
  const partMoisEcoulee = Math.min(100, Math.round((jourActuel / joursDansMois) * 100))

  // 2. Lookup des transactions rattachées aux budgets de l'utilisateur
  const budgetIdSet = new Set(budgets.map(b => String(b.id)))
  const transactionsUtilisateur = transactions.filter(t => budgetIdSet.has(String(t.budgetTrans)))

  // 3. Calculs financiers globaux
  const totalAlloue = calculerTotalAlloue(budgets)
  const totalDepense = calculerTotalDepense(budgets, transactionsUtilisateur)
  const soldeRestant = totalAlloue - totalDepense
  const tauxConsommation = totalAlloue > 0 ? Math.round((totalDepense / totalAlloue) * 100) : 0

  // 4. Analyse détaillée par budget
  const analysesBudgets = budgets.map(budget => {
    const id = String(budget.id)
    const titre = (budget.descriptionBud || budget.titreBud || 'Sans titre').trim()
    const alloue = Number(budget.montantBud || 0)
    
    // Transactions spécifiques à ce budget
    const transDuBudget = transactionsUtilisateur
      .filter(t => String(t.budgetTrans) === id)
      .sort((a, b) => (Number(b.montantTrans) || 0) - (Number(a.montantTrans) || 0)) // Tri par montant décroissant

    const depense = transDuBudget.reduce((acc, t) => acc + (Number(t.montantTrans) || 0), 0)
    const reste = alloue - depense
    const taux = alloue > 0 ? Math.round((depense / alloue) * 100) : 0
    const nbTrans = transDuBudget.length

    // Transaction la plus importante (outlier)
    const maxTrans = transDuBudget.length > 0 ? transDuBudget[0] : null
    const montantMaxTrans = maxTrans ? Number(maxTrans.montantTrans || 0) : 0
    const partMaxTrans = alloue > 0 ? Math.round((montantMaxTrans / alloue) * 100) : 0

    // Rythme quotidien
    const rythmeDepenseJour = jourActuel > 0 ? Math.round(depense / jourActuel) : 0
    const plafondJournalierConseille = reste > 0 ? Math.round(reste / joursRestants) : 0

    return {
      id,
      titre,
      alloue,
      depense,
      reste,
      taux,
      nbTrans,
      transDuBudget,
      maxTrans,
      montantMaxTrans,
      partMaxTrans,
      rythmeDepenseJour,
      plafondJournalierConseille,
      moisBud: budget.moisBud || ''
    }
  })

  // 5. Comptages synthétiques
  const budgetsDepasses = analysesBudgets.filter(b => b.reste < 0)
  const budgetsCritiques = analysesBudgets.filter(b => b.reste >= 0 && b.taux >= 85)
  const budgetsSousControle = analysesBudgets.filter(b => b.reste >= 0 && b.taux < 70)
  const budgetsSurplus = analysesBudgets.filter(b => b.alloue > 0 && b.taux < 50 && b.reste >= 15000)

  // 6. Calcul du Score IA de résilience financière (0 - 100)
  let scoreCalcule = 100

  // Pénalité par budget dépassé (fort impact)
  scoreCalcule -= budgetsDepasses.length * 20

  // Pénalité par budget en seuil critique (>= 85%)
  scoreCalcule -= budgetsCritiques.length * 10

  // Pénalité si le taux global dépasse l'avancement du mois de plus de 20 points
  if (tauxConsommation > partMoisEcoulee + 20) {
    scoreCalcule -= 12
  }

  // Pénalité si déficit global
  if (soldeRestant < 0) {
    scoreCalcule -= 18
  }

  // Bonus proportionnel pour les budgets bien maîtrisés
  if (analysesBudgets.length > 0) {
    const ratioSousControle = budgetsSousControle.length / analysesBudgets.length
    scoreCalcule += Math.round(ratioSousControle * 10)
  }

  // Normalisation du score entre 15 et 100
  const scoreIA = Math.min(100, Math.max(15, Math.round(scoreCalcule)))

  let diagnostic = 'Excellente maîtrise'
  let diagnosticColor = 'emerald'
  if (scoreIA < 50) {
    diagnostic = 'Déficit ou forte tension'
    diagnosticColor = 'rose'
  } else if (scoreIA < 70) {
    diagnostic = 'Vigilance recommandée'
    diagnosticColor = 'amber'
  } else if (scoreIA < 85) {
    diagnostic = 'Bonne gestion budgétaire'
    diagnosticColor = 'teal'
  }

  // 7. Génération des recommandations personnalisées
  const recs = []

  // RÈGLE 1 : Alertes de dépassement avéré (Priorité 1 - Critique)
  budgetsDepasses.forEach(b => {
    const deficit = Math.abs(b.reste)
    // Trouver un budget avec du surplus pour proposer un rééquilibrage automatique
    const budgetDonateur = budgetsSurplus.find(don => don.id !== b.id)

    let conseilAction = `Gelez immédiatement les dépenses non prioritaires sur ce poste jusqu'au prochain cycle.`
    if (budgetDonateur) {
      const montantSuggere = Math.min(deficit, Math.round(budgetDonateur.reste * 0.7))
      conseilAction = `Conseil IA : Réallouez ${formaterFCFA(montantSuggere)} depuis "${budgetDonateur.titre}" (qui dispose de ${formaterFCFA(budgetDonateur.reste)} restants) pour compenser ce découvert sans emprunt.`
    }

    recs.push({
      id: `depassement-${b.id}`,
      priorite: 1,
      type: 'alerte',
      categorie: 'Dépassement',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      dotColor: 'bg-rose-500',
      titre: `Dépassement de budget sur "${b.titre}"`,
      budgetNom: b.titre,
      budgetId: b.id,
      chiffreCle: `-${formaterFCFA(deficit)}`,
      chiffreLabel: 'Déficit constaté',
      message: `Votre enveloppe "${b.titre}" est dépassée de ${formaterFCFA(deficit)} (consommation à ${b.taux}% de votre plafond initial de ${formaterFCFA(b.alloue)}).`,
      conseil: conseilAction,
      actionLabel: `Ajuster ${b.titre}`,
      actionHref: `/LeBudget/${b.id}`
    })
  })

  // RÈGLE 2 : Rythme de dépense trop rapide par rapport au calendrier (Priorité 2 - Vigilance)
  analysesBudgets.forEach(b => {
    // Si pas dépassé mais déjà >= 75% alors qu'on est au début ou milieu de mois
    if (b.reste > 0 && b.taux >= 75 && partMoisEcoulee < 75) {
      const plafondJour = b.plafondJournalierConseille
      recs.push({
        id: `rythme-${b.id}`,
        priorite: 2,
        type: 'vigilance',
        categorie: 'Rythme élevé',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
        dotColor: 'bg-amber-500',
        titre: `Consommation accélérée sur "${b.titre}"`,
        budgetNom: b.titre,
        budgetId: b.id,
        chiffreCle: `${b.taux}% consommé`,
        chiffreLabel: `Au jour ${jourActuel}/${joursDansMois}`,
        message: `Vous avez déjà utilisé ${b.taux}% de "${b.titre}" alors que le mois n'est écoulé qu'à ${partMoisEcoulee}%. Il vous reste ${formaterFCFA(b.reste)} pour les ${joursRestants} prochains jours.`,
        conseil: `Conseil IA : Limitez vos dépenses sur cette catégorie à maximum ${formaterFCFA(plafondJour)} par jour pour préserver votre solde jusqu'à la fin du mois.`,
        actionLabel: `Voir les dépenses`,
        actionHref: `/LeBudget/${b.id}`
      })
    }
  })

  // RÈGLE 3 : Dépense isolée atypique ou dominante (Priorité 2 - Habitudes)
  analysesBudgets.forEach(b => {
    if (b.maxTrans && b.partMaxTrans >= 45 && b.alloue > 0) {
      const desc = b.maxTrans.descriptionTrans || 'Opération'
      recs.push({
        id: `outlier-${b.id}`,
        priorite: 2,
        type: 'habitude',
        categorie: 'Dépense majeure',
        badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        dotColor: 'bg-indigo-500',
        titre: `Impact d'une dépense unique sur "${b.titre}"`,
        budgetNom: b.titre,
        budgetId: b.id,
        chiffreCle: `${b.partMaxTrans}% du budget`,
        chiffreLabel: formaterFCFA(b.montantMaxTrans),
        message: `La dépense unique "${desc}" (${formaterFCFA(b.montantMaxTrans)}) représente à elle seule ${b.partMaxTrans}% de l'enveloppe totale allouée à "${b.titre}".`,
        conseil: `Conseil IA : Cette sortie ponctuelle pèse lourdement sur la marge restante. Vérifiez si une partie de ce montant peut être ventilée sur un budget dédié aux imprévus.`,
        actionLabel: `Examiner la transaction`,
        actionHref: `/LeBudget/${b.id}`
      })
    }
  })

  // RÈGLE 4 : Concentration de micro-dépenses répétées (Priorité 3 - Optimisation)
  analysesBudgets.forEach(b => {
    if (b.nbTrans >= 5 && b.taux >= 60 && b.alloue > 0) {
      const moyenne = b.nbTrans > 0 ? Math.round(b.depense / b.nbTrans) : 0
      recs.push({
        id: `microdepenses-${b.id}`,
        priorite: 3,
        type: 'habitude',
        categorie: 'Fréquence élevée',
        badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
        dotColor: 'bg-blue-500',
        titre: `Accumulation de micro-dépenses sur "${b.titre}"`,
        budgetNom: b.titre,
        budgetId: b.id,
        chiffreCle: `${b.nbTrans} opérations`,
        chiffreLabel: `Moyenne ${formaterFCFA(moyenne)}`,
        message: `Vous avez enregistré ${b.nbTrans} transactions sur "${b.titre}" pour un cumul de ${formaterFCFA(b.depense)}. La multiplication de petits achats grignote rapidement votre réserve.`,
        conseil: `Conseil IA : Regroupez vos achats hebdomadaires plutôt que quotidiens pour mieux contrôler vos sorties et économiser sur les frais annexes.`,
        actionLabel: `Voir l'historique`,
        actionHref: `/LeBudget/${b.id}`
      })
    }
  })

  // RÈGLE 5 : Opportunité d'épargne ou réallocation positive (Priorité 3 - Économies)
  if (soldeRestant > 0 && tauxConsommation < 80 && budgetsDepasses.length === 0) {
    const potentielEpargne = Math.round(soldeRestant * 0.4)
    recs.push({
      id: `epargne-globale`,
      priorite: 3,
      type: 'optimisation',
      categorie: 'Potentiel d\'épargne',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'bg-emerald-500',
      titre: `Capacité d'épargne prévisionnelle`,
      budgetNom: 'Enveloppe globale',
      budgetId: null,
      chiffreCle: `+${formaterFCFA(potentielEpargne)}`,
      chiffreLabel: 'Épargne suggérée',
      message: `Votre solde disponible global s'élève à ${formaterFCFA(soldeRestant)} (taux de dépenses contenu à ${tauxConsommation}%). En conservant cette cadence, vous disposez d'un excédent net.`,
      conseil: `Conseil IA : Versez préventivement ${formaterFCFA(potentielEpargne)} (40% de votre disponible) sur un compte d'épargne pour capitaliser sur votre bonne discipline.`,
      actionLabel: `Consulter les statistiques`,
      actionHref: `/Statistiques`
    })
  }

  // RÈGLE 6 : Félicitations sur une catégorie exemplaire (Priorité 3 - Bravo)
  const budgetExemplaire = analysesBudgets.find(b => b.alloue >= 30000 && b.nbTrans >= 2 && b.taux >= 25 && b.taux <= 60)
  if (budgetExemplaire && recs.length < 5) {
    recs.push({
      id: `felicitation-${budgetExemplaire.id}`,
      priorite: 3,
      type: 'succes',
      categorie: 'Excellente maîtrise',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'bg-[#16a34a]',
      titre: `Maîtrise remarquable de "${budgetExemplaire.titre}"`,
      budgetNom: budgetExemplaire.titre,
      budgetId: budgetExemplaire.id,
      chiffreCle: `${budgetExemplaire.taux}% utilisé`,
      chiffreLabel: `${formaterFCFA(budgetExemplaire.reste)} restants`,
      message: `Votre gestion du poste "${budgetExemplaire.titre}" est exemplaire : vos ${budgetExemplaire.nbTrans} dépenses respectent rigoureusement votre trajectoire prévisionnelle.`,
      conseil: `Conseil IA : Continuez sur cette dynamique, ce budget constitue le pilier de votre stabilité financière ce mois-ci.`,
      actionLabel: `Détail du budget`,
      actionHref: `/LeBudget/${budgetExemplaire.id}`
    })
  }

  // Si aucune règle spécifique ne s'est déclenchée (ex: utilisateur avec transactions modérées mais sans anomalie)
  if (recs.length === 0 && analysesBudgets.length > 0) {
    recs.push({
      id: 'equilibre-parfait',
      priorite: 3,
      type: 'succes',
      categorie: 'Équilibre parfait',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotColor: 'bg-emerald-500',
      titre: `Trajectoire budgétaire saine et équilibrée`,
      budgetNom: 'Tous vos budgets',
      budgetId: null,
      chiffreCle: `${tauxConsommation}% consommé`,
      chiffreLabel: `${formaterFCFA(soldeRestant)} disponibles`,
      message: `L'ensemble de vos mouvements financiers reste en deçà des seuils d'alerte. Vos dépenses progressent en harmonie avec le calendrier.`,
      conseil: `Conseil IA : Surveillez simplement vos prochaines échéances pour maintenir ce niveau de sécurité financière jusqu'au bouclage mensuel.`,
      actionLabel: `Voir le tableau de bord`,
      actionHref: `/TableauBord`
    })
  }

  // Tri par priorité croissante (1: alertes en premier, puis 2: vigilances, puis 3: optimisations)
  recs.sort((a, b) => a.priorite - b.priorite)

  // Synthèse globale en une phrase directrice
  let synthese = ''
  if (budgetsDepasses.length > 0) {
    synthese = `${budgetsDepasses.length} budget${budgetsDepasses.length > 1 ? 's sont en dépassement' : ' est en dépassement'}. Un rééquilibrage immédiat est préconisé.`
  } else if (budgetsCritiques.length > 0) {
    synthese = `${budgetsCritiques.length} budget${budgetsCritiques.length > 1 ? 's approchent' : ' approche'} de la saturation. Surveillez vos prochains engagements.`
  } else if (tauxConsommation < 60) {
    synthese = `Situation financière très saine avec ${formaterFCFA(soldeRestant)} de marge disponible pour atteindre vos objectifs.`
  } else {
    synthese = `Gestion globale équilibrée. Vos dépenses suivent une cadence cohérente avec le calendrier mensuel.`
  }

  return {
    scoreIA,
    diagnostic,
    diagnosticColor,
    synthese,
    stats: {
      totalAlloue,
      totalDepense,
      soldeRestant,
      tauxConsommation,
      nbBudgets: budgets.length,
      nbTransactions: transactionsUtilisateur.length,
      nbDepasses: budgetsDepasses.length,
      nbCritiques: budgetsCritiques.length,
      nbSousControle: budgetsSousControle.length,
      partMoisEcoulee,
      jourActuel,
      joursDansMois,
      joursRestants
    },
    analysesBudgets,
    recommandations: recs
  }
}
