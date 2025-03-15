const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    if (req.path.startsWith('/api/auth')) {
        return next(); // Ignore les routes d'auth
    }

    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Aucun token fourni' });

    jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token invalide ou expiré' });

        req.user = decoded; // Stocke les infos du user dans la requête
        next();
    });
};

module.exports = verifyToken;