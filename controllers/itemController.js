const mongoose = require('mongoose');
const Item = require('../models/Item');

/**
 * @desc    Create a new item
 * @route   POST /api/items
 * @access  Public
 */
const createItem = async (req, res) => {
  try {
    const { name, description, price, category, inStock } = req.body;

    // Check required fields before passing to Mongoose for immediate user-friendly feedback
    if (!name || !description || price === undefined || price === null) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, description, and price.'
      });
    }

    const item = await Item.create({
      name,
      description,
      price,
      category: category || 'General',
      inStock: inStock !== undefined ? inStock : true
    });

    return res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: item
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server Error while creating item',
      error: error.message
    });
  }
};

/**
 * @desc    Get all items (with optional query filters and search)
 * @route   GET /api/items
 * @access  Public
 */
const getAllItems = async (req, res) => {
  try {
    const { search, category, inStock, sortBy } = req.query;
    let query = {};

    // Filter by search term in name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    // Filter by stock status
    if (inStock !== undefined) {
      query.inStock = inStock === 'true';
    }

    // Sorting: default newest first
    let sortOption = { createdAt: -1 };
    if (sortBy === 'price_asc') sortOption = { price: 1 };
    if (sortBy === 'price_desc') sortOption = { price: -1 };
    if (sortBy === 'name') sortOption = { name: 1 };

    const items = await Item.find(query).sort(sortOption);

    return res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error while fetching items',
      error: error.message
    });
  }
};

/**
 * @desc    Get single item by ID
 * @route   GET /api/items/:id
 * @access  Public
 */
const getItemById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format: '${id}'. Must be a 24-character hexadecimal string.`
      });
    }

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Item with ID '${id}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error while fetching item',
      error: error.message
    });
  }
};

/**
 * @desc    Update an existing item by ID
 * @route   PUT /api/items/:id
 * @access  Public
 */
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format: '${id}'. Must be a 24-character hexadecimal string.`
      });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true, // Return modified document instead of original
        runValidators: true // Run schema validators on update
      }
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: `Item with ID '${id}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Item updated successfully',
      data: updatedItem
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: messages
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Server Error while updating item',
      error: error.message
    });
  }
};

/**
 * @desc    Delete an item by ID
 * @route   DELETE /api/items/:id
 * @access  Public
 */
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID format: '${id}'. Must be a 24-character hexadecimal string.`
      });
    }

    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: `Item with ID '${id}' not found`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Item deleted successfully',
      data: {
        id: deletedItem._id,
        name: deletedItem.name
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server Error while deleting item',
      error: error.message
    });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem
};
