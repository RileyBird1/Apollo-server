const express = require('express');
const router = express.Router();
const { Supplier } = require('../../models/supplier');
const createError = require('http-errors');


/** 
 *  Get /:supplierId - Get supplier by supplierId
 *  This endpoint retrieves a supplier based on the provided supplierId parameter.
 *  If the supplier is found, it returns the supplier details in JSON format.
 *  If the supplier is not found, it responds with a 404 error.
 *  Example request: GET /api/supplier/1
 *  Response:
 *   { 
 *      "supplierId": 1,    
 *      "supplierName": "ABC Supplies",
 *      "contactInformation": "123-456-7890",
 *      "address": "123 Main St, Anytown, USA",
 *      "dateCreated": "2023-10-01T12:00:00Z",
 *      "dateModified": "2023-10-01T12:00:00Z"
 *   }   
 *  
 * */ 
router.get('/:supplierId', async(req, res, next) => {
    try{
        const supplier = await Supplier.findOne({ supplierId: Number(req.params.supplierId)});

        if(!supplier){
            return next(createError(404, 'Supplier not found'));
        }
        console.log('Response: ', supplier);
        res.json(supplier);
    }catch(err){
        console.error("Error fetching the supplier: ", err);
        next(err);
    }
});




module.exports = router;
