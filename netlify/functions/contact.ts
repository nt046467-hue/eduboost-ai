import { Handler } from "@netlify/functions";
import nodemailer from "nodemailer";

// helper for generating the same auto-reply HTML used in the frontend service
function generateAutoReplyHTML(userName: string, userMessage: string) {
  const safeMessage = userMessage
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
  return `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f8fb;padding:30px 0;font-family:system-ui,Arial,sans-serif;">
  <tr>
    <td align="center">


  <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:30px;box-shadow:0 4px 18px rgba(0,0,0,0.05);">
    <tr>
      <td style="font-size:20px;font-weight:600;color:#111;padding-bottom:10px;">
        Hi ${userName},
      </td>
    </tr>

    <tr>
      <td style="font-size:15px;color:#444;line-height:1.6;padding-bottom:18px;">
        Thank you for contacting <b>EduBoost</b> 📚✨
      </td>
    </tr>

    <tr>
      <td style="font-size:15px;color:#444;line-height:1.6;padding-bottom:18px;">
        We’ve successfully received your message and our team will review it shortly.
      </td>
    </tr>

    <tr>
      <td style="background:#f1f5ff;padding:12px 16px;border-radius:8px;font-size:14px;color:#333;margin-bottom:20px;">
        <b>Your message:</b><br>
        "${safeMessage}"
      </td>
    </tr>

    <tr>
      <td style="font-size:15px;color:#444;line-height:1.6;padding-bottom:20px;">
        Our support team usually responds within <b>24-48 hours</b>.  
        We appreciate your patience and look forward to helping you.
      </td>
    </tr>

    <tr>
      <td align="center" style="padding:18px 0;">
        <a href="eduboost.nabint.com.np" 
           style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500;">
           Visit EduBoost
        </a>
      </td>
    </tr>

    <tr>
      <td style="font-size:14px;color:#666;border-top:1px solid #eee;padding-top:18px;">
        Best regards,<br>
        <b>EduBoost Team</b>
      </td>
    </tr>

  </table>

  <p style="font-size:12px;color:#888;margin-top:14px;">
    © 2026 EduBoost. All rights reserved.
  </p>

</td>

  </tr>
</table>
`;
}

const handler: Handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { name, email, message } = JSON.parse(event.body || "{}");

    // Validate inputs
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid email address" }),
      };
    }

    // Setup email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Send to your Gmail
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: "h32505513@gmail.com",
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      replyTo: email,
    });

    // Send confirmation to user using the auto-reply template
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "We received your message - EduBoost AI",
      html: generateAutoReplyHTML(name, message),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Email sent successfully",
      }),
    };
  } catch (error) {
    console.error("Email Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};

export { handler };

