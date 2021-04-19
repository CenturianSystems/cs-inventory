const Sale = require("../models/sales.model.js");
const Products = require("../models/product.model.js");

// Create and Save a new Sale
exports.create = (req, res) => {
  const data = req.body && req.body.data ? req.body.data : req.body;
  // Validate the request
  const {
    saleItems,
    dateOfSale,
    dateOfInvoice,
    invoiceNumber,
    customerName,
    customerContact,
    totalBill,
    paymentRecieved,
  } = data;
  if (
    !saleItems ||
    !dateOfSale ||
    !dateOfInvoice ||
    !invoiceNumber ||
    !customerName ||
    !customerContact ||
    !totalBill
  ) {
    return res.status(400).send({
      message: "Please fill in all the fields",
    });
  }

  const sales = new Sale({
    saleItems,
    dateOfSale,
    dateOfInvoice,
    invoiceNumber,
    customerName,
    customerContact,
    totalBill,
    paymentRecieved,
  });

  sales.saleItems.forEach(async (product) => {
    const demoProduct = await Products.findOne({
      productUID: product.productId,
    });

    if (demoProduct) {
      const trans = demoProduct.transactions;
      const {
        _id,
        title,
        productUID,
        totalQuantity,
        price,
        dateOfRecieve,
        vendorName,
      } = demoProduct;
      trans.push({
        invoiceNumber: invoiceNumber,
        quantity: product.quantity,
        dateOfTransaction: dateOfInvoice,
        typeOfEntry: product.typeOfEntry,
      });
      const sumQty = Number(totalQuantity) - Number(product.quantity);
      Products.findByIdAndUpdate(_id, {
        _id,
        title,
        productUID,
        price,
        totalQuantity: sumQty,
        dateOfRecieve,
        dateOfInvoice,
        transactions: trans,
        vendorName,
      })
        .then((product) => console.log(`Updated existing Product - ${product}`))
        .catch((err) =>
          res
            .status(500)
            .send(`Some error occured while updating product - ${err}`)
        );
    } else {
      console.log("Product Not found in Inventory");
      console.log("Doing Nothing");
    }
  });

  sales
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while registering the sale.",
      });
    });
};

// Retrieve and find all Sales
exports.findAll = (req, res) => {
  Sale.find()
    .then((sales) => {
      res.send(sales);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving sales.",
      });
    });
};

// Find a single Sale
exports.findOne = (req, res) => {
  Sale.findById(req.params.saleId)
    .then((sale) => {
      if (!sale) {
        return res.status(404).send({
          message: "Sale not found with id " + req.params.saleId,
        });
      }
      res.send(sale);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Sale not found with id " + req.params.saleId,
        });
      }
      return res.status(500).send({
        message: "Error retrieving sale with id " + req.params.saleId,
      });
    });
};

// Update a Sale
exports.update = (req, res) => {
  // Validate the request
  const {
    saleItems,
    dateOfSale,
    dateOfInvoice,
    invoiceNumber,
    customerName,
    customerContact,
    totalBill,
    paymentRecieved,
  } = req.body.data;
  if (
    !saleItems ||
    !dateOfSale ||
    !dateOfInvoice ||
    !invoiceNumber ||
    !customerName ||
    !customerContact ||
    !totalBill
  ) {
    return res.status(400).send({
      message: "Please fill in all the fields",
    });
  }

  // Find product and update it with the request body
  Sale.findByIdAndUpdate(
    req.params.saleId,
    {
      saleItems,
      dateOfSale,
      dateOfInvoice,
      invoiceNumber,
      customerName,
      customerContact,
      totalBill,
      paymentRecieved,
    },
    {
      new: true,
      useFindAndModify: false,
    }
  )
    .then((sale) => {
      if (!sale) {
        return res.status(404).send({
          message: "Sale not found with id " + req.params.saleId,
        });
      }

      res.send(sale);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Sale not found with id " + req.params.saleId,
        });
      }
      return res.status(500).send({
        message: "Error updating sale with id " + req.params.saleId,
      });
    });
};

// Delete a Sale
exports.delete = (req, res) => {
  Sale.findByIdAndRemove(req.params.saleId)
    .then((sale) => {
      if (!sale) {
        return res.status(404).send({
          message: "Sale not found with id " + req.params.saleId,
        });
      }

      sale.saleItems.forEach(async (product) => {
        const demoProduct = await Products.findOne({
          productUID: product.productId,
        });

        if (demoProduct) {
          const trans = demoProduct.transactions.filter(
            (tr) => tr.invoiceNumber !== sale.invoiceNumber
          );
          const {
            _id,
            title,
            productUID,
            totalQuantity,
            price,
            dateOfRecieve,
            dateOfInvoice,
            vendorName,
          } = demoProduct;
          const sumQty = Number(totalQuantity) + Number(product.quantity);
          if (trans.length <= 0) {
            Products.findByIdAndDelete(_id)
              .then((product) => console.log(`Product deleted`, product))
              .catch((err) =>
                res
                  .status(500)
                  .send(`Some error occured while deleting product - ${err}`)
              );
          } else {
            Products.findByIdAndUpdate(_id, {
              _id,
              title,
              productUID,
              price,
              totalQuantity: sumQty,
              dateOfRecieve,
              dateOfInvoice,
              transactions: trans,
              vendorName,
            })
              .then((product) => console.log(`Updated existing Product`))
              .catch((err) =>
                res
                  .status(500)
                  .send(`Some error occured while updating product - ${err}`)
              );
          }
        } else {
          console.log("Nothing needs to be done.");
        }
      });

      res.send({
        message: "Sale deleted successfully!",
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Sale not found with id " + req.params.saleId,
        });
      }
      return res.status(500).send({
        message: "Could not delete sale with id " + req.params.saleId,
      });
    });
};
