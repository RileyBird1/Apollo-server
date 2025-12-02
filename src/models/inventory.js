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

// Pre-save hook to increment the itemId
// If the document is new, increment the itemId
// If the document is not new, update the dateModified
inventorySchema.pre("save", async function (next) {
  const doc = this;

  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "itemId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      doc.itemId = counter.seq;
      next();
    } catch (err) {
      console.error("Error in Counter.findByIdAndUpdate:", err);
      next(err);
    }
  } else {
    doc.dateModified = new Date();
    next();
  }
});


module.exports = {
    Inventory: mongoose.model('Inventory', inventorySchema),
    Counter: Counter
};