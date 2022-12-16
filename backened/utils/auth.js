const jwt = require('jsonwebtoken');

function generateToken(userInfo) {
    if (!userInfo) {
        return null
    }

    return jwt.sign(userInfo, process.env.JWT_SECRET, {
        expiresIn: '1h'
    })
}

function verifyToken(username, token) {
    return jwt.verify(token, process.env.JWT_SECRET, (error, res) => {
        if (error) {
            return {
                verified: false,
                message: 'Invalid token'
            }
        }

        if (res.username !== username) {
            return {
                verified: false,
                message: 'Invalid user'
            }
        }

        return {
            verified: true,
            message: 'Verified'
        }
    })
}

module.exports.generateToken = generateToken;
module.exports.verifyToken = verifyToken;