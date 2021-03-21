const mongoose = require("mongoose");

const newSaleItem = {
  productId: String,
  productName: String,
  quantity: Number,
  salesPrice: Number,
  typeOfEntry: String,
};

const SalesSchema = mongoose.Schema(
  {
    saleItems: [newSaleItem],
    invoiceNumber: String,
    dateOfSale: Date,
    dateOfInvoice: Date,
    paymentRecieved: Boolean,
    customerName: String,
    customerContact: String,
    totalBill: String,
  },
  {
    timeStamps: true,
  }
);

module.exports = mongoose.model("Sale", SalesSchema);
