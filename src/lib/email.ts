import { Resend } from 'resend';
import { getVerificationEmailHTML } from '../email-templates/verification-template';

export const sendVerificationEmail = async (to: string, subject: string, token: string) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Resend API key is not set in environment variables.');
  }

  const url = `${process.env.BASE_URL}/auth/verify?token=${token}`;

  const html = getVerificationEmailHTML(url);

  try {
    const { data, error } = await resend.emails.send({
      from: 'NITM-OLX <no-reply@nitm-olx.ceew.xyz>',
      to,
      subject,
      html,
    });

    return { data, error };
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
