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
        const query = `
            INSERT INTO articles (feed_id, title, link, category_id, published_at, content, content_snippet, image_url, guid, iso_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                title = VALUES(title), 
                category_id = VALUES(category_id), 
                published_at = VALUES(published_at), 
                content = VALUES(content), 
                content_snippet = VALUES(content_snippet),
                image_url = VALUES(image_url), 
                iso_date = VALUES(iso_date)
        `;
    
        const values = [
            newArticle.feed_id, newArticle.title, newArticle.link, newArticle.category_id,
            newArticle.published_at, newArticle.content, newArticle.content_snippet, newArticle.image_url,
            newArticle.guid, newArticle.iso_date
        ];
    
        // Vérification pour éviter les erreurs SQL
        if (values.length !== 10) {
            console.error("Erreur : Nombre de valeurs incorrect", values);
            result(new Error("Nombre de valeurs incorrect"), null);
            return;
        }
    
        db.query(query, values, (err, res) => {
            if (err) {
                console.error("Erreur lors de l'insertion/mise à jour de l'article:", err);
                result(err, null);
                return;
            }
            result(null, res);
        });
    }

    static async existsByGuid(guid) {
        return new Promise((resolve, reject) => {
            const query = "SELECT COUNT(*) AS count FROM articles WHERE guid = ?";
            db.query(query, [guid], (err, result) => {
                if (err) {
                    console.error("Erreur SQL lors de la vérification du GUID:", err);
                    reject(err);
                } else {
                    resolve(result[0].count > 0);
                }
            });
        });
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

    static getArticleByTitle(title, result) {
        const query = "SELECT * FROM articles WHERE title = ?";
        db.query(query, title, result);
    }

    static getArticleByFeedId(feed_id, result) {
        const query = "SELECT * FROM articles WHERE feed_id = ?";
        db.query(query, feed_id, result);
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