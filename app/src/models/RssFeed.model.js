// models/RssFeed.js
const mongoose = require('mongoose');

const rssFeedSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    description: { type: String },
    category: { type: String },
    lastUpdated: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('RssFeed', rssFeedSchema);