import { KING_SYSTEM_PROMPT } from './systemPrompt.js'

/**
 * Appel à l'API Google Gemini
 */
async function callGemini(messages) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("Clé API Gemini absente (GEMINI_API_KEY).")
  }

  // Modèles testés par ordre de disponibilité (ou modèle personnalisé défini dans .env)
  const configuredGemini = process.env.GEMINI_MODEL?.trim()
  const models = configuredGemini
    ? [configuredGemini, 'gemini-3.8-flash']
    : ['gemini-3.8-flash']
  let lastError = null


  // Formatage de l'historique pour Gemini
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content || '' }],
  }))

  for (const model of models) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 18000)

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: KING_SYSTEM_PROMPT }],
          },
          contents,
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 1024,
          },
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errBody = await response.text().catch(() => '')
        throw new Error(`Gemini HTTP ${response.status} (${model}): ${errBody}`)
      }

      const data = await response.json()
      const candidateText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

      if (!candidateText) {
        throw new Error(`Réponse Gemini vide (${model}).`)
      }

      return candidateText
    } catch (err) {
      lastError = err
      console.warn(`[Chatbot King] Essai Gemini ${model} en échec:`, err.message)
    }
  }

  throw lastError || new Error("Gemini a échoué.")
}

/**
 * Appel à l'API Mistral AI
 */
async function callMistral(messages) {
  const apiKey = process.env.MISTRAL_API_KEY || process.env.NEXT_PUBLIC_MISTRAL_API_KEY
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("Clé API Mistral absente (MISTRAL_API_KEY).")
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 18000)

  const formattedMessages = [
    { role: 'system', content: KING_SYSTEM_PROMPT },
    ...messages.map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content || '',
    })),
  ]

  const model = process.env.MISTRAL_MODEL || 'mistral-small-latest'

  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model,
        messages: formattedMessages,
        temperature: 0.4,
        max_tokens: 1024,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errBody = await response.text().catch(() => '')
      throw new Error(`Mistral HTTP ${response.status}: ${errBody}`)
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content?.trim()

    if (!content) {
      throw new Error("Réponse Mistral vide.")
    }

    return content
  } catch (err) {
    clearTimeout(timeoutId)
    throw err
  }
}

/**
 * Appel à l'API OpenRouter
 */
