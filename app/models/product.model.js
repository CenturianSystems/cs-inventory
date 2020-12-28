const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    title: String,
    quantity: Number,
    price: String,
    dateOfRecieve: Date,
    dateOfInvoice: Date,
    invoiceNumber: String,
    vendorName: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);

