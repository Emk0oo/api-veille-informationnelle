const RssParser = require('rss-parser');
const parser = new RssParser();

async function getRssFeed(url) {
    await parser.parseURL(url).then((feed) => {
        console.log(feed.title);
        feed.items.forEach(item => {
            console.log(item.title + ':' + item.link);
        });
    });
}

module.exports = { getRssFeed };