const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config(); // For reading environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' folder
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Test route to check if the server is up
app.get('/', (req, res) => {
    res.send('Welcome to the email sending service!');
});

// Nodemailer transporter setup for Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL, // Your email from the .env file
        pass: process.env.PASSWORD, // Your app password from the .env file
    },
});

// POST route to handle sending emails
app.post('/send-email', async (req, res) => {
    const { senderEmail, recipients, subject, message } = req.body;

    // Validation: Check if required fields are present
    if (!senderEmail || !recipients || !subject || !message) {
        return res.status(400).send('Please provide all required fields.');
    }

    try {
        const mailOptions = {
            from: senderEmail, // The sender's email
            to: recipients.split(','), // Comma-separated list of recipients
            subject: subject, // Subject of the email
            text: message, // The message content
        };

        // Log the mail options for debugging
        console.log('Sending email with the following details:', mailOptions);

        // Send the email
        await transporter.sendMail(mailOptions);
        res.status(200).send('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send('Failed to send email. ' + error.message);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
