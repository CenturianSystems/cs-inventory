const Purchase = require("../models/purchase.model.js");
const Products = require("../models/product.model.js");

// Create and Save a new Purchase
exports.create = (req, res) => {
  const data = req.body && req.body.data ? req.body.data : req.body;
  // Validate the request
  const {
    productItems,
    purchasesPrice,
    dateOfPurchase,
    dateOfInvoice,
    invoiceNumber,
    customerName,
    customerContact,
    totalBill,
  } = data;
  if (
    !productItems ||
    !purchasesPrice ||
    !dateOfPurchase ||
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

  const purchases = new Purchase({
    productItems,
    purchasesPrice,
    dateOfPurchase,
    dateOfInvoice,
    invoiceNumber,
    customerName,
    customerContact,
    totalBill,
  });

  purchases.productItems.forEach(async (product) => {
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
      const sumQty = Number(totalQuantity) + Number(product.quantity);
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
      console.log("New Product need to be added");
      const newProduct = {
        productUID: product.productId,
        title: product.productName,
        totalQuantity: product.quantity,
        price: product.price,
        transactions: [
          {
            invoiceNumber: invoiceNumber,
            quantity: product.quantity,
            dateOfTransaction: dateOfInvoice,
            typeOfEntry: product.typeOfEntry,
          },
        ],
        dateOfRecieve: dateOfPurchase,
        dateOfInvoice,
        vendorName: customerName,
      };

      Products.insertMany(newProduct)
        .then((product) => console.log(`Added new Product`))
        .catch((err) =>
          res
            .status(500)
            .send(`Some error occured while adding new product - ${err}`)
        );
    }
  });

  purchases
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while registering the purchase.",
      });
    });
};

// Retrieve and find all Purchases
exports.findAll = (req, res) => {
  Purchase.find()
    .then((purchases) => {
      res.send(purchases);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving purchases.",
      });
    });
};

// Find a single Purchase
exports.findOne = (req, res) => {
  Purchase.findById(req.params.purchaseId)
    .then((purchase) => {
      if (!purchase) {
        return res.status(404).send({
          message: "Purchase not found with id " + req.params.purchaseId,
        });
      }
      res.send(purchase);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Purchase not found with id " + req.params.purchaseId,
        });
      }
      return res.status(500).send({
        message: "Error retrieving purchase with id " + req.params.purchaseId,
      });
    });
};

// Update a Purchase
exports.update = (req, res) => {
  // Validate the request
  const {
    productItems,
    purchasesPrice,
    dateOfPurchase,
    dateOfInvoice,
    invoiceNumber,
    customerName,
    customerContact,
    totalBill,
  } = req.body.data;
  if (
    !productItems ||
    !purchasesPrice ||
    !dateOfPurchase ||
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
  Purchase.findByIdAndUpdate(
    req.params.purchaseId,
    {
      productItems,
      purchasesPrice,
      dateOfPurchase,
      dateOfInvoice,
      invoiceNumber,
      customerName,
      customerContact,
      totalBill,
    },
    {
      new: true,
      useFindAndModify: false,
    }
  )
    .then(async (purchase) => {
      if (!purchase) {
        return res.status(404).send({
          message: "Purchase not found with id " + req.params.purchaseId,
        });
      }

      const newItemPurchaseEdit = purchase.productItems.filter(
        (item) => item.newItem === true
      );
      // console.log(newItemPurchaseEdit)
      updateProduct(
        newItemPurchaseEdit,
        dateOfInvoice,
        dateOfPurchase,
        invoiceNumber,
        customerName
      );
      const demoItems = purchase.productItems;
      demoItems.map((item) => {
        const { newItem } = item;
        item = newItem;
      });
      purchase = {
        ...purchase,
        productItems: demoItems,
      };
      res.send(purchase);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Purchase not found with id " + req.params.purchaseId,
        });
      }
      return res.status(500).send({
        message: "Error updating purchase with id " + req.params.purchaseId,
      });
    });
};

// Delete a Purchase
exports.delete = (req, res) => {
  Purchase.findByIdAndRemove(req.params.purchaseId)
    .then((purchase) => {
      if (!purchase) {
        return res.status(404).send({
          message: "Purchase not found with id " + req.params.purchaseId,
        });
      }

      purchase.productItems.forEach(async (product) => {
        const demoProduct = await Products.findOne({
          productUID: product.productId,
        });

        if (demoProduct) {
          const trans = demoProduct.transactions.filter(
            (tr) => tr.invoiceNumber !== purchase.invoiceNumber
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
          const sumQty = Number(totalQuantity) - Number(product.quantity);
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
          // console.log('New Product need to be added')
          // const newProduct = {
          //     productUID: product.productId,
          //     title: product.productName,
          //     totalQuantity: product.quantity,
          //     price: product.price,
          //     transactions: [{
          //         invoiceNumber: invoiceNumber,
          //         quantity: product.quantity
          //     }],
          //     dateOfRecieve: dateOfPurchase,
          //     dateOfInvoice,
          //     vendorName: customerName
          // }
          // Products.insertMany(newProduct)
          // .then(product => console.log(`Added new Product - ${product}`))
          // .catch(err => res.status(500).send(`Some error occured while adding new product - ${err}`))
        }
      });

      res.send({
        message: "Purchase deleted successfully!",
      });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Purchase not found with id " + req.params.purchaseId,
        });
      }
      return res.status(500).send({
        message: "Could not delete purchase with id " + req.params.purchaseId,
      });
    });
};

const updateProduct = (
  productItems,
  dateOfInvoice,
  dateOfPurchase,
  invoiceNumber,
  customerName
) => {
  productItems.forEach(async (product) => {
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
      });
      const sumQty = Number(totalQuantity) + Number(product.quantity);
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
        .then((product) => console.log(`Updated existing Product - `))
        .catch((err) =>
          res
            .status(500)
            .send(`Some error occured while updating product - ${err}`)
        );
    } else {
      const newProduct = {
        productUID: product.productId,
        title: product.productName,
        totalQuantity: product.quantity,
        price: product.price,
        transactions: [
          {
            invoiceNumber: invoiceNumber,
            quantity: product.quantity,
            dateOfTransaction: dateOfInvoice,
            typeOfEntry: product.typeOfEntry,
          },
        ],
        dateOfRecieve: dateOfPurchase,
        dateOfInvoice,
        vendorName: customerName,
      };

      Products.insertMany(newProduct)
        .then((product) => console.log(`Added new Product`))
        .catch((err) =>
          res
            .status(500)
            .send(`Some error occured while adding new product - ${err}`)
        );
    }
  });
};
