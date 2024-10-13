const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware'); // Ensure this path is correct
const Bug = require('../models/Bug'); // Ensure this path is correct
const multer = require('multer'); // For handling file uploads
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory for storing uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // File naming
    }
});

const upload = multer({ storage });

// Create a new bug (CREATE)
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const newBug = new Bug({
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
            status: req.body.status,
            image: req.file ? req.file.path : null, // Save image path if file was uploaded
        });

        const savedBug = await newBug.save();
        res.status(201).json(savedBug);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all bugs (READ)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const bugs = await Bug.find();
        res.status(200).json(bugs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a specific bug (READ)
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const bug = await Bug.findById(req.params.id);
        if (!bug) {
            return res.status(404).json({ message: 'Bug not found' });
        }
        res.status(200).json(bug);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a bug (UPDATE)
router.put('/:id', authMiddleware, upload.single('image'), async (req, res) => {
    try {
        const updatedBug = await Bug.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            description: req.body.description,
            priority: req.body.priority,
            status: req.body.status,
            image: req.file ? req.file.path : null, // Update image path if a new file is uploaded
        }, { new: true });

        if (!updatedBug) {
            return res.status(404).json({ message: 'Bug not found' });
        }

        res.status(200).json(updatedBug);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a bug (DELETE)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deletedBug = await Bug.findByIdAndDelete(req.params.id);
        if (!deletedBug) {
            return res.status(404).json({ message: 'Bug not found' });
        }
        res.status(204).send(); // No content to send back
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search bugs by status and priority (QUERY)
router.get('/search', authMiddleware, async (req, res) => {
    try {
        const { status, priority } = req.query;

        // Build a dynamic filter object
        const filter = {};
        if (status) filter.status = status;
        if (priority) filter.priority = priority;

        const bugs = await Bug.find(filter);
        console.log(bugs)
        res.status(200).json(bugs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Protected route example (for testing authentication)
router.get('/protected', authMiddleware, (req, res) => {
    res.status(200).json({ message: `Hello, ${req.user.username}, you are authenticated!` });
});

module.exports = router;
