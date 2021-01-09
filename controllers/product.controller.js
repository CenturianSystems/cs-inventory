const Product = require('../models/product.model.js');

// Create and Save a new Product
exports.create = (req, res) => {
    // Validate the request
    const {
        title,
        quantity,
        price,
        dateOfRecieve,
        dateOfInvoice,
        invoiceNumber,
        vendorName
    } = req.body.data
    if (!title || !quantity || !price || !dateOfRecieve || !dateOfInvoice || !invoiceNumber || !vendorName) {
        return res.status(400).send({
            "message": "Please fill in all the fields"
        })
    }

    const product = new Product({
        title,
        quantity,
        price,
        dateOfRecieve,
        dateOfInvoice,
        invoiceNumber,
        vendorName
    })

    product.save()
    .then(data => {
        res.send(data)
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Product"
        })
    })

}

// Retrieve and find all Products
exports.findAll = (req, res) => {
    Product.find()
    .then(products => {
        res.send(products)
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving products."
        });
    })
}

// Find a single Product
exports.findOne = (req, res) => {
    Product.findById(req.params.productId)
    .then(product => {
        if(!product) {
            return res.status(404).send({
                message: "Product not found with id " + req.params.productId
            });            
        }
        res.send(product);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Product not found with id " + req.params.productId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving product with id " + req.params.productId
        });
    });
}

// Update a Product
exports.update = (req, res) => {
    // Validate the request
    const {
        title,
        quantity,
        price,
        dateOfRecieve,
        dateOfInvoice,
        invoiceNumber,
        vendorName
    } = req.body.data
    if (!title || !quantity || !price || !dateOfRecieve || !dateOfInvoice || !invoiceNumber || !vendorName) {
        return res.status(400).send({
            "message": "Please fill in all the fields"
        })
    }

    // Find product and update it with the request body
    Product.findByIdAndUpdate(req.params.productId, {
        title,
        quantity,
        price,
        dateOfRecieve,
        dateOfInvoice,
        invoiceNumber,
        vendorName
    }, {new: true})
    .then(product => {
        if(!product) {
            return res.status(404).send({
                message: "Product not found with id " + req.params.productId
            });
        }
        res.send(product);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Product not found with id " + req.params.productId
            });                
        }
        return res.status(500).send({
            message: "Error updating product with id " + req.params.productId
        });
    });
}

// Delete a Product
exports.delete = (req, res) => {
    Product.findByIdAndRemove(req.params.productId)
    .then(product => {
        if(!product) {
            return res.status(404).send({
                message: "Product not found with id " + req.params.productId
            });
        }
        res.send({message: "Product deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Product not found with id " + req.params.productId
            });                
        }
        return res.status(500).send({
            message: "Could not delete product with id " + req.params.productId
        });
    });
}