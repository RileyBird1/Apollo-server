const express = require('express');
const router = express.Router();

// Import the Inventory model
const { Inventory } = require('../../models/inventory');

// routes...
router.get('/', (req, res) => res.send("inventory ok"));

/**
 * POST / - Create a new inventory item
 * This endpoint receives item data and creates a new inventory record in the database.
 * Example request body:
 * {
 *   "supplierId": 1,
 *   "name": "Widget",
 *   "description": "A useful widget",
 *   "quantity": 100,
 *   "price": 9.99
 * }
 */
router.post('/', async (req, res) => {
  try {
    // Remove itemId from the request body if present
    const { itemId, ...itemData } = req.body;
    // Create a new inventory item using the sanitized request body
    const item = new Inventory({
      ...itemData,
      dateCreated: new Date(),
      dateModified: new Date()
    });
    await item.save();
    // Log successful creation
    console.log('Inventory item created:', item);
    // Respond with the created item
    res.status(201).json(item);
  } catch (err) {
    // Log and respond with error details
    console.error('Error creating inventory item:', err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;