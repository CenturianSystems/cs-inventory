module.exports = (app) => {
    const { protect, admin } =  require('../middleware/authMiddleware')

    const products = require('../controllers/product.controller.js');

    // Create a new Product
    app.post('/api/products', protect, products.create);

    // Get all the products
    app.get('/api/products', products.findAll);

    // Get a single product
    app.get('/api/products/:productId', protect, products.findOne);

    // Update a product
    app.put('/api/products/:productId', protect, products.update);

    // Delete a product
    app.delete('/api/products/:productId', protect, admin, products.delete);
}