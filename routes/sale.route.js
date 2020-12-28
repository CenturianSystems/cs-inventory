module.exports = (app) => {
    const sales = require('../controllers/sale.controller.js');

    // Register a new Sale
    app.post('/sales', sales.create);

    // Get all the Sales
    app.get('/sales', sales.findAll);

    // Get a single sale detail
    app.get('/sales/:saleId', sales.findOne);

    // Update a sale
    app.put('/sales/:saleId', sales.update);

    // Delete a sales
    app.delete('/sales/:saleId', sales.delete);
}