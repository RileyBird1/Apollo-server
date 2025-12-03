const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the counter schema
let counterSchema = new Schema({
    _id: {type: String, required: true},
    seq: {type: Number, default: 0}
});

// Create a counter model
const Counter = mongoose.model('Counter', counterSchema);

// Define the supplier schema
let inventorySchema = new mongoose.Schema({
    itemId: {
        type: Number,
        required: [true, 'Item ID is required']
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

module.exports = {
    Inventory: mongoose.model('Inventory', inventorySchema),
    Counter: Counter
};