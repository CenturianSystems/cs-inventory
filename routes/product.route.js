module.exports = (app) => {
    const products = require('../controllers/product.controller.js');

    // Create a new Product
    app.post('/products', products.create);

    // Get all the products
    app.get('/products', products.findAll);

    // Get a single product
    app.get('/products/:productId', products.findOne);

    // Update a product
    app.put('/products/:productId', products.update);

    // Delete a product
    app.delete('/products/:productId', products.delete);
}