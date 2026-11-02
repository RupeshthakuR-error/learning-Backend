const express = require('express');
const router = express.Router();
const {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem
} = require('../controllers/itemController');

// Routes for /api/items
router
  .route('/')
  .get(getAllItems)
  .post(createItem);

// Routes for /api/items/:id
router
  .route('/:id')
  .get(getItemById)
  .put(updateItem)
  .delete(deleteItem);

module.exports = router;
