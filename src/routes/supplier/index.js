const express = require('express');
const router = express.Router();
const { Supplier } = require('../../models/supplier');
const createError = require('http-errors');


// GET all suppliers (optional, for completeness)
router.get('/', async (req, res) => {
	try {
		const suppliers = await Supplier.find();
		res.status(200).json(suppliers);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

// POST /api/supplier - Create a new supplier
router.post('/', async (req, res) => {
	try {
		const { supplierId, supplierName, contactInformation, address } = req.body;
		if (!supplierId || !supplierName || !address) {
			return res.status(400).json({ error: 'supplierId, supplierName, and address are required' });
		}
		const supplier = new Supplier({
			supplierId,
			supplierName,
			contactInformation,
			address,
			dateCreated: new Date(),
			dateModified: new Date()
		});
		await supplier.save();
		res.status(201).json(supplier);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
});



// DELETE /:supplierId - If multiple suppliers with the same supplierId exist, return them for selection. If _id is provided, delete by _id.
router.delete('/:supplierId', async (req, res) => {
	try {
		const supplierId = Number(req.params.supplierId);
		const { _id } = req.body;
		if (_id) {
			// Delete by unique _id
			const deleted = await Supplier.findByIdAndDelete(_id);
			if (!deleted) {
				return res.status(404).json({ error: 'Supplier not found by _id' });
			}
			return res.status(200).json({ message: 'Supplier deleted', supplier: deleted });
		}
		// Find all with this supplierId
		const matches = await Supplier.find({ supplierId });
		if (matches.length === 0) {
			return res.status(404).json({ error: 'Supplier not found' });
		}
		if (matches.length === 1) {
			// Only one, delete it
			const deleted = await Supplier.findOneAndDelete({ supplierId });
			return res.status(200).json({ message: 'Supplier deleted', supplier: deleted });
		}
		// Multiple found, return them for selection
		return res.status(200).json({ message: 'Multiple suppliers found', suppliers: matches });
	} catch (err) {
		console.error('Error while deleting supplier:', err);
		res.status(400).json({ error: err.message });
	}
});

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
