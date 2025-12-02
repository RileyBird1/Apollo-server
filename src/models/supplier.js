const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the supplier schema
let supplierSchema = new Schema({
    supplierId: {
        type: Number,
        required: [true, 'Supplier ID is required']
    },
    supplierName: {
        type: String,
        required: [true, 'Supplier name is required']
    },
    contactInformation: {
        type: String
    },
    address: {
        type: String
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateModified: {
        type: Date
    }
});

module.exports = {
    Supplier: mongoose.model('Supplier', supplierSchema)
}