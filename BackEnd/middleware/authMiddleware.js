const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  console.log('Auth middleware called for:', req.method, req.url);
  console.log('Headers:', req.headers);

  const authHeader = req.header('Authorization');
  console.log('Authorization header:', authHeader);

  if (!authHeader) {
    console.log('No Authorization header found');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.replace('Bearer ', '');
  console.log('Extracted token:', token);

  if (!token) {
    console.log('No token after Bearer removal');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'exists' : 'missing');
    const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';
    console.log('Using JWT secret:', jwtSecret ? 'exists' : 'missing');
    const decoded = jwt.verify(token, jwtSecret);
    console.log('Token decoded successfully:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;