const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const authToken = authHeader.split(" ")
    console.log("authorization", authToken[1])
    

    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1]; // Extract token from the 'Bearer <token>' format

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
    
        const decoded = jwt.verify(token, 'your_secret_key'); // Use the secret key to verify the token
        console.log(decoded, "decoded")
        req.user = decoded; // Attach decoded user data to the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

module.exports = verifyToken;
