const jwt = require('jsonwebtoken')
require('dotenv').config()


module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: 'No token provided. Please login.',
      });
    }

    // Check if it's in "Bearer <token>" format or just a token
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_key);
    req.user = decoded;

    console.log('User Data:', req.user);
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed. Ensure you are logged in.',
      error: error.message || error,
    });
  }
};


