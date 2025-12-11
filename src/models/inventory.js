const mongoose = require('mongoose');
const category = require('./category');
const Schema = mongoose.Schema;

// Define the counter schema
let counterSchema = new Schema({
    _id: {type: String, required: true},
    seq: {type: Number, default: 0}
});

// Create a counter model
const Counter = mongoose.model('Counter', counterSchema);

// Define the inventory schema
let inventorySchema = new mongoose.Schema({
    itemId: {
        type: Number,
        required: [true, 'Item ID is required'],
        unique: true,
        index: true
    },
    categoryId: {
        type: Number,
        
    },
    supplierId: {
        type: Number,
    },
    name: {
        type: String,
        required: [true, 'Item name is required']
    },
    description: {
        type: String
    },
    quantity: {
        type: Number
    },
    price: {
        type: Number
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    dateModified: {
        type: Date
    }
});

// Pre-validate hook to increment the itemId
inventorySchema.pre("validate", async function () {
  const doc = this;

  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "itemId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      doc.itemId = counter.seq;
    } catch (err) {
      console.error("Error in Counter.findByIdAndUpdate:", err);
      throw err;
    }
  } else {
    doc.dateModified = new Date();
  }
});

const updateInventorySchema = {
  type: "object",
  properties: {
    categoryId: { type: "number" },
    supplierId: { type: "number" },
    name: { type: "string", minLength: 3, maxLength: 100 },
    description: { type: "string", maxLength: 500 },
    quantity: { type: "number", minimum: 0 },
    price: { type: "number", minimum: 0 }
  },
  required: ['name', 'description', 'quantity', 'price'],
  additionalProperties: false
}

module.exports = {
    Inventory: mongoose.model('Inventory', inventorySchema),
    Counter: Counter,
    updateInventorySchema: updateInventorySchema
};