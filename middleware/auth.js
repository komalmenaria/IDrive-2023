require('dotenv').config()
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('x-auth-token');

    // Check for token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWTSECRET, function (err, decoded) {
            if (err) {
                err = {
                    name: 'TokenExpiredError',
                    message: 'jwt expired',
                    expiredAt: 1408621000
                }

            }
        });
        //Add user from payload
        req.user = decoded;
        next();

    } catch (e) {
        console.log(e)
        res.status(400).json({ msg: 'Token is not valid' });
    }
}

module.exports = auth;