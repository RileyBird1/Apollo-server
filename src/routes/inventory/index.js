const express = require('express');
const Ajv = require('ajv');
const createError = require('http-errors');
const { Inventory } = require('../../models/inventory');
const router = express.Router();
const { updateInventorySchema } = require('../../models/inventory');
const validateUpdateInventory = new Ajv().compile(updateInventorySchema);

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

/**
  * GET /:itemId - Get inventory item by itemId
  * This endpoint retrieves an inventory item based on the provided itemId parameter.
  * If the item is found, it returns the item details in JSON format.
  * If the item is not found, it responds with a 404 error.
  * Example request: GET /api/inventory/123
  * Response:
  * {
  *   "itemId": 123,
  *   "categoryId": 2,
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


/**
 * POST / - Create a new inventory item
 * This endpoint receives item data and creates a new inventory record in the database.
 * Example request body:
 * {
 *   "itemId": 123,
 *   "categoryId": 2,
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

/*
  * PATCH /:itemId - Update an existing inventory item
  * This endpoint updates an inventory item based on the provided itemId parameter.
  * Example request: PATCH /api/inventory/123
  * Request body: { 
  *   "name": "Updated Widget", 
  *   "quantity": 150 
  * }
  * Response: { "message": "Inventory item updated successfully" }
  * If the item is not found, it responds with a 404 error. 
  * If the request body fails validation, it responds with a 400 error.
  */ 
router.patch('/:itemId', async(req, res, next) => {
  try{
    const inventoryItem = await Inventory.findOne({ itemId: Number(req.params.itemId) });
    const valid = validateUpdateInventory(req.body);

    
    if(!valid){
      return next(createError(400, 'Must not have fewer than 3 characters.'));
    }
    
    
    inventoryItem.set({
      name: req.body.name,
      description: req.body.description,
      quantity: req.body.quantity,
      price: req.body.price
    });

    await inventoryItem.save();

    res.send({
      message: 'Inventory item updated successfully!'
    })
  }catch(err){
    console.error(`Error while updating inventory: ${err}`);
    next(err);
  }
});


/** 
 * GET / - Get all inventory items
 * This endpoint retrieves all inventory items from the database and returns them in JSON format.
 * Example request: GET /api/inventory/
 * Response:
 * [
 *   {
 *     "itemId": 123,
 *     "categoryId": 2,
 *     "supplierId": 1,
 *     "name": "Widget",
 *     "description": "A useful widget",
 *     "quantity": 100,
 *     "price": 9.99,
 *     "dateCreated": "2023-10-01T12:00:00Z",
 *     "dateModified": "2023-10-01T12:00:00Z"
 *   },
 *   ...
 * ]
*/
router.get('/', async (req, res, next) => {
    try{
        const inventoryItems = await Inventory.find({});

        // If no items exist → return 404
        if (!inventoryItems || inventoryItems.length === 0) {
            return res.status(404).json({ message: 'No inventory items found' });
        }
        
        console.log('Result: ', inventoryItems);
        res.json(inventoryItems);
    }catch(err){
        console.error(`Error while getting inventories: ${err}`);
        return res.status(500).json({ error: 'Database error' });
    }
});



module.exports = router;
