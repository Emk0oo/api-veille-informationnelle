const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Routes CRUD de base
router.get('/users', userController.getAllUsers);
router.get('/user/:id', userController.getUser);
router.post('/user', userController.createUser);
router.put('/user/:id', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);

// Routes pour la gestion des flux RSS
router.post('/user/:userId/feed', userController.addFeedToUser);
router.delete('/user/:userId/feed/:feedId', userController.removeFeedFromUser);

module.exports = router;