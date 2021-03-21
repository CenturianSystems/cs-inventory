const mongoose = require("mongoose");

const newItemPurchase = {
  productId: String,
  productName: String,
  quantity: Number,
  price: Number,
  typeOfEntry: String,
};

const PurchasesSchema = mongoose.Schema(
  {
    productItems: [newItemPurchase],
    invoiceNumber: String,
    purchasesPrice: Number,
    dateOfPurchase: Date,
    dateOfInvoice: Date,
    customerName: String,
    customerContact: String,
    totalBill: String,
  },
  {
    timeStamps: true,
  }
);

module.exports = mongoose.model("Purchase", PurchasesSchema);
