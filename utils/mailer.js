const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use Outlook, SendGrid, etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendLoginEmailToAttorney = async (recipientEmail, tempPassword) => {
    const mailOptions = {
        from: `"Brigade of Justice" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        subject: 'Welcome – Your Attorney Login Credentials',
        html: `
      <h2>Welcome to Brigade of Justice</h2>
      <p>You have been granted attorney access to the platform.</p>
      <p><strong>Login Email:</strong> ${recipientEmail}</p>
      <p><strong>Temporary Password:</strong> ${tempPassword}</p>
      <p>Please log in and update your password immediately:</p>
      <a href=${process.env.SITE_FRONT_END_URL}${process.env.REDIRECT_URL}>Go to Login</a>
    `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendLoginEmailToAttorney;
