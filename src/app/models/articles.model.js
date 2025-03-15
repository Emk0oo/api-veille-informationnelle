const db = require("../config/db");

class Articles {
    constructor(id, feed_id, title, link, description, published_at, content, image_url, guid, iso_date){
        this.id = id;
        this.feed_id = feed_id;
        this.title = title;
        this.link = link;
        this.description = description;
        this.published_at = published_at;
        this.content = content;
        this.image_url = image_url;
        this.guid = guid;
        this.iso_date = iso_date;
    }

    static getAll(result) {
        const query = "SELECT * FROM articles";
        db.query(query, result);
    }

    static getById(id, result) {
        const query = "SELECT * FROM articles WHERE id = ?";
        db.query(query, id, result);
    }

    static getByFeedId(feed_id, result) {
        const query = "SELECT * FROM articles WHERE feed_id = ?";
        db.query(query, feed_id, result);
    }

    static create(newArticle, result) {
        const query = "INSERT INTO articles SET ?";
        db.query(query, newArticle, result);
    }

    static updateById(id, article, result) {
        const query = "UPDATE articles SET ? WHERE id = ?";
        db.query(query, [article, id], result);
    }

    static deleteById(id, result) {
        const query = "DELETE FROM articles WHERE id = ?";
        db.query(query, id, result);
    }

    static deleteByFeedId(feed_id, result) {
        const query = "DELETE FROM articles WHERE feed_id = ?";
        db.query(query, feed_id, result);
    }

    static deleteAll(result) {
        const query = "DELETE FROM articles";
        db.query(query, result);
    }

    static getArticleCount(result) {
        const query = "SELECT COUNT(*) AS article_count FROM articles";
        db.query(query, result);
    }

    static getArticleCountByFeedId(feed_id, result) {
        const query = "SELECT COUNT(*) AS article_count FROM articles WHERE feed_id = ?";
        db.query(query, feed_id, result);
    }

    static getArticleCountByPublishedAt(published_at, result) {
        const query = "SELECT COUNT(*) AS article_count FROM articles WHERE published_at = ?";
        db.query(query, published_at, result);
    }

    static getArticleCountByFeedIdAndPublishedAt(feed_id, published_at, result) {
        const query = "SELECT COUNT(*) AS article_count FROM articles WHERE feed_id = ? AND published_at = ?";
        db.query(query, [feed_id, published_at], result);
    }

    static getArticlesByPublishedAt(published_at, result) {
        const query = "SELECT * FROM articles WHERE published_at = ?";
        db.query(query, published_at, result);
    }

    static getArticlesByFeedIdAndPublishedAt(feed_id, published_at, result) {
        const query = "SELECT * FROM articles WHERE feed_id = ? AND published_at = ?";
        db.query(query, [feed_id, published_at], result);
    }

    static getArticlesByFeedIdAndPublishedAtAndGuid(feed_id, published_at, guid, result) {
        const query = "SELECT * FROM articles WHERE feed_id = ? AND published_at = ? AND guid = ?";
        db.query(query, [feed_id, published_at, guid], result);
    }

    static getArticlesByFeedIdAndGuid(feed_id, guid, result) {
        const query = "SELECT * FROM articles WHERE feed_id = ? AND guid = ?";
        db.query(query, [feed_id, guid], result);
    }

}

module.exports = Articles;