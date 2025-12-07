const express = require('express');
const Ajv = require('ajv');
const createError = require('http-errors');
const router = express.Router();

// Import the Inventory model
const { Inventory } = require('../../models/inventory');

/**
  * GET /:itemId - Get inventory item by itemId
  * This endpoint retrieves an inventory item based on the provided itemId parameter.
  * If the item is found, it returns the item details in JSON format.
  * If the item is not found, it responds with a 404 error.
  * Example request: GET /api/inventory/123
  * Response:
  * {
  *   "itemId": 123,
  *   "supplierId": 1,
  *   "name": "Widget",
  *   "description": "A useful widget",
  *   "quantity": 100,
  *   "price": 9.99,
  *   "dateCreated": "2023-10-01T12:00:00Z",
  *   "dateModified": "2023-10-01T12:00:00Z"
  * }
  */
router.get('/:itemId', async (req, res, next) => {
    try{
        const inventoryItem = await Inventory.findOne({ itemId: Number(req.params.itemId) });

        if(!inventoryItem){
            return next(createError(404, 'Inventory item not found'));
        }

        console.log('Result: ', inventoryItem);
        res.json(inventoryItem);
    }catch(err){
        console.error(`Error while getting inventory: ${err}`);
        next(err);
    }
});

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