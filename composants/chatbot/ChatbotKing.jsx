"use client"

import React, { useState, useEffect, useRef } from 'react'
import {
  LuX,
  LuSend,
  LuRotateCcw,
  LuSparkles,
  LuCheck,
} from 'react-icons/lu'

// Message d'accueil officiel de King
const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Bonjour ! Je m'appelle **King**, votre conseiller dédié chez **TopBudget**.\n\nJe suis ravi de vous accueillir ! Je suis là pour vous guider pas à pas dans la gestion de vos enveloppes, comprendre le fonctionnement de l'application et vous aider à optimiser vos dépenses.\n\nQue puis-je faire pour vous aujourd'hui ?",
  timestamp: "En ligne",
}

// Suggestions de questions rapides
const QUICK_QUESTIONS = [
  "Comment fonctionnent les enveloppes de budget ?",
  "Est-ce que l'application est payante ?",
  "Comment fonctionne le score de santé financière ?",
  "TopBudget a-t-il accès à mon compte bancaire ?",
  "Comment enregistrer une nouvelle dépense ?",
]

let messageSeq = 0
const nextId = (prefix) => {
  messageSeq += 1
  return `${prefix}-${messageSeq}`
}

const getFormattedTime = () => {
  try {
    return new Date().toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

/**
 * Formatage léger du texte pour afficher le gras (**texte**), les listes et les retours à la ligne
 */
function FormattedMessage({ text }) {
  if (!text) return null

  // Sépare en paragraphes
  const paragraphs = text.split('\n\n')

  return (
    <div className="space-y-2 text-[13.5px] leading-relaxed">
      {paragraphs.map((p, pIdx) => {
        const lines = p.split('\n')
        return (
          <div key={`p-${pIdx}`} className="space-y-1">
            {lines.map((line, lIdx) => {
              const isListItem = line.trim().startsWith('- ') || line.trim().startsWith('• ')
              const cleanLine = isListItem ? line.trim().replace(/^[-•]\s*/, '') : line

              // Parse du gras **mot**
              const parts = cleanLine.split(/(\*\*[^*]+\*\*)/g)

              const renderedParts = parts.map((part, partIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <strong key={`b-${partIdx}`} className="font-semibold text-slate-900">
                      {part.slice(2, -2)}
                    </strong>
                  )
                }
                return <span key={`t-${partIdx}`}>{part}</span>
              })

              if (isListItem) {
                return (
                  <div key={`li-${lIdx}`} className="flex items-start gap-2 pl-2">
                    <span className="text-[#16a34a] font-bold mt-1 text-xs">•</span>
                    <span className="flex-1">{renderedParts}</span>
                  </div>
                )
              }

              return (
                <p key={`l-${lIdx}`} className={lIdx > 0 ? "mt-1" : ""}>
                  {renderedParts}
                </p>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

/**
 * Composant Chatbot King
 * 100% responsive, persistant par session, avec bouton de réinitialisation pour nouveau chat.
 */
export default function ChatbotKing({ isOpen = false, setIsOpen = () => {} }) {
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Chargement asynchrone de l'historique de session côté client (évite tout mismatch d'hydratation)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('king_chat_history')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTimeout(() => {
            setMessages(parsed)
          }, 0)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  // Sauvegarde dans sessionStorage à chaque mise à jour
  useEffect(() => {
    try {
      if (messages.length > 0) {
        sessionStorage.setItem('king_chat_history', JSON.stringify(messages))
      }
    } catch {
      // ignore
    }
  }, [messages])

  // Défilement automatique vers le dernier message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading, isOpen])

  // Focus sur l'input à l'ouverture
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Envoi d'un message
  const handleSend = async (textToSend) => {
    const query = (textToSend || inputText).trim()
    if (!query || isLoading) return

    setInputText('')

    const userMessage = {
      id: nextId('user'),
      role: 'user',
      content: query,
      timestamp: getFormattedTime(),
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setIsLoading(true)

    try {
      // Prépare les messages pour l'API
      const apiPayload = updatedMessages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role: m.role,
          content: m.content,
        }))

      if (apiPayload.length === 0) {
        apiPayload.push({ role: 'user', content: query })
      }

      const response = await fetch('/server/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiPayload }),
      })

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`)
      }

      const data = await response.json()
      const replyText =
        data?.reply ||
        "Je suis désolé, je n'ai pas pu générer ma réponse. Pouvez-vous reformuler votre question ?"

      const assistantMessage = {
        id: nextId('assistant'),
        role: 'assistant',
        content: replyText,
        modelUsed: data?.modelUsed,
        timestamp: getFormattedTime(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      console.error("Erreur d'envoi Chatbot King:", err)
      const errorMessage = {
        id: nextId('err'),
        role: 'assistant',
        content:
          "Navré, une petite coupure temporaire est survenue lors de la transmission. N'hésitez pas à relancer votre question ou à vérifier votre connexion !",
        isError: true,
        timestamp: getFormattedTime(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Réinitialiser la conversation (Nouveau Chat)
  const handleResetChat = () => {
    const freshWelcome = {
      ...WELCOME_MESSAGE,
      timestamp: getFormattedTime(),
    }
    setMessages([freshWelcome])
    try {
      sessionStorage.removeItem('king_chat_history')
    } catch {
      // ignore
    }
    setShowResetConfirm(false)
    setInputText('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* ── BOUTON FLOTTANT DE DÉCLENCHEMENT ─────────────────────────────── */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          id="btn-open-chatbot-king"
          aria-label="Discuter avec l'assistant King"
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 group flex items-center gap-3 bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 px-4 py-3 sm:px-5 sm:py-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
        >
          {/* Avatar avec halo vert animé */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#16a34a] to-[#22c55e] flex items-center justify-center text-white font-bold text-sm shadow-md">
              K
            </div>
            <span
              className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full animate-pulse"
              title="En ligne"
            />
          </div>

          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-900 group-hover:text-[#16a34a] transition-colors leading-tight">
              Discuter avec King
            </p>
            <p className="text-[11px] text-slate-500 font-medium leading-tight">
              Conseiller TopBudget · En ligne
            </p>
          </div>
        </button>
      )}

      {/* ── FENÊTRE DU CHATBOT ───────────────────────────────────────────── */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="chatbot-king-title"
          className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 w-full sm:w-[440px] h-[100dvh] sm:h-[640px] sm:max-h-[88vh] bg-white sm:rounded-3xl shadow-2xl flex flex-col border border-slate-200/90 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          {/* Entête du Chat */}
          <div className="bg-gradient-to-r from-[#14532d] via-[#16a34a] to-[#15803d] text-white p-4 flex items-center justify-between shadow-sm relative">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-extrabold text-base border border-white/30 shadow-inner">
                  K
                </div>
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#14532d] rounded-full"
                  title="Disponible immédiatement"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 id="chatbot-king-title" className="text-base font-bold text-white tracking-tight">
                    King
                  </h2>
                  <span className="text-[10px] font-semibold bg-white/20 text-white/95 px-2 py-0.5 rounded-full border border-white/25">
                    Conseiller
                  </span>
                </div>
                <p className="text-xs text-white/80 font-normal">
                  Équipe TopBudget · Réponse instantanée
                </p>
              </div>
            </div>

            {/* Actions d'entête */}
            <div className="flex items-center gap-1">
              {/* Bouton Nouveau Chat / Réinitialiser */}
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                id="btn-reset-chat-king"
                title="Commencer un nouveau chat"
                aria-label="Commencer un nouveau chat"
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-all text-sm flex items-center gap-1.5"
              >
                <LuRotateCcw className="text-base" />
                <span className="text-xs font-medium hidden sm:inline">Nouveau chat</span>
              </button>

              {/* Bouton Fermer */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                id="btn-close-chatbot-king"
                aria-label="Fermer la discussion"
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/15 transition-all text-base"
              >
                <LuX className="text-lg" />
              </button>
            </div>

            {/* Modale de confirmation de réinitialisation */}
            {showResetConfirm && (
              <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 z-20 animate-in fade-in duration-150">
                <div className="text-center text-white">
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-1">
                    Nouveau chat
                  </p>
                  <p className="text-sm font-medium mb-3">
                    Voulez-vous effacer l&apos;historique et repartir de zéro ?
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetChat}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white transition-all shadow-sm"
                    >
                      Oui, recommencer
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowResetConfirm(false)}
                      className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-xs font-medium text-white transition-all"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Corps des messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#f8fafc]">
            {messages.map((msg) => {
              const isKing = msg.role === 'assistant'

              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isKing ? 'justify-start' : 'justify-end'}`}
                >
                  {isKing && (
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#16a34a] to-[#22c55e] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1 shadow-xs">
                      K
                    </div>
                  )}

                  <div className="max-w-[85%] sm:max-w-[80%] flex flex-col">
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-xs transition-all ${isKing
                          ? 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-sm'
                          : 'bg-[#16a34a] text-white rounded-tr-sm shadow-emerald-700/10'
                        }`}
                    >
                      {isKing ? (
                        <FormattedMessage text={msg.content} />
                      ) : (
                        <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      )}
                    </div>

                    {/* Heure et statut */}
                    <div
                      className={`flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 px-1 ${isKing ? 'justify-start' : 'justify-end'
                        }`}
                    >
                      <span>{msg.timestamp}</span>
                      {!isKing && <LuCheck className="text-emerald-600 text-xs" />}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Animation de King en train d'écrire */}
            {isLoading && (
              <div className="flex items-start gap-2.5 justify-start animate-fade-in">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#16a34a] to-[#22c55e] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1 shadow-xs">
                  K
                </div>
                <div className="bg-white border border-slate-200/80 text-slate-600 px-4 py-3 rounded-2xl rounded-tl-sm shadow-xs flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-[#16a34a] animate-bounce" />
                  </div>
                  <span className="text-xs text-slate-400 font-medium">King rédige sa réponse...</span>
                </div>
              </div>
            )}

            {/* Suggestions de questions rapides quand peu de messages */}
            {messages.length <= 2 && !isLoading && (
              <div className="pt-2 animate-fade-in">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <LuSparkles className="text-[#16a34a]" /> Questions fréquentes
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_QUESTIONS.map((question) => (
                    <button
                      key={question}
                      type="button"
                      onClick={() => handleSend(question)}
                      className="text-left text-xs bg-white hover:bg-[#f0fdf4] text-slate-700 hover:text-[#16a34a] border border-slate-200/80 hover:border-[#bbf7d0] px-3 py-1.5 rounded-xl transition-all shadow-xs hover:shadow-sm active:scale-[0.98]"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Formulaire de saisie */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200/80">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                id="chatbot-king-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Posez votre question à King..."
                disabled={isLoading}
                autoComplete="off"
                className="flex-1 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-[#16a34a] focus:bg-white text-slate-800 text-sm px-4 py-3 rounded-2xl outline-none focus:outline-none transition-all placeholder:text-slate-400 disabled:opacity-60"
              />

              <button
                type="submit"
                id="chatbot-king-btn-send"
                disabled={isLoading || !inputText.trim()}
                aria-label="Envoyer le message"
                className="bg-[#16a34a] hover:bg-[#15803d] disabled:bg-slate-200 disabled:text-slate-400 text-white p-3 rounded-2xl transition-all shadow-sm hover:shadow-md disabled:shadow-none flex-shrink-0 active:scale-[0.96]"
              >
                <LuSend className="text-lg" />
              </button>
            </form>

            <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-400">
              <span>TopBudget · Conseiller personnel en direct</span>
              <span>Touche Entrée ↵ pour envoyer</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
