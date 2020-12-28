module.exports = {
    mongoURI: process.env.MONGODB_URL || 'mongodb://localhost:27017/cs-inventory',
    secretOrKey: process.env.SECRET || "secret"
}