const RssParser = require("rss-parser");
const parser = new RssParser();

const Articles = require("../models/articles.model");
const { data } = require("autoprefixer");

async function getRssFeed(url) {
  try {
    const feed = await parser.parseURL(url);
    return feed;
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    throw error;
  }
}

async function createArticles(articles) {
    try {
        let articlesCreated = 0;

        for (const article of articles) {
            if (!article.items || !Array.isArray(article.items)) {
                console.warn("Article sans items ou items n'est pas un tableau:", article);
                continue;
            }

            for (let i = 0; i < article.items.length; i++) {
                const item = article.items[i];

                if (!item) {
                    console.warn(`Item à l'index ${i} est undefined pour feed_id ${article.feed_id}`);
                    continue;
                }

                const newArticle = {
                    feed_id: article.feed_id,
                    title: item.title,
                    link: item.link,
                    category_id: item.category_id || null,  // S'assurer que category_id est bien défini
                    published_at: item.pubDate,
                    content: item.content || "",  // Valeur par défaut pour éviter NULL
                    content_snippet: item.contentSnippet || "", // Ajout d'une valeur par défaut
                    image_url: item.enclosure?.url || null,
                    guid: item.guid,
                    iso_date: item.isoDate,
                };

                try {
                    // Vérifier si l'article existe déjà via son `guid` ou `link`
                    const existingArticle = await new Promise((resolve, reject) => {
                        Articles.getArticlesByFeedIdAndGuid(newArticle.feed_id, newArticle.guid, (err, result) => {
                            if (err) reject(err);
                            else resolve(result);
                        });
                    });

                    if (existingArticle.length > 0) {
                        // console.log(`L'article avec GUID ${newArticle.guid} existe déjà, il est ignoré.`);
                        continue;
                    }

                    // Insérer l'article s'il n'existe pas
                    await new Promise((resolve, reject) => {
                        Articles.create(newArticle, (err, data) => {
                            if (err) reject(err);
                            else resolve(data);
                        });
                    });

                    articlesCreated++;

                } catch (error) {
                    console.error(`Erreur lors du traitement de l'article ${newArticle.guid}:`, error);
                }
            }
        }

        // console.log(`Processus terminé. ${articlesCreated} nouveaux articles créés.`);
        return articlesCreated;

    } catch (error) {
        console.error("Erreur globale dans createArticles:", error);
        throw error;
    }
}

async function refreshIncomingArticle() {
    try {
        const feeds = await new Promise((resolve, reject) => {
            RssFeeds.getAll((err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        if (!feeds || feeds.length === 0) {
            console.warn("Aucun flux RSS trouvé.");
            return;
        }

        const articles = [];
        for (const feed of feeds) {
            try {
                const rssFeed = await getRssFeed(feed.url);
                articles.push({
                    feed_id: feed.id,
                    title: rssFeed.title,
                    items: rssFeed.items,
                    category_id: feed.category
                });
            } catch (error) {
                console.error(`Erreur lors de la récupération du flux RSS pour ${feed.url}:`, error);
            }
        }

        const articlesCreated = await createArticles(articles);
        console.log(`Processus terminé. ${articlesCreated} nouveaux articles créés.`);

    } catch (error) {
        console.error("Erreur lors de la récupération des flux RSS:", error);
    }
}

module.exports = { getRssFeed, createArticles };
