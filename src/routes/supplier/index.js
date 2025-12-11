const express = require('express');
const router = express.Router();


const { Supplier } = require('../../models/supplier');

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

module.exports = router;
