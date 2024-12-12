const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authController = {
    register: async (req, res) => {
        try {
            const { name, surname, email, password } = req.body;

            // Vérification si l'email existe déjà
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(409).json({ message: 'Cet email est déjà utilisé' });
            }

            // Hash du mot de passe
            const hashedPassword = await bcrypt.hash(password, 10);

            // Création de l'utilisateur
            const user = await User.create({
                name,
                surname,
                email,
                password: hashedPassword
            });

            // Génération du token
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // On ne renvoie pas le mot de passe
            const userWithoutPassword = user.toObject();
            delete userWithoutPassword.password;

            res.status(201).json({
                token,
                user: userWithoutPassword
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Recherche de l'utilisateur
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            }

            // Vérification du mot de passe
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
            }

            // Génération du token
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            // On ne renvoie pas le mot de passe
            const userWithoutPassword = user.toObject();
            delete userWithoutPassword.password;

            res.json({
                token,
                user: userWithoutPassword
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = authController;