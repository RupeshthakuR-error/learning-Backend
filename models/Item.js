const mongoose = require('mongoose');

/**
 * Item Schema Definition
 * Represents items in our MongoDB collection with validation rules
 */
const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Item description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters']
    },
    price: {
      type: Number,
      required: [true, 'Item price is required'],
      min: [0, 'Price must be a positive number']
    },
    category: {
      type: String,
      required: [true, 'Item category is required'],
      trim: true,
      default: 'General'
    },
    inStock: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true // Automatically creates 'createdAt' and 'updatedAt' fields
  }
);

// Export Item model
module.exports = mongoose.model('Item', itemSchema);
