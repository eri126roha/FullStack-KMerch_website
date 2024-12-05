const express = require('express');
const Merchandise = require('../../models/Merchandise'); // Ensure model path is correct
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation

// Define the directory where the images will be stored
const uploadDir = 'uploads/';

// Ensure the upload directory exists, otherwise create it
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer setup for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Store uploaded images in the "uploads" folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = fileTypes.test(file.mimetype);

        if (extname && mimeType) {
            return cb(null, true);
        } else {
            return cb(new Error("Only image files (jpeg, png, gif) are allowed."));
        }
    },
});

// Serve static files (images) from the "uploads" directory
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// POST endpoint to create merchandise with image upload
router.post('/addMerch', upload.single('imageUrl'), async (req, res) => {
    const { name, description, price, sellerId, category } = req.body;

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Please upload an image.' });
        }

        if (!name || !description || !price || !sellerId || !category) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Construct the image URL (assuming 'uploads' is served as a static folder)
        const imageUrl = `/uploads/${req.file.filename}`;

        const newMerch = new Merchandise({
            name,
            description,
            price,
            seller: sellerId,
            category,
            imageUrl, // Store the URL of the uploaded image
        });

        await newMerch.save();
        res.status(201).json(newMerch); // Send back the created merchandise
    } catch (error) {
        console.error('Error while creating merchandise:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.stack });
    }
});

// GET endpoint to fetch all merchandise
router.get('/', async (req, res) => {
    try {
        const merchList = await Merchandise.find()
            .populate('seller', 'username email') // Populate seller details (optional)
            .populate('wishlistUsers', 'username email'); // Populate wishlist users (optional)
        res.status(200).json(merchList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET endpoint to fetch merchandise by category
router.get('/category/:category', async (req, res) => {
    try {
        const merchs = await Merchandise.find({ category: req.params.category });
        res.status(200).json(merchs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET endpoint to fetch merchandise by sellerId (for logged-in user's merch)
router.get('/mymerchs/:sellerId', async (req, res) => {
    const { sellerId } = req.params;

    try {
        const merchs = await Merchandise.find({ seller: sellerId });
        if (!merchs || merchs.length === 0) {
            return res.status(404).json({ message: 'No merchandise found for this seller' });
        }
        res.status(200).json(merchs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT endpoint to update merchandise by ID
router.put('/:id', upload.single('imageUrl'), async (req, res) => {
    const { id } = req.params;
    const { name, description, price, sellerId, category } = req.body;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid merchandise ID' });
    }

    try {
        // Fetch the merchandise by ID
        const merch = await Merchandise.findById(id);

        // Check if the merchandise exists
        if (!merch) {
            return res.status(404).json({ message: 'Merchandise not found' });
        }

        // Check if the logged-in user is the owner of the merchandise
        if (merch.seller.toString() !== sellerId) {
            return res.status(403).json({ message: 'You can only update your own merchandise' });
        }

        // If there is an image uploaded, handle it
        if (req.file) {
            merch.imageUrl = `/uploads/${req.file.filename}`; // Update the image URL
        }

        // Update the fields
        merch.name = name || merch.name;
        merch.description = description || merch.description;
        merch.price = price || merch.price;
        merch.category = category || merch.category;

        // Save the updated merchandise
        const updatedMerch = await merch.save();
        res.status(200).json(updatedMerch);
    } catch (error) {
        console.error('Error while updating merchandise:', error);
        res.status(500).json({ message: error.message });
    }
});



// DELETE endpoint to delete merchandise by ID
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    // Validate the ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid merchandise ID' });
    }

    try {
        const deletedMerch = await Merchandise.findByIdAndDelete(id);
        if (!deletedMerch) return res.status(404).json({ message: 'Merchandise not found' });
        res.status(200).json({ message: 'Merchandise deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PATCH endpoint to decrement stock
router.patch('/:id/decrement', async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    try {
        const merch = await Merchandise.findById(id);
        if (!merch) return res.status(404).json({ message: 'Merchandise not found' });

        await merch.decrementStock(quantity || 1); // Default to decrementing by 1 if quantity not provided
        res.status(200).json(merch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST endpoint to add a user to the wishlist
router.post('/:id/wishlist', async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        const merch = await Merchandise.findById(id);
        if (!merch) return res.status(404).json({ message: 'Merchandise not found' });

        await merch.addToWishlist(userId);
        res.status(200).json(merch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
