const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Create a transporter using the Gmail SMTP configuration from environment variables
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // e.g., 'smtp.gmail.com'
      port: process.env.EMAIL_PORT, // e.g., 587
      secure: false, // use STARTTLS
   
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your Gmail password or App Password
      },
    });

    // Set up email options
    let mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to: to, // Receiver email
      subject: subject, // Subject line
      text: text, // Plain text body
      html: html, // HTML body
    };

    // Send email
    let info = await transporter.sendMail(mailOptions);

    console.log("Email sent: " + info.response);
  } catch (error) {
    console.log("Error sending email: ", error);
  }
};

module.exports = { sendEmail };
