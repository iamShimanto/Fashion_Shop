const nodemailer = require("nodemailer");

const sendVerifyEmail = async (emailTo, subject, code, content) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const message = {
    from: `"Fashion" <${process.env.EMAIL_USER}>`,
    to: emailTo,
    subject: subject,
    html: `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 40px auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(90deg, #4f46e5, #3b82f6); padding: 30px; text-align: center; color: #fff;">
      <h1 style="margin: 0; font-size: 28px;">Email Verification</h1>
    </div>
    
    <!-- Body -->
    <div style="background-color: #ffffff; padding: 30px; text-align: center;">
      <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Hello,</p>
      <p style="font-size: 16px; color: #333;">Use the verification code below to <strong>${content}</strong>:</p>
      
      <!-- Code -->
      <div style="margin: 30px 0;">
        <span style="display: inline-block; padding: 20px 30px; font-size: 28px; font-weight: bold; color: #4f46e5; background-color: #f0f4ff; border-radius: 8px; letter-spacing: 5px;">
          ${code}
        </span>
      </div>
      
      <p style="font-size: 14px; color: #555;">This code is valid for <strong>5 minutes</strong>.</p>
      <p style="font-size: 14px; color: #555; margin-top: 20px;">If you did not request this, you can safely ignore this email.</p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f9fafb; text-align: center; padding: 20px; font-size: 12px; color: #777;">
      <p style="margin: 0;">&copy; ${new Date().getFullYear()} Shimanto Dev Team. All rights reserved.</p>
      <p style="margin: 5px 0 0;">Support: support@shimantodev.com</p>
    </div>
  </div>
`,
  };

  await transporter.sendMail(message);
};

module.exports = sendVerifyEmail;
