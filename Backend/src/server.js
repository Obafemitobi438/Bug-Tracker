const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');  // Adjust the path as needed
const bugRoutes = require('./routes/bug');    // Adjust the path as needed

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your actual MongoDB connection string
mongoose.connect("mongodb+srv://obafemitobi438:Pastortobi.438@bugtrackerdb.bdyml.mongodb.net/?retryWrites=true&w=majority&appName=BugTrackerDB")
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));

// Middleware to parse JSON bodies
app.use(express.json());

// Simple route for testing
app.get('/', (req, res) => {
    res.send('Bug Tracker API is running!');
});

// Use the routes
app.use('/api/auth', authRoutes);
app.use('/api/bug', bugRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
