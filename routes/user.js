module.exports = (app) => {
    const users = require('../controllers/user.controller');

    app.post('/api/login', users.login)

    app.post('/api/register', users.register);
}