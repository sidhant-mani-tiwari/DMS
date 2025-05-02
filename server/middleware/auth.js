const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET
const User = require('../models/User');

const authenticationMiddleware = async (req, res, next) => {
    console.log('Authentication middleware')
    const authHeader = req.headers.authorization
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }
  
    const token = authHeader.split(' ')[1]
  
    try {
      const decoded = jwt.verify(token, secretKey)
      const { UserID, Email } = decoded
 
      const user = await User.findById(UserID);
 
      if(!user || user.Email !== Email) {
        return res.status(401).json({ message: 'Invalid user' });
      }
      console.log('Authentication Successfully verified')
      req.user = { UserID: UserID, Email: Email };
      next()
    } 
    
    catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      res.status(401).json({ message: 'Authentication failed' })
    }
 
}
 
module.exports = authenticationMiddleware;