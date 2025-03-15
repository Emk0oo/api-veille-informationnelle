const RssParser = require('rss-parser');
const parser = new RssParser();

async function getRssFeed(url) {
    try {
        const feed = await parser.parseURL(url);
        return feed;
    } catch (error) {
        console.error("Error fetching RSS feed:", error);
        throw error;
    }
}

module.exports = { getRssFeed };
