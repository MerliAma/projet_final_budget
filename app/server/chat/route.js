import { NextResponse } from 'next/server'
import { generateKingResponse } from '@/lib/chatbot/aiClient'

export const dynamic = 'force-dynamic'

/**
 * Route API POST /server/chat
 * Reçoit la liste des messages de la conversation et retourne la réponse
 * générée par King via le modèle Gemini (principal), avec replis automatiques
 * sur Mistral puis OpenRouter en cas d'incident.
 */
export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}))
    const { messages } = body

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        {
          error: "Format de requête invalide : 'messages' doit être un tableau non vide.",
        },
        { status: 400 }
      )
    }

    // Normalisation des messages
    const sanitizedMessages = messages
      .filter((m) => m && typeof m.content === 'string' && m.content.trim().length > 0)
      .map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content.trim(),
      }))

    if (sanitizedMessages.length === 0) {
      return NextResponse.json(
        { error: "Aucun contenu de message valide détecté." },
        { status: 400 }
      )
    }

    // Appel à la cascade multi-modèles (Gemini -> Mistral -> OpenRouter)
    const result = await generateKingResponse(sanitizedMessages)

    return NextResponse.json({
      reply: result.text,
      provider: result.provider,
      modelUsed: result.modelUsed,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erreur serveur dans /server/chat :", error)
    return NextResponse.json(
      {
        error: "Une erreur est survenue lors du traitement du message.",
        details: error?.message || "Erreur interne",
      },
      { status: 500 }
    )
  }
}
