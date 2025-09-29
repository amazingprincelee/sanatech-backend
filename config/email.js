const nodemailer = require('nodemailer');

// Create transporter with error handling
const createTransporter = () => {
  try {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'sanatechglobal@gmail.com',
        pass: process.env.EMAIL_PASS // App password for Gmail
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  } catch (error) {
    console.error('❌ Email transporter creation failed:', error.message);
    return null;
  }
};

// Test email connection
const testEmailConnection = async () => {
  const transporter = createTransporter();
  if (!transporter) return false;

  try {
    await transporter.verify();
    console.log('✅ Email service is ready');
    return true;
  } catch (error) {
    console.error('❌ Email service verification failed:', error.message);
    return false;
  }
};

// Send email with fallback handling
const sendEmail = async (mailOptions) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.warn('⚠️ Email transporter not available, skipping email send');
    return { success: false, error: 'Email service unavailable' };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send failed:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  createTransporter,
  testEmailConnection,
  sendEmail
};