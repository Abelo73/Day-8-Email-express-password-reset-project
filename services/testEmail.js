const { sendEmail } = require("../utils/sendEmail");

// Function to test email sending
const testEmail = async () => {
  try {
    // Sending the email
    await sendEmail({
      to: "asefashadisu73@gmail.com", // Recipient email address
      subject: "Test Email from Node.js", // Subject of the email
      text: "This is a test email using Node.js", // Plain text content of the email
      html: "<p>This is a test email using <strong>Node.js</strong></p>", // HTML content of the email
    });

    console.log("Email sent successfully!"); // Log success message to console
  } catch (error) {
    console.log("Error sending email:", error); // Log error message to console if something goes wrong
  }
};

testEmail();
