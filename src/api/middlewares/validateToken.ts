var jwt = require('jsonwebtoken');
var config = require('../../../config')

function validateToken(req, res, next) {
    var auth = req.headers['authorization']
    if (!auth) {
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    var token = auth.split(' ')[1];
    jwt.verify(token, "u2mUMiNxgfIbfXIOhOFskAI8o6doVRCH", function (err, decoded) { 
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        next();
    })
}

module.exports = validateToken;