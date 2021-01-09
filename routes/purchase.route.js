module.exports = (app) => {
    const { protect, admin } =  require('../middleware/authMiddleware')

    const purchases = require('../controllers/purchase.controller.js');

    // Register a new Purchase
    app.post('/api/purchases', protect, purchases.create);

    // Get all the Sales
    app.get('/api/purchases', purchases.findAll);

    // Get a single purchase detail
    app.get('/api/purchases/:purchaseId', protect, purchases.findOne);

    // Update a purchase
    app.put('/api/purchases/:purchaseId', protect, purchases.update);

    // Delete a purchases
    app.delete('/api/purchases/:purchaseId', protect, admin, purchases.delete);
}