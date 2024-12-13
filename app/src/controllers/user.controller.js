const User = require('../models/User.model');

// Obtenir tous les utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('rssFeeds');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir un utilisateur spécifique
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('rssFeeds');
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer un utilisateur
exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        
        Object.assign(user, req.body);
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        
        await user.deleteOne();
        res.json({ message: 'Utilisateur supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ajouter un flux RSS à un utilisateur
exports.addFeedToUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        const feedId = req.body.feedId;
        if (!user.rssFeeds.includes(feedId)) {
            user.rssFeeds.push(feedId);
            await user.save();
        }

        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer un flux RSS d'un utilisateur
exports.removeFeedFromUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

        const feedId = req.params.feedId;
        user.rssFeeds = user.rssFeeds.filter(feed => feed.toString() !== feedId);
        await user.save();

        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};