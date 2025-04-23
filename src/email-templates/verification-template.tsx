export const getVerificationEmailHTML = (url: string) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
  </head>
  <body style="background-color: #f4f4f7; margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
      <h2 style="color: #333333; margin-bottom: 20px;">Verify your email address</h2>
      <p style="color: #555555; font-size: 16px; line-height: 1.5;">
        Thanks for signing up. Please click the button below to verify your email address.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" target="_blank" style="background-color: #007BFF; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px;">
          Verify Email
        </a>
      </div>
      <p style="color: #999999; font-size: 14px; text-align: center;">
        If you didn’t request this, you can safely ignore this email.
      </p>
    </div>
  </body>
</html>
`;
