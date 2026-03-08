import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // Use Gmail App Password, not your regular password
  },
});

export const sendContactEmail = async (
  name: string,
  email: string,
  message: string,
) => {
  try {
    // Send email to your Gmail (not visible to user)
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: "nt046467@gmail.com", // Your Gmail - not shown on website
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      replyTo: email, // User's email for reply
    });

    // Optional: Send confirmation to user with auto-reply template
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "We received your message - EduBoost AI",
      html: generateAutoReplyHTML(name, message),
    });

    // helper function for auto-reply template
    function generateAutoReplyHTML(userName: string, userMessage: string) {
      // sanitize message to prevent injection
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

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Email Error:", error);
    throw new Error("Failed to send email");
  }
};

