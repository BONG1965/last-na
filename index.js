const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
require('dotenv').config();

const app = express();
const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Test route to check if the server is up
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/contact-form.html");  // Serve your HTML form
});

// Nodemailer transporter setup for Gmail
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

// POST route to handle sending emails
app.post("/send-email", async (req, res) => {
    const { senderEmail, recipients, subject, message } = req.body;

    try {
        const mailOptions = {
            from: senderEmail,
            to: recipients.split(","),
            subject: subject,
            text: message,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Failed to send email.");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
