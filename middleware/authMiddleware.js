const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')
const User = require('../models/User')

exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            
            const decoded = jwt.verify(token, process.env.SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch(e) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized, token failed')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, no token')
    }
})

exports.admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401)
        throw new Error('Not authorized as Admin');
    }
}

// Normal user token - Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZWNhZGIyODVjNmVhMGFhZDUwN2JiNyIsIm5hbWUiOiJNYXlhbmsgS2hhbm5hIiwiaWF0IjoxNjA5MzQ4NDg4LCJleHAiOjE2NDA5MDU0MTR9.8XkYnjJVP4zFzqPR7pu50kCUG1fHSZyQYFaHQ3OLcnE

// Admin - eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmZTk4ZTBmODI4ZjEzMTIxZmFjYTBjNiIsIm5hbWUiOiJHcmVlc2ggS2hhbm5hIiwiaWF0IjoxNjA5MzQ4NjEyLCJleHAiOjE2NDA5MDU1Mzh9.H9-bkhzzRz3IjXx_jKsSlVbL4k-805NwTvQ2PbWbens