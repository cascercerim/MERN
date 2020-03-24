const jwt = require('jsonwebtoken');
const config = require('config');

// expotting a middleware function that has request response object from it 
module.exports = function (req, res, next) {
    //  Get token form header
    // need to send it in x-auth-token 
    const token = req.header('x-auth-token');

    //  If no token at all 
    if (!token) {
        // and route is proteceted using middleware then it's going to send the below message 
        return res.status(401).json({ mgs: 'No token, authorization denied ' });

    }
    // Verify token
    // If there is token 
    try {
        const decoded = jwt.verify(token, config.get('jwtToken'));

        // If it's not valid it's going to go to the below error 
        //  If it is valid it's then going to be decoded
        //  can use req.user in any of the users protected routes 
        req.user = decoded.user;
        next();
        // run catch and say it's not valid 
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid ' });
    }

}