const express = require('express');
const Ajv = require('ajv');
const createError = require('http-errors');
const { Inventory } = require('../../models/inventory');
const router = express.Router();

/**
 * DELETE /:itemId - Delete an inventory item by itemId
 */
router.delete('/:itemId', async (req, res, next) => {
  try{
    const itemId = Number(req.params.itemId);
    const deletedItem = await Inventory.findOneAndDelete({ itemId });
    if (!deletedItem) {
      return next(createError(404, 'Inventory item not found'));
    }
    // Log successful deletion
    console.log('Inventory item deleted:', deletedItem);
    res.status(200).json({ message: 'Item deleted', item: deletedItem });
  } catch (err) {
    console.error(`Error while deleting inventory item:`, err);
    res.status(400).json({ error: err.message });
  }
});
// ...existing code...

router.get('/:itemId', async (req, res, next) => {
  try {
    const inventoryItem = await Inventory.findOne({ itemId: Number(req.params.itemId) });
    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    console.log('Result: ', inventoryItem);
    res.status(200).json(inventoryItem);
  } catch (err) {
    console.error(`Error while getting inventory: ${err}`);
    res.status(500).json({ message: err.message });
  }
});
// ...existing code...

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
