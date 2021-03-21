const mongoose = require("mongoose");

const transactionsQty = {
  quantity: Number,
  invoiceNumber: String,
  dateOfTransaction: Date,
  typeOfEntry: String,
};

const ProductSchema = mongoose.Schema(
  {
    title: String,
    productUID: String,
    totalQuantity: Number,
    price: Number,
    dateOfRecieve: Date,
    dateOfInvoice: Date,
    transactions: [transactionsQty],
    vendorName: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
