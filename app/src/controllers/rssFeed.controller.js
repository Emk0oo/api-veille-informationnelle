const Parser = require('rss-parser');
const parser = new Parser();
const RssFeed = require('../models/RssFeed.model');

// Obtenir tous les flux
exports.getAllFeeds = async (req, res) => {
    try {
        const feeds = await RssFeed.find();
        res.json(feeds);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtenir un flux spécifique
exports.getFeed = async (req, res) => {
    try {
        const feed = await RssFeed.findById(req.params.id);
        if (!feed) return res.status(404).json({ message: 'Feed not found' });
        res.json(feed);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Créer un nouveau flux
exports.createFeed = async (req, res) => {
    try {
        const feed = new RssFeed(req.body);
        const newFeed = await feed.save();
        res.status(201).json(newFeed);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Mettre à jour un flux
exports.updateFeed = async (req, res) => {
    try {
        const feed = await RssFeed.findById(req.params.id);
        if (!feed) return res.status(404).json({ message: 'Feed not found' });
        
        Object.assign(feed, req.body);
        const updatedFeed = await feed.save();
        res.json(updatedFeed);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer un flux
exports.deleteFeed = async (req, res) => {
    try {
        const feed = await RssFeed.findById(req.params.id);
        if (!feed) return res.status(404).json({ message: 'Feed not found' });
        
        await feed.remove();
        res.json({ message: 'Feed deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};