
// firebase_backend_functions.js

const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

// Nodemailer transporter setup - CONFIGURE THIS FOR YOUR SMTP PROVIDER
// Ensure you have set the necessary Firebase Function config variables:
// firebase functions:config:set smtp.host="YOUR_SMTP_HOST" smtp.port="YOUR_SMTP_PORT" smtp.user="YOUR_SMTP_USER" smtp.pass="YOUR_SMTP_PASSWORD" smtp.secure="true_or_false" smtp.from_address="YOUR_FROM_EMAIL"
let transporter;
try {
    const smtpHost = functions.config().smtp?.host;
    const smtpPort = functions.config().smtp?.port;
    const smtpUser = functions.config().smtp?.user;
    const smtpPass = functions.config().smtp?.pass;
    const smtpSecure = functions.config().smtp?.secure === 'true'; // config values are strings
    const smtpFromAddress = functions.config().smtp?.from_address || smtpUser;


    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !smtpFromAddress) {
        console.warn("SMTP credentials not fully found in Firebase Function config. Email sending will fail. Ensure smtp.host, smtp.port, smtp.user, smtp.pass are set. smtp.from_address is optional (defaults to smtp.user).");
        // Create a dummy transporter to prevent crashes if config is missing, but it won't send emails.
        transporter = nodemailer.createTransport({
            jsonTransport: true // Does not send emails, just generates message data
        });
    } else {
        transporter = nodemailer.createTransport({
            host: smtpHost,
            port: parseInt(smtpPort, 10), // Ensure port is an integer
            secure: smtpSecure, // true for 465, false for other ports (like 587 which uses STARTTLS)
            auth: {
                user: smtpUser,
                pass: smtpPass,
            },
        });
    }
} catch (error) {
    console.error("Failed to initialize Nodemailer transporter. Check Firebase Function config.", error);
    // Fallback to a dummy transporter
     transporter = nodemailer.createTransport({
        jsonTransport: true
    });
}


// Send Email Function
exports.sendEmail = functions.https.onCall(async (data, context) => {
  // Data expected from client: toEmail, subject, summary (text body), pdfBase64 (PDF content), pdfFilename
  const { toEmail, subject, summary, pdfBase64, pdfFilename } = data;

  if (!toEmail || !summary) {
    throw new functions.https.HttpsError("invalid-argument", "Missing required fields: toEmail and summary.");
  }
  if (pdfBase64 && !pdfFilename) {
    throw new functions.https.HttpsError("invalid-argument", "If pdfBase64 is provided, pdfFilename is also required.");
  }
  
  const fromAddress = functions.config().smtp?.from_address || functions.config().smtp?.user || "no-reply@example.com";

  const mailOptions = {
    to: toEmail,
    from: fromAddress, 
    subject: subject || "Your Health Insights Report",
    text: summary, // Text body of the email
    html: `<p>${summary.replace(/\n/g, '<br>')}</p>`, // HTML version of the summary
  };

  if (pdfBase64 && pdfFilename) {
    mailOptions.attachments = [
      {
        filename: pdfFilename,
        content: pdfBase64,
        encoding: 'base64',
        contentType: 'application/pdf',
      },
    ];
  }

  try {
    // Verify transporter was initialized correctly before attempting to send
    if (transporter.options.jsonTransport && (!functions.config().smtp?.host || !functions.config().smtp?.user)) {
         console.error("Nodemailer is not configured with real SMTP credentials. Email will not be sent.");
         throw new functions.https.HttpsError("failed-precondition", "Email service is not configured on the server.");
    }
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to:", toEmail);
    return { success: true };
  } catch (error) {
    console.error("Email send failed:", error);
    // Check if it's an HttpsError we threw intentionally
    if (error instanceof functions.https.HttpsError) {
        throw error;
    }
    // For other errors, wrap them
    throw new functions.https.HttpsError("internal", "Sending email failed. Please try again later or check server logs.");
  }
});
