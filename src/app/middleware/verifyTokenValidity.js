const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Routes qui ne nécessitent pas d'authentification
    const publicRoutes = [
        '/api/auth',
        '/api/rssFeeds/last3' // Ajoutez votre exception ici
    ];

    // Vérifie si la route actuelle est dans la liste des routes publiques
    const isPublicRoute = publicRoutes.some(publicRoute => 
        req.path.startsWith(publicRoute) || req.path === publicRoute
    );

    if (isPublicRoute) {
        return next();
    }

    // Vérification du token pour les autres routes
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Aucun token fourni' });

    jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Token invalide ou expiré' });
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken;