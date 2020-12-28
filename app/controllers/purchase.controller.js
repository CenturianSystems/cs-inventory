const Purchase = require('../models/purchase.model.js');

// Create and Save a new Purchase
exports.create = (req, res) => {
    const data = req.body && req.body.data ? req.body.data : req.body
    // Validate the request
    const {
        productName,
        quantity,
        purchasesPrice,
        dateOfPurchase,
        dateOfInvoice,
        invoiceNumber,
        customerName,
        customerContact,
        totalBill
    } = data
    console.log(data)
    if (!productName || !quantity || !purchasesPrice || !dateOfPurchase || !dateOfInvoice || !invoiceNumber || !customerName || !customerContact || !totalBill) {
        return res.status(400).send({
            "message": "Please fill in all the fields"
        })
    }

    const purchases = new Purchase({
        productName,
        quantity,
        purchasesPrice,
        dateOfPurchase,
        dateOfInvoice,
        invoiceNumber,
        customerName,
        customerContact,
        totalBill
    })

    purchases.save()
        .then(data => {
            res.send(data)
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while registering the purchase."
            })
        })

}

// Retrieve and find all Purchases
exports.findAll = (req, res) => {
    Purchase.find()
        .then(purchases => {
            res.send(purchases)
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving purchases."
            });
        })
}

// Find a single Purchase
exports.findOne = (req, res) => {
    Purchase.findById(req.params.purchaseId)
        .then(purchase => {
            if (!purchase) {
                return res.status(404).send({
                    message: "Purchase not found with id " + req.params.purchaseId
                });
            }
            res.send(purchase);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Purchase not found with id " + req.params.purchaseId
                });
            }
            return res.status(500).send({
                message: "Error retrieving purchase with id " + req.params.purchaseId
            });
        });
}

// Update a Purchase
exports.update = (req, res) => {
    // Validate the request
    const {
        productName,
        quantity,
        purchasesPrice,
        dateOfPurchase,
        dateOfInvoice,
        invoiceNumber,
        customerName,
        customerContact,
        totalBill
    } = req.body.data
    console.log(req.body.data)
    if (!productName || !quantity || !purchasesPrice || !dateOfPurchase || !dateOfInvoice || !invoiceNumber || !customerName || !customerContact || !totalBill) {
        return res.status(400).send({
            "message": "Please fill in all the fields"
        })
    }

    // Find product and update it with the request body
    Purchase.findByIdAndUpdate(req.params.purchaseId, {
            productName,
            quantity,
            purchasesPrice,
            dateOfPurchase,
            dateOfInvoice,
            invoiceNumber,
            customerName,
            customerContact,
            totalBill
        }, {
            new: true
        })
        .then(purchase => {
            if (!purchase) {
                return res.status(404).send({
                    message: "Purchase not found with id " + req.params.purchaseId
                });
            }
            res.send(purchase);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Purchase not found with id " + req.params.purchaseId
                });
            }
            return res.status(500).send({
                message: "Error updating purchase with id " + req.params.purchaseId
            });
        });
}

// Delete a Purchase
exports.delete = (req, res) => {
    console.log('here', req.params)
    Purchase.findByIdAndRemove(req.params.purchaseId)
        .then(purchase => {
            if (!purchase) {
                return res.status(404).send({
                    message: "Purchase not found with id " + req.params.purchaseId
                });
            }
            res.send({
                message: "Purchase deleted successfully!"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Purchase not found with id " + req.params.purchaseId
                });
            }
            return res.status(500).send({
                message: "Could not delete purchase with id " + req.params.purchaseId
            });
        });
}