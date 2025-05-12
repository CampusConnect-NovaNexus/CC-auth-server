export const getAttendanceWarningEmailHTML = (
  studentName: string,
  attendancePercentage: number
) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Attendance Warning</title>
  </head>
  <body style="background-color: #f9f9fb; margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05);">
      <h2 style="color: #333333; margin-bottom: 20px;">Attendance Warning for ${studentName}</h2>
      <p style="color: #555555; font-size: 16px; line-height: 1.5;">
        We noticed that your current attendance rate is <strong>${attendancePercentage}%</strong>, which is below the minimum required threshold.
      </p>
      <p style="color: #555555; font-size: 16px; line-height: 1.5;">
        To avoid any academic consequences, please take immediate steps to improve your attendance.
      </p>
      <p style="color: #999999; font-size: 14px; text-align: center;">
        If you believe this is an error, please contact the administration immediately.
      </p>
    </div>
  </body>
</html>
`;
