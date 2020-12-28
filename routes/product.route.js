module.exports = (app) => {
    const products = require('../controllers/product.controller.js');

    // Create a new Product
    app.post('/api/products', products.create);

    // Get all the products
    app.get('/api/products', products.findAll);

    // Get a single product
    app.get('/api/products/:productId', products.findOne);

    // Update a product
    app.put('/api/products/:productId', products.update);

    // Delete a product
    app.delete('/api/products/:productId', products.delete);
}