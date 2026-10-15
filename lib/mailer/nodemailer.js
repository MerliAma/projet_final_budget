import nodemailer from 'nodemailer'

/**
 * Service d'envoi d'emails via Nodemailer pour TopBudget
 * Compatible avec :
 * - Gmail (recommandé en dev/prod avec mot de passe d'application 16 caractères)
 * - Tout serveur SMTP standard (OVH, Hostinger, Infomaniak, Brevo SMTP, etc.)
 */

// Crée et retourne le transporteur Nodemailer configuré
function getTransporter() {
  const host = process.env.SMTP_HOST?.trim()
  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const secure = process.env.SMTP_SECURE === 'true' || port === 465
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS?.trim()

  if (!user || !pass) {
    throw new Error(
      "Configuration SMTP incomplète : 'SMTP_USER' et 'SMTP_PASS' doivent être définis dans le fichier .env."
    )
  }

  // Configuration adaptée si Gmail est utilisé
  if (host === 'smtp.gmail.com' || (!host && user.endsWith('@gmail.com'))) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    })
  }

  // Configuration SMTP universelle
  return nodemailer.createTransport({
    host: host || 'smtp.gmail.com',
    port,
    secure,
    auth: {
      user,
      pass,
    },
  })
}

/**
 * Envoie un email de contact de la part d'un utilisateur à l'équipe TopBudget,
 * et envoie optionnellement un accusé de réception automatique à l'utilisateur.
 *
 * @param {Object} options
 * @param {string} options.name - Nom de l'expéditeur
 * @param {string} options.email - Email de l'expéditeur
 * @param {string} options.subject - Objet du message
 * @param {string} options.message - Contenu du message
 * @param {boolean} [options.sendCopy=true] - Envoyer un accusé de réception au client
 */
export async function sendContactEmail({ name, email, subject, message, sendCopy = true }) {
  const transporter = getTransporter()

  const receiverEmail =
    process.env.CONTACT_RECEIVER_EMAIL?.trim() ||
    process.env.SMTP_USER?.trim()

  const senderEmail = process.env.SMTP_FROM?.trim() || process.env.SMTP_USER?.trim()
  const cleanSubject = subject?.trim() || 'Nouveau message de contact'
  const dateFormatted = new Date().toLocaleString('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short',
  })

  // 1. Email destiné à l'équipe TopBudget
  const mailToTeam = {
    from: `"TopBudget Contact" <${senderEmail}>`,
    replyTo: `"${name}" <${email}>`,
    to: receiverEmail,
    subject: `[TopBudget Support] ${cleanSubject}`,
    text: `Nouveau message reçu via l'assistant King sur TopBudget :
    
De : ${name} (${email})
Date : ${dateFormatted}
Objet : ${cleanSubject}

Message :
${message}
`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 24px; color: #1e293b;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- En-tête -->
          <div style="background: linear-gradient(135deg, #14532d, #16a34a); padding: 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 22px; font-weight: bold; letter-spacing: -0.5px;">TopBudget</h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Nouveau message transmis par l'assistant King</p>
          </div>

          <!-- Corps du message -->
          <div style="padding: 24px;">
            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #15803d;"><strong>Expéditeur :</strong> ${name} &lt;${email}&gt;</p>
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #15803d;"><strong>Objet :</strong> ${cleanSubject}</p>
              <p style="margin: 0; font-size: 12px; color: #16a34a;"><strong>Date :</strong> ${dateFormatted}</p>
            </div>

            <h3 style="font-size: 15px; color: #0f172a; margin: 0 0 12px 0;">Message :</h3>
            <div style="background-color: #f8fafc; border-radius: 12px; padding: 16px; border: 1px solid #e2e8f0; font-size: 14px; line-height: 1.6; white-space: pre-wrap; color: #334155;">${message}</div>

            <div style="margin-top: 24px; text-align: center;">
              <a href="mailto:${email}?subject=Re: ${encodeURIComponent(cleanSubject)}" style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 600;">
                Répondre directement à ${name}
              </a>
            </div>
          </div>

          <!-- Pied de page -->
          <div style="background-color: #f1f5f9; padding: 14px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
            Ce message a été envoyé depuis le chatbot King sur l'application TopBudget.
          </div>
        </div>
      </div>
    `,
  }

  // Envoi à TopBudget
  const teamResult = await transporter.sendMail(mailToTeam)

  // 2. Email de confirmation / accusé de réception envoyé au client
  let userResult = null
  if (sendCopy) {
    try {
      const mailToUser = {
        from: `"King de TopBudget" <${senderEmail}>`,
        to: `"${name}" <${email}>`,
        subject: `Accusé de réception : Nous avons bien reçu votre message — TopBudget`,
        text: `Bonjour ${name},

Nous vous confirmons la bonne réception de votre message concernant : "${cleanSubject}".

Notre équipe TopBudget ainsi que King ont bien pris en compte votre demande et vous répondront dans les plus brefs délais à cette adresse.

Rappel de votre message :
${message}

À très bientôt,
King & L'équipe TopBudget
https://topbudget.app
`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; padding: 24px; color: #1e293b;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
              
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #14532d, #16a34a); padding: 28px 24px; text-align: center; color: #ffffff;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">Top<span style="color: #bbf7d0;">Budget</span></h1>
                <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.95;">Accusé de réception de votre message</p>
              </div>

              <!-- Content -->
              <div style="padding: 24px;">
                <p style="font-size: 15px; margin-top: 0;">Bonjour <strong>${name}</strong>,</p>
                <p style="font-size: 14px; line-height: 1.6; color: #334155;">
                  Je suis <strong>King</strong>, votre conseiller chez <strong>TopBudget</strong>. J'ai bien reçu votre message et je l'ai immédiatement transmis à notre équipe technique et support.
                </p>
                <p style="font-size: 14px; line-height: 1.6; color: #334155;">
                  Nous analysons votre demande avec attention et nous reviendrons vers vous dès que possible à cette adresse email.
                </p>

                <div style="background-color: #f8fafc; border-left: 4px solid #16a34a; padding: 14px; margin: 20px 0; border-radius: 0 8px 8px 0;">
                  <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #16a34a; text-transform: uppercase;">Récapitulatif de votre demande :</p>
                  <p style="margin: 0 0 4px 0; font-size: 13px; color: #0f172a;"><strong>Objet :</strong> ${cleanSubject}</p>
                  <p style="margin: 0; font-size: 13px; color: #475569; font-style: italic;">"${message.replace(/\n/g, '<br/>')}"</p>
                </div>

                <p style="font-size: 14px; color: #334155;">
                  En attendant, n'hésitez pas à continuer d'utiliser l'application ou à me poser vos questions en direct sur le chat !
                </p>

                <p style="font-size: 14px; margin-bottom: 0; color: #0f172a;">
                  Chaleureusement,<br/>
                  <strong>King</strong> &amp; l'équipe <strong>TopBudget</strong>
                </p>
              </div>

              <!-- Footer -->
              <div style="background-color: #f1f5f9; padding: 14px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0;">
                © ${new Date().getFullYear()} TopBudget — Tous droits réservés.
              </div>
            </div>
          </div>
        `,
      }

      userResult = await transporter.sendMail(mailToUser)
    } catch (userMailErr) {
      console.warn(
        "[Nodemailer] L'accusé de réception à l'utilisateur n'a pas pu être envoyé :",
        userMailErr.message
      )
    }
  }

  return {
    success: true,
    messageId: teamResult.messageId,
    userConfirmationSent: !!userResult,
  }
}
