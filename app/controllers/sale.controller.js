const Sale = require('../models/sales.model.js');

// Create and Save a new Sale
exports.create = (req, res) => {
    const data = req.body && req.body.data ? req.body.data : req.body
    // Validate the request
    const {
        productName,
        quantity,
        salesPrice,
        dateOfSale,
        dateOfInvoice,
        invoiceNumber,
        customerName,
        customerContact,
        totalBill
    } = data
    console.log(data)
    if (!productName || !quantity || !salesPrice || !dateOfSale || !dateOfInvoice || !invoiceNumber || !customerName || !customerContact || !totalBill) {
        return res.status(400).send({
            "message": "Please fill in all the fields"
        })
    }

    const sales = new Sale({
        productName,
        quantity,
        salesPrice,
        dateOfSale,
        dateOfInvoice,
        invoiceNumber,
        customerName,
        customerContact,
        totalBill
    })

    sales.save()
        .then(data => {
            res.send(data)
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while registering the sale."
            })
        })

}

// Retrieve and find all Sales
exports.findAll = (req, res) => {
    Sale.find()
        .then(sales => {
            res.send(sales)
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving sales."
            });
        })
}

// Find a single Sale
exports.findOne = (req, res) => {
    Sale.findById(req.params.saleId)
        .then(sale => {
            if (!sale) {
                return res.status(404).send({
                    message: "Sale not found with id " + req.params.saleId
                });
            }
            res.send(sale);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Sale not found with id " + req.params.saleId
                });
            }
            return res.status(500).send({
                message: "Error retrieving sale with id " + req.params.saleId
            });
        });
}

// Update a Sale
exports.update = (req, res) => {
    // Validate the request
    const {
        productName,
        quantity,
        salesPrice,
        dateOfSale,
        dateOfInvoice,
        invoiceNumber,
        customerName,
        customerContact,
        totalBill
    } = req.body.data
    console.log(req.body.data)
    if (!productName || !quantity || !salesPrice || !dateOfSale || !dateOfInvoice || !invoiceNumber || !customerName || !customerContact || !totalBill) {
        return res.status(400).send({
            "message": "Please fill in all the fields"
        })
    }

    // Find product and update it with the request body
    Sale.findByIdAndUpdate(req.params.saleId, {
            productName,
            quantity,
            salesPrice,
            dateOfSale,
            dateOfInvoice,
            invoiceNumber,
            customerName,
            customerContact,
            totalBill
        }, {
            new: true
        })
        .then(sale => {
            if (!sale) {
                return res.status(404).send({
                    message: "Sale not found with id " + req.params.saleId
                });
            }
            res.send(sale);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Sale not found with id " + req.params.saleId
                });
            }
            return res.status(500).send({
                message: "Error updating sale with id " + req.params.saleId
            });
        });
}

// Delete a Sale
exports.delete = (req, res) => {
    console.log('here', req.params)
    Sale.findByIdAndRemove(req.params.saleId)
        .then(sale => {
            if (!sale) {
                return res.status(404).send({
                    message: "Sale not found with id " + req.params.saleId
                });
            }
            res.send({
                message: "Sale deleted successfully!"
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Sale not found with id " + req.params.saleId
                });
            }
            return res.status(500).send({
                message: "Could not delete sale with id " + req.params.saleId
            });
        });
}