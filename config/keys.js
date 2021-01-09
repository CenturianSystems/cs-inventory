module.exports = {
    mongoURI: 'mongodb://localhost:27017/cs-inventory', //process.env.MONGODB_URL || 
    secretOrKey: process.env.SECRET || "secret"
}