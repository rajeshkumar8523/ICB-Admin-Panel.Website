require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// User Model
const User = mongoose.model('User', new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}));

// Register Route
app.post('/api/register', async (req, res) => {
    try {
        const { userId, name, contact, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ userId });
        if (user) return res.status(400).json({ message: 'User already exists' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        user = new User({
            userId,
            name,
            contact,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { userId, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ userId });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        // Generate token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Reset Password Route
app.post('/api/reset-password', async (req, res) => {
    try {
        const { userId, password } = req.body;

        // Check if user exists
        let user = await User.findOne({ userId });
        if (!user) return res.status(400).json({ msg: 'User not found' });

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password
        user.password = hashedPassword;
        await user.save();

        res.json({ msg: 'Password reset successful' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Serve static files from the public folder
app.use(express.static('../ICB-Admin-Panel/public'));

// Handle 404
app.use((req, res) => {
    res.status(404).sendFile(__dirname + '/../ICB-Admin-Panel/public/404.html');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));