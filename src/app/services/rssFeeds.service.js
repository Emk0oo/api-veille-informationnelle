const RssParser = require("rss-parser");
const parser = new RssParser();

const RssFeeds = require("../models/rssFeeds.model");
const Articles = require("../models/articles.model");
const { data } = require("autoprefixer");
const { set } = require("mongoose");

async function getRssFeed(url) {
  try {
    const feed = await parser.parseURL(url);
    return feed;
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    throw error;
  }
}

let totalArticlesCreated = 0;

async function createArticles(articles) {
  try {
    let articlesCreated = 0;

    for (const article of articles) {
      if (!article.items || !Array.isArray(article.items)) {
        continue;
      }

      for (const item of article.items) {
        if (!item) continue;

        const newArticle = {
          feed_id: article.feed_id,
          title: item.title,
          link: item.link,
          category_id: item.category_id || null,
          published_at: item.pubDate
            ? new Date(item.pubDate)
                .toISOString()
                .slice(0, 19)
                .replace("T", " ")
            : null,
          content: item.content || "",
          content_snippet: item.contentSnippet || "",
          image_url: item.enclosure?.url || null,
          guid: item.guid,
          iso_date: item.isoDate,
        };

        try {
          const existingArticle = await new Promise((resolve, reject) => {
            Articles.getArticlesByFeedIdAndGuid(
              newArticle.feed_id,
              newArticle.guid,
              (err, result) => {
                if (err) reject(err);
                else resolve(result);
              }
            );
          });

          console.log(
            `🔍 Vérification du doublon pour GUID: ${newArticle.guid}, Résultat:`,
            existingArticle
          );

          if (existingArticle.length > 0) {
            console.log(`❌ Article déjà existant: ${newArticle.title}`);
            continue;
          }

          await new Promise((resolve, reject) => {
            Articles.create(newArticle, (err, data) => {
              if (err) reject(err);
              else resolve(data);
            });
          });

          articlesCreated++;
          totalArticlesCreated++;
          console.log(
            `✅ Article inséré: ${newArticle.title} (Total: ${totalArticlesCreated})`
          );
        } catch (error) {
          console.error(
            `❌ Erreur lors du traitement de l'article ${newArticle.guid}:`,
            error
          );
        }
      }
    }

    console.log(`🔄 Cycle terminé. ${articlesCreated} nouveaux articles.`);
    console.log(`📊 Total cumulé d'articles créés: ${totalArticlesCreated}`);

    return articlesCreated;
  } catch (error) {
    console.error("❌ Erreur globale dans createArticles:", error);
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
      console.warn("⚠️ Aucun flux RSS trouvé.");
      return;
    }

    const articles = [];
    for (const feed of feeds) {
      try {
        const rssFeed = await getRssFeed(feed.url);
        console.log(
          `📡 Récupération du flux RSS: ${feed.url}, ${rssFeed.items.length} articles trouvés`
        );

        articles.push({
          feed_id: feed.id,
          title: rssFeed.title,
          items: rssFeed.items,
          category_id: feed.category,
        });
      } catch (error) {
        console.error(
          `❌ Erreur lors de la récupération du flux RSS pour ${feed.url}:`,
          error
        );
      }
    }

    const articlesCreated = await createArticles(articles);
    console.log(`🔥 Total articles créés dans ce cycle: ${articlesCreated}`);
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des flux RSS:", error);
  }
}

setInterval(refreshIncomingArticle, 2000);

module.exports = { getRssFeed, createArticles, refreshIncomingArticle };
