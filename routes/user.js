module.exports = (app) => {
    const { protect, admin } =  require('../middleware/authMiddleware')

    const users = require('../controllers/user.controller');

    app.post('/api/login', users.login)

    app.post('/api/register', admin, users.register);

    app.get('/api/users', protect, admin, users.getAllUsers);

    // Get a single user detail
    app.get('/api/users/:userId', protect, admin, users.findOne);

    // Update a user
    app.put('/api/users/:userId', protect, admin, users.update);

    // Delete a user
    app.delete('/api/users/:userId', protect, admin, users.delete);
}