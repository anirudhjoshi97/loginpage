const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // Serve static files

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/userSignup', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define User Schema
const userSchema = new mongoose.Schema({
    name: String,
    phone: { type: String, unique: true }, // Ensure phone numbers are unique
    email: { type: String, unique: true }, // Ensure emails are unique
    password: String
});

const User = mongoose.model('User', userSchema);

// Serve the HTML file at the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Signup Endpoint
app.post('/signup', async (req, res) => {
    console.log('Signup request body:', req.body); // Log incoming request body for debugging
    const { name, phone, email, password } = req.body;

    // Validate phone number length
    if (phone.length !== 10) {
        return res.status(400).json({ message: "Invalid phone number. Must be 10 digits." });
    }

    try {
        // Check for duplicates
        const existingUser = await User.findOne({ $or: [{ phone }, { email }] });
        if (existingUser) {
            if (existingUser.phone === phone) {
                return res.status(400).json({ message: "Phone number already exists." });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ message: "Email already exists." });
            }
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, phone, email, password: hashedPassword });
        
        // Save the new user to the database
        await newUser.save();
        res.status(201).json({ message: "User signed up successfully!" });
        
    } catch (error) {
        console.error("Error signing up user:", error); // Log error details
        if (error.code === 11000) {
            return res.status(400).json({ message: "Phone number or email already exists." });
        }
        return res.status(500).json({ message: "Error signing up user: " + error.message });
    }
});

// Login Endpoint
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        // If login is successful
        res.json({ success: true, message: "Login successful!" });
    } catch (error) {
        console.error("Error logging in:", error); // Log error details
        res.status(500).json({ message: "Error logging in." });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