async function callOpenRouter(messages) {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
  if (!apiKey || apiKey.trim() === '') {
    throw new Error("Clé API OpenRouter absente (OPENROUTER_API_KEY).")
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 18000)

  const formattedMessages = [
    { role: 'system', content: KING_SYSTEM_PROMPT },
    ...messages.map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content || '',
    })),
  ]

  const model = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free'

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey.trim()}`,
        'HTTP-Referer': 'https://topbudget.app',
        'X-Title': 'TopBudget King Assistant',
      },
      body: JSON.stringify({
        model,
        messages: formattedMessages,
        temperature: 0.4,
        max_tokens: 1024,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errBody = await response.text().catch(() => '')
      throw new Error(`OpenRouter HTTP ${response.status}: ${errBody}`)
    }

    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content?.trim()

    if (!content) {
      throw new Error("Réponse OpenRouter vide.")
    }

    return content
  } catch (err) {
    clearTimeout(timeoutId)
    throw err
  }
}

/**
 * Réponse intelligente de secours local (si aucune clé API n'est encore injectée
 * ou si tous les fournisseurs externes sont momentanément inaccessibles)
 */
function getLocalFallbackResponse(userQuestion = '') {
  const q = userQuestion.toLowerCase()

  if (q.includes('bonjour') || q.includes('salut') || q.includes('hello')) {
    return "Bonjour ! Je suis King, conseiller clientèle chez TopBudget. C'est un réel plaisir de vous accueillir ! Comment puis-je vous aider aujourd'hui dans la gestion de votre budget ?"
  }
  if (q.includes('robot') || q.includes('ia') || q.includes('machine') || q.includes('humain')) {
    return "Pas du tout ! Je suis King, votre conseiller chez TopBudget. Je suis là pour vous accompagner pas à pas dans la gestion de votre budget."
  }
  if (q.includes('gratuit') || q.includes('prix') || q.includes('tarif') || q.includes('payer')) {
    return "TopBudget est 100% gratuit ! Vous pouvez créer autant d'enveloppes et enregistrer autant de dépenses que vous le souhaitez sans aucun abonnement ni publicité."
  }
  if (q.includes('banque') || q.includes('compte bancaire') || q.includes('carte')) {
    return "Absolument pas ! Pour préserver votre sécurité et votre vie privée, TopBudget ne se connecte à aucun compte bancaire. Vous saisissez librement vos budgets et vos dépenses."
  }
  if (q.includes('score') || q.includes('santé')) {
    return "Notre score de santé financière est une note sur 100 calculée selon la régularité et le respect de vos budgets : 85–100 (Excellente maîtrise 🟢), 70–84 (Bonne gestion 🔵), 50–69 (Vigilance 🟡), moins de 50 (Tension financière 🔴)."
  }
  if (q.includes('mot de passe') || q.includes('oubli')) {
    return "Pas d'inquiétude ! Rendez-vous sur la page /mot-de-passe-oublie, entrez votre adresse email et vous recevrez aussitôt un lien sécurisé pour définir un nouveau mot de passe."
  }
  if (q.includes('enveloppe') || q.includes('budget')) {
    return "Pour créer une enveloppe de budget, rendez-vous dans l'onglet Budgets (/Budget), cliquez sur 'Nouveau budget', nommez-le (ex: Alimentation, Transport) et attribuez-lui un montant plafond pour le mois. C'est simple et immédiat !"
  }

  return "Bonjour ! Je suis King, votre conseiller chez TopBudget. Mon interface est 100% prête. Les clés API (Gemini, Mistral, OpenRouter) sont actuellement en cours de finalisation dans les paramètres du serveur. En attendant, n'hésitez pas à explorer nos fonctionnalités ou à créer votre compte gratuitement !"
}

/**
 * Fonction maîtresse avec cascade de modèles :
 * 1. Gemini (principal)
 * 2. Si échec -> Mistral (fallback 1)
 * 3. Si échec -> OpenRouter (fallback 2)
 * 4. Si échec -> Réponse de secours King
 */
export async function generateKingResponse(messages = []) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error("Aucun message fourni pour la conversation.")
  }

  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || ''

  // 1. TENTATIVE GEMINI (MODÈLE PRINCIPAL)
  console.log('[Chatbot King] 1. Exécution du modèle principal : Google Gemini...')
  try {
    const text = await callGemini(messages)
    console.log('[Chatbot King] Succès avec Gemini.')
    return {
      text,
      provider: 'gemini',
      modelUsed: 'Google Gemini',
    }
  } catch (geminiError) {
    console.warn('[Chatbot King] Échec Gemini :', geminiError.message)
    console.log('[Chatbot King] 2. Bascule vers Fallback 1 : Mistral AI...')

    // 2. TENTATIVE MISTRAL (FALLBACK 1)
    try {
      const text = await callMistral(messages)
      console.log('[Chatbot King] Succès avec Mistral (Fallback 1).')
      return {
        text,
        provider: 'mistral',
        modelUsed: 'Mistral AI',
      }
    } catch (mistralError) {
      console.warn('[Chatbot King] Échec Mistral :', mistralError.message)
      console.log('[Chatbot King] 3. Bascule vers Fallback 2 : OpenRouter...')

      // 3. TENTATIVE OPENROUTER (FALLBACK 2)
      try {
        const text = await callOpenRouter(messages)
        console.log('[Chatbot King] Succès avec OpenRouter (Fallback 2).')
        return {
          text,
          provider: 'openrouter',
          modelUsed: 'OpenRouter',
        }
      } catch (openRouterError) {
        console.error('[Chatbot King] Échec OpenRouter :', openRouterError.message)
        console.warn('[Chatbot King] Tous les modèles distants ont échoué ou clés non fournies. Utilisation du fallback local King.')

        const fallbackText = getLocalFallbackResponse(lastUserMessage)
        return {
          text: fallbackText,
          provider: 'local-king',
          modelUsed: 'King Advisor (Local)',
          fallbackReasons: {
            gemini: geminiError.message,
            mistral: mistralError.message,
            openrouter: openRouterError.message,
          },
        }
      }
    }
  }
}
