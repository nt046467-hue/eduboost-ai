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

    // Optional: Send confirmation to user
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "We received your message - EduBoost AI",
      html: `
        <h2>Thank you for reaching out!</h2>
        <p>Hi ${name},</p>
        <p>We've received your message and will get back to you shortly.</p>
        <p>Best regards,<br>EduBoost AI Team</p>
      `,
    });

    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Email Error:", error);
    throw new Error("Failed to send email");
  }
};
