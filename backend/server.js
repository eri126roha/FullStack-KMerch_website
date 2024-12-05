const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");
const app = express();
const path = require('path'); // Added path for file serving
const fs = require('fs');  // Add this line to import the 'fs' module


const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir); // Create the directory if it doesn't exist
}

app.use(cors());
app.use(express.json());

const merchandises = require('./routes/api/merchRouter'); // Import merchRouter
const users = require("./routes/api/users"); // Import users router

// Serve static files (images) from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection setup
const mongo_url = config.get("mongo_url"); 
mongoose.set('strictQuery', true);
mongoose
  .connect(mongo_url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// Use routes for users and merchandise
app.use("/api/users", users);
app.use("/api/merchandises", merchandises);

const port = process.env.PORT || 3001; // Use environment variable or default to port 3001

app.listen(port, () => console.log(`Server running on port ${port}`));
