module.exports = (app) => {
    const users = require('../controllers/user.controller');

    app.post('/login', users.login)

    app.post('/register', users.register);
}