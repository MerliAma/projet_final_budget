import axios from 'axios'
import { NextResponse } from 'next/server'
import { sendContactEmail } from '@/lib/mailer/nodemailer'

export const dynamic = 'force-dynamic'

/**
 * Route API POST /server/contact
 * Permet aux utilisateurs d'envoyer un email à l'équipe TopBudget via l'assistant King.
 * Fonctionnalités :
 * - Validation stricte des données
 * - Protection anti-spam (honeypot)
 * - Sauvegarde sécurisée dans Firebase Realtime Database (collection contact_messages)
 * - Envoi de l'email via Nodemailer à l'équipe TopBudget + accusé de réception au client
 */
export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}))
    const { name, email, subject, message, sendCopy = true, honeypot } = body

    // 1. Protection Anti-Spam (champ honeypot invisible)
    if (honeypot) {
      return NextResponse.json(
        { message: 'Requête suspecte ignorée.' },
        { status: 400 }
      )
    }

    // 2. Validation des champs
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Veuillez renseigner votre nom (au moins 2 caractères).' },
        { status: 400 }
      )
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { error: 'Veuillez renseigner une adresse email valide.' },
        { status: 400 }
      )
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return NextResponse.json(
        { error: 'Votre message doit contenir au moins 5 caractères.' },
        { status: 400 }
      )
    }

    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()
    const cleanSubject = (subject && typeof subject === 'string' && subject.trim().length > 0)
      ? subject.trim()
      : 'Demande de contact via King'
    const cleanMessage = message.trim()
    const dateEnrg = new Date().toISOString()

    // 3. Sauvegarde dans Firebase Realtime Database (archivage sécurisé)
    let savedToDb = false
    let dbRecordId = null
    if (process.env.db_url && process.env.db_secret) {
      try {
        const dbRes = await axios.post(
          `${process.env.db_url}/contact_messages.json?auth=${process.env.db_secret}`,
          {
            name: cleanName,
            email: cleanEmail,
            subject: cleanSubject,
            message: cleanMessage,
            sendCopy: Boolean(sendCopy),
            source: 'chatbot_king',
            status: 'non_lu',
            dateEnrg,
          }
        )
        if (dbRes?.data?.name) {
          savedToDb = true
          dbRecordId = dbRes.data.name
        }
      } catch (dbErr) {
        console.warn('[Contact API] Impossible d’archiver dans Firebase :', dbErr.message)
      }
    }

    // 4. Envoi de l'email via Nodemailer
    try {
      const emailResult = await sendContactEmail({
        name: cleanName,
        email: cleanEmail,
        subject: cleanSubject,
        message: cleanMessage,
        sendCopy: Boolean(sendCopy),
      })

      return NextResponse.json({
        success: true,
        message: 'Votre message a bien été transmis à l’équipe TopBudget.',
        details: {
          savedToDb,
          dbRecordId,
          userConfirmationSent: emailResult.userConfirmationSent,
        },
      })
    } catch (mailError) {
      console.error('[Contact API] Erreur envoi Nodemailer :', mailError.message)

      // Si le message a au moins été sauvegardé en base de données
      if (savedToDb) {
        return NextResponse.json({
          success: true,
          warning: 'SMTP_CONFIG_PENDING',
          message:
            'Votre message a bien été enregistré par l’équipe TopBudget. Le service d’envoi direct d’email est en cours de configuration sur le serveur.',
          details: {
            savedToDb: true,
            dbRecordId,
            error: mailError.message,
          },
        })
      }

      return NextResponse.json(
        {
          error:
            "Le service d'email n'est pas encore configuré sur le serveur (SMTP_USER et SMTP_PASS manquants dans .env).",
          details: mailError.message,
        },
        { status: 503 }
      )
    }
  } catch (error) {
    console.error('[Contact API] Erreur globale :', error)
    return NextResponse.json(
      {
        error: "Une erreur inattendue est survenue lors de l'envoi de votre message.",
        details: error?.message || 'Erreur serveur',
      },
      { status: 500 }
    )
  }
}
