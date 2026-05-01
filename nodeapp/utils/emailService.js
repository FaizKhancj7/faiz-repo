/**
 * emailService.js
 * This utility uses Nodemailer to send emails.
 * It's configured to handle OTP delivery for account verification.
 */

const nodemailer = require('nodemailer');

// --- 1. CONFIGURATION ---
// In a real project, these would be in your .env file.
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use Gmail, Outlook, or any SMTP service
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});

// --- 2. SEND OTP FUNCTION ---
/**
 * Sends a 6-digit OTP to the specified email address.
 * @param {string} toEmail - The recipient's email address.
 * @param {string} otp - The generated 6-digit OTP.
 */
const sendOTPEmail = async (toEmail, otp) => {
    try {
        const mailOptions = {
            from: '"StartupNest Verification" <no-reply@startupnest.com>',
            to: toEmail,
            subject: 'Verify Your StartupNest Account',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #ff7a21; text-align: center;">Welcome to StartupNest!</h2>
                    <p>Thank you for joining our platform. To complete your registration, please use the following One-Time Password (OTP):</p>
                    <div style="background-color: #f7f9ff; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                        <h1 style="letter-spacing: 5px; color: #0e1d2a; margin: 0;">${otp}</h1>
                    </div>
                    <p>This OTP is valid for <strong>10 minutes</strong>. If you did not request this, please ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2026 StartupNest. All rights reserved.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        // We don't throw the error so the main process can handle the failure gracefully
        return false;
    }
};

module.exports = { sendOTPEmail };
