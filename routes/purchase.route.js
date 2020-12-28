module.exports = (app) => {
    const purchases = require('../controllers/purchase.controller.js');

    // Register a new Sale
    app.post('/api/purchases', purchases.create);

    // Get all the Sales
    app.get('/api/purchases', purchases.findAll);

    // Get a single purchase detail
    app.get('/api/purchases/:purchaseId', purchases.findOne);

    // Update a purchase
    app.put('/api/purchases/:purchaseId', purchases.update);

    // Delete a purchases
    app.delete('/api/purchases/:purchaseId', purchases.delete);
}