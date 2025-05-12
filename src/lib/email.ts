import { Resend } from 'resend';
import { getAttendanceWarningEmailHTML } from '../email-templates/attendance-warning-template';

export const sendWarningEmail = async (senderName: string, to: string, studentName: string, attendancePercentage:number) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Resend API key is not set in environment variables.');
  }

  console.log("request for : ", studentName, attendancePercentage)
  const html = getAttendanceWarningEmailHTML(studentName, attendancePercentage); 
  const subject = "Warning!! Low Attendance"; 

  try {
    const { data, error } = await resend.emails.send({
      from: `${senderName} <no-reply@campus-connect.ceew.xyz>`,
      to,
      subject,
      html,
    });

    return { data, error };
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
