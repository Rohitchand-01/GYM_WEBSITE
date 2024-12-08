import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { sendEmail } from "./utils/sendEmail.js";

const app = express();

// Load environment variables from config.env
config({ path: "./config.env" });

// Middleware for enabling CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Use environment variable for the frontend URL
    methods: ["POST"], // Allow only POST requests
    credentials: true, // Include credentials in cross-origin requests
  })
);

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route for sending mail
app.post("/send/mail", async (req, res) => {
  const { name, email, message } = req.body;

  // Validate request body
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Please provide all details",
    });
  }

  try {
    // Send email using the sendEmail utility
    await sendEmail({
      email: "rohitchand010904@gmail.com", // Your email address
      subject: "GYM WEBSITE CONTACT", // Subject line
      message, // Message body
      userEmail: email, // User's email
    });

    // Send a success response
    res.status(200).json({
      success: true,
      message: "Message Sent Successfully.",
    });
  } catch (error) {
    console.error("Error sending email:", error); // Log the error for debugging

    // Send an error response
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

// Start the server on the specified port
const PORT = process.env.PORT || 5000; // Use PORT from config.env or default to 5000
app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});
