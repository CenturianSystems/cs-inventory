const mongoose = require('mongoose');

const SalesSchema = mongoose.Schema({
    productName: String,
    quantity: Number,
    invoiceNumber: String,
    salesPrice: Number,
    dateOfSale: Date,
    dateOfInvoice: Date,
    paymentRecieved: Boolean,
    customerName: String,
    customerContact: String,
    totalBill: String
}, {
    timeStamps: true
});

module.exports = mongoose.model('Sale', SalesSchema);