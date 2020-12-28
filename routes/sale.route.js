module.exports = (app) => {
    const sales = require('../controllers/sale.controller.js');

    // Register a new Sale
    app.post('/api/sales', sales.create);

    // Get all the Sales
    app.get('/api/sales', sales.findAll);

    // Get a single sale detail
    app.get('/api/sales/:saleId', sales.findOne);

    // Update a sale
    app.put('/api/sales/:saleId', sales.update);

    // Delete a sales
    app.delete('/api/sales/:saleId', sales.delete);
}