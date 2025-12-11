const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categorySchema = new Schema ({
    categoryId: {
        type: Number,
        required: [true, 'Category ID is required']
    },
    categoryName: {
        type: String,
        required: [true, 'Category name is required']
    },
    description: {
        type: String,
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
    Category: mongoose.model('Category', categorySchema)
}