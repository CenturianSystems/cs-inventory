module.exports = (app) => {
    const { protect, admin } =  require('../middleware/authMiddleware')

    const sales = require('../controllers/sale.controller.js');

    // Register a new Sale
    app.post('/api/sales', protect, sales.create);

    // Get all the Sales
    app.get('/api/sales', sales.findAll);

    // Get a single sale detail
    app.get('/api/sales/:saleId', protect, sales.findOne);

    // Update a sale
    app.put('/api/sales/:saleId', protect, sales.update);

    // Delete a sales
    app.delete('/api/sales/:saleId', protect, admin, sales.delete);
}