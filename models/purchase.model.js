const mongoose = require('mongoose');

const PurchasesSchema = mongoose.Schema({
    productName: String,
    quantity: Number,
    invoiceNumber: String,
    purchasesPrice: Number,
    dateOfPurchase: Date,
    dateOfInvoice: Date,
    customerName: String,
    customerContact: String,
    totalBill: String
}, {
    timeStamps: true
});

module.exports = mongoose.model('Purchase', PurchasesSchema);