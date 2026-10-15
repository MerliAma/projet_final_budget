"use client"

import React, { useState } from 'react'
import {
  LuArrowLeft,
  LuMail,
  LuUser,
  LuSend,
  LuCircleAlert,
  LuLoader,
  LuSparkles,
} from 'react-icons/lu'

const PRESET_SUBJECTS = [
  "Question sur mes budgets",
  "Assistance technique",
  "Suggestion d'amélioration",
  "Autre demande",
]

/**
 * Formulaire de contact intégré à l'assistant King
 * Permet d'envoyer un e-mail à l'équipe TopBudget via l'API Nodemailer
 */
export default function ContactKingForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Question sur mes budgets',
    message: '',
    sendCopy: true,
    honeypot: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg(null)

    // Validation côté client
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMsg('Veuillez entrer votre nom ou prénom (au moins 2 caractères).')
      return
    }

    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      setErrorMsg('Veuillez entrer une adresse e-mail valide.')
      return
    }

    if (!formData.message.trim() || formData.message.trim().length < 5) {
      setErrorMsg('Votre message doit contenir au moins 5 caractères.')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/server/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data?.error || `Erreur serveur (${response.status}). Veuillez réessayer.`
        )
      }

      // Succès
      if (onSuccess) {
        onSuccess({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          warning: data?.warning,
        })
      }
    } catch (err) {
      console.error('[ContactKingForm] Erreur :', err)
      setErrorMsg(
        err.message ||
          "Impossible de transmettre le message pour l'instant. Vérifiez votre connexion ou réessayez dans un instant."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto animate-in fade-in duration-200">
      {/* Barre de retour */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#f8fafc] border-b border-slate-200">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#16a34a] transition-colors py-1 px-2 rounded-lg hover:bg-slate-100"
        >
          <LuArrowLeft className="text-sm" />
          <span>Retour à la discussion</span>
        </button>
        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
          <LuSparkles className="text-emerald-600" />
          Service Support
        </span>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Titre et sous-titre */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center text-[#16a34a]">
              <LuMail className="text-base" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Écrire à l&apos;équipe TopBudget
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Remplissez ce formulaire et King transmettra immédiatement votre message à nos conseillers. Nous vous répondrons directement par e-mail.
          </p>
        </div>

        {/* Message d'erreur éventuel */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-shake">
            <LuCircleAlert className="text-base flex-shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">{errorMsg}</div>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-3.5 flex-1 flex flex-col">
          {/* Honeypot invisible pour les robots spams */}
          <input
            type="text"
            name="honeypot"
            value={formData.honeypot}
            onChange={handleChange}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          {/* Nom */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Votre nom complet <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <LuUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex : Koffi Amany"
                required
                disabled={isSubmitting}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#16a34a] rounded-xl text-xs sm:text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Votre adresse e-mail <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <LuMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Ex : koffi.amany@exemple.com"
                required
                disabled={isSubmitting}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#16a34a] rounded-xl text-xs sm:text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Sujet avec suggestions */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sujet de votre message
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Objet de la demande"
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#16a34a] rounded-xl text-xs sm:text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 mb-1.5"
            />
            {/* Badges de sujets prédéfinis */}
            <div className="flex flex-wrap gap-1">
              {PRESET_SUBJECTS.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, subject: sub }))}
                  className={`text-[10.5px] px-2.5 py-1 rounded-lg border transition-all ${
                    formData.subject === sub
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="flex-1 flex flex-col">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Votre message <span className="text-red-500">*</span>
            </label>
            <div className="relative flex-1 flex flex-col">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Décrivez votre situation ou votre question en quelques lignes..."
                required
                disabled={isSubmitting}
                className="w-full flex-1 p-3 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#16a34a] rounded-xl text-xs sm:text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 resize-none min-h-[90px]"
              />
            </div>
          </div>

          {/* Case à cocher pour accusé de réception */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-600">
            <input
              type="checkbox"
              name="sendCopy"
              checked={formData.sendCopy}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-4 h-4 rounded border-slate-300 text-[#16a34a] focus:ring-[#16a34a] accent-[#16a34a]"
            />
            <span>M&apos;envoyer un accusé de réception par e-mail</span>
          </label>

          {/* Bouton d'envoi */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#16a34a] hover:bg-[#15803d] disabled:bg-slate-300 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:shadow-none active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <LuLoader className="animate-spin text-base" />
                  <span>Envoi en cours à TopBudget...</span>
                </>
              ) : (
                <>
                  <LuSend className="text-base" />
                  <span>Envoyer mon e-mail</span>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              🔒 Vos données sont sécurisées et traitées en toute confidentialité.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
