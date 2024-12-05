const mongoose = require('mongoose');

// Define the Merchandise Schema
const MerchandiseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Name is mandatory
    },
    description: {
        type: String,
        required: true, // Description is mandatory
    },
    price: {
        type: Number,
        required: true, // Price is mandatory
        min: 0, // Price can't be negative
    },
    imageUrl: {
        type: String, 
        required: false, 
    },
    category: {
        type: String,
        enum: ['Lightsticks', 'Albums', 'Photocards', 'Posters', 'Clothing', 'Accessories', 'Other'], // Enum for category validation
        required: true, 
    },
    stock: {
        type: Number,
        default: 0, // Default stock is 0
        min: 0, // Stock can't be negative
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User', // Assuming the existence of a User model
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Created date is automatically set
    },
    wishlistUsers: [
        {
            type: mongoose.Schema.Types.ObjectId, // Reference to the User model
            ref: 'User', // Assuming the existence of a User model
        },
    ],
});

// Virtual field to calculate total stock value
MerchandiseSchema.virtual('totalValue').get(function () {
    return this.price * this.stock; // Returns the total value of the merchandise in stock
});

// Instance method to decrement stock
MerchandiseSchema.methods.decrementStock = function (quantity) {
    this.stock = Math.max(0, this.stock - quantity); // Ensure stock doesn't go below 0
    return this.save();
};

// Instance method to add a user to the wishlist
MerchandiseSchema.methods.addToWishlist = function (userId) {
    // Ensure user isn't already in the wishlist and stock is available
    if (!this.wishlistUsers.includes(userId) && this.stock > 0) {
        this.wishlistUsers.push(userId);
    }
    return this.save(); // Save the updated merchandise
};

// Create a model based on this schema
const Merchandise = mongoose.model('Merchandise', MerchandiseSchema);

module.exports = Merchandise;
