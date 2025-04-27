const RssParser = require("rss-parser");
const parser = new RssParser({
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["dc:subject", "dcSubject", { keepArray: true }],
      ["dc:creator", "dcCreator"],
      ["dc:date", "dcDate"],
      ["enclosure", "enclosure"],
    ],
  },
});

const RssFeeds = require("../models/rssFeeds.model");
const Articles = require("../models/articles.model");

async function getRssFeed(url) {
  try {
    const feed = await parser.parseURL(url);
    return feed;
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    throw error;
  }
}

// Fonction pour nettoyer le HTML
function stripHtml(html) {
  if (!html) return "";

  // Supprimer les balises CDATA
  let text = html.toString().replace(/<!\[CDATA\[|\]\]>/g, "");

  // Supprimer les balises HTML
  text = text.replace(/<[^>]*>/g, " ");

  // Remplacer les entités HTML courantes
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  // Supprimer les espaces multiples
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

let totalArticlesCreated = 0;

async function createArticles(articles) {
  try {
    console.log("Articles à traiter:", articles.length);
    let articlesCreated = 0;

    for (const article of articles) {
      if (!article.items || !Array.isArray(article.items)) {
        console.log(`Feed ${article.feed_id} n'a pas d'items ou items n'est pas un tableau`);
        continue;
      }

      console.log(`Traitement de ${article.items.length} articles du flux ${article.feed_id}`);

      for (const item of article.items) {
        if (!item) continue;

        // Formatage de la date pour MySQL
        let formattedDate = null;
        if (item.pubDate) {
          const dateObj = new Date(item.pubDate);
          if (!isNaN(dateObj.getTime())) {
            formattedDate = dateObj.toISOString().slice(0, 19).replace('T', ' ');
          }
        }

        // S'assurer que category_id est un nombre ou null
        const categoryId = article.category_id ? parseInt(article.category_id, 10) : null;
        
        // Créer un snippet en tronquant le contenu
        const contentSnippet = item.content ? 
          stripHtml(item.content).substring(0, 255) : 
          null;

        const newArticle = new Articles(
          null,                // id
          article.feed_id,     // feed_id
          item.title,          // title
          item.link,           // link
          contentSnippet,      // description (utilisé comme content_snippet)
          formattedDate,       // published_at
          item.content,        // content
          item.imageUrl,       // image_url
          item.guid,           // guid
          formattedDate        // iso_date (même valeur que published_at)
        );

        try {
          // Vérifier si l'article existe déjà
          const exists = await Articles.existsByGuid(newArticle.guid);
          if (exists) {
            console.log(`Article avec guid ${newArticle.guid} existe déjà, on passe`);
            continue;
          }

          // Paramètres pour createArticle
          const articleData = {
            feed_id: article.feed_id,
            title: item.title || '',
            link: item.link || '',
            category_id: categoryId,
            published_at: formattedDate,
            content: item.content || '',
            content_snippet: contentSnippet,
            image_url: item.imageUrl || null,
            guid: item.guid || item.link,
            iso_date: formattedDate
          };

          await new Promise((resolve, reject) => {
            Articles.create(articleData, (err, data) => {
              if (err) {
                console.error("Erreur lors de la création de l'article:", err);
                reject(err);
              } else {
                articlesCreated++;
                totalArticlesCreated++;
                console.log(`Article créé: ${item.title}`);
                resolve(data);
              }
            });
          });
        } catch (error) {
          console.error(`Erreur lors du traitement de l'article ${item.guid}:`, error);
        }
      }
    }

    console.log(`Total d'articles créés dans ce cycle: ${articlesCreated}`);
    console.log(`Total cumulé d'articles créés: ${totalArticlesCreated}`);

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
      console.warn("No RSS feeds found.");
      return;
    }

    const articles = [];
    for (const feed of feeds) {
      try {
        const rssFeed = await getRssFeed(feed.url);
        console.log(
          `Retrieved RSS feed: ${feed.url}, found ${rssFeed.items.length} articles`
        );

        articles.push({
          feed_id: feed.id,
          title: rssFeed.title,
          items: rssFeed.items,
          category_id: feed.category,
        });
      } catch (error) {
        console.error(`Error retrieving RSS feed for ${feed.url}:`, error);
      }
    }

    const articlesCreated = await createArticles(articles);
    console.log(`Total articles created in this cycle: ${articlesCreated}`);
  } catch (error) {
    console.error("Error retrieving RSS feeds:", error);
  }
}

setInterval(refreshIncomingArticle, 600000); // 10 minutes

module.exports = { getRssFeed, createArticles, refreshIncomingArticle };
