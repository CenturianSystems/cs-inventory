module.exports = (app) => {
    const purchases = require('../controllers/purchase.controller.js');

    // Register a new Sale
    app.post('/purchases', purchases.create);

    // Get all the Sales
    app.get('/purchases', purchases.findAll);

    // Get a single purchase detail
    app.get('/purchases/:purchaseId', purchases.findOne);

    // Update a purchase
    app.put('/purchases/:purchaseId', purchases.update);

    // Delete a purchases
    app.delete('/purchases/:purchaseId', purchases.delete);
}