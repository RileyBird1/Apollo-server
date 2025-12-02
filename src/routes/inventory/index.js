const express = require('express');
const Ajv = require('ajv');
const createError = require('http-errors');
const router = express.Router();
const { Inventory } = require('../../models/inventory');

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

module.exports = router;