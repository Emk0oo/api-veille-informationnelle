const RssParser = require("rss-parser");
const parser = new RssParser({
  customFields: {
    item: [
      ['media:content', 'mediaContent', {keepArray: true}],
      ['dc:subject', 'dcSubject', {keepArray: true}],
      ['dc:creator', 'dcCreator'],
      ['dc:date', 'dcDate'],
      ['enclosure', 'enclosure']
    ]
  }
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
  text = text.replace(/&nbsp;/g, " ")
             .replace(/&amp;/g, "&")
             .replace(/&lt;/g, "<")
             .replace(/&gt;/g, ">")
             .replace(/&quot;/g, "\"")
             .replace(/&#39;/g, "'");
  
  // Supprimer les espaces multiples
  text = text.replace(/\s+/g, " ").trim();
  
  return text;
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

        // Extraire une image depuis différentes sources possibles
        let imageUrl = null;
        if (item.enclosure && item.enclosure.url) {
          imageUrl = item.enclosure.url;
        } else if (item.mediaContent && item.mediaContent.length > 0) {
          const media = item.mediaContent.find(m => m.$ && (m.$.url || m.$.href));
          if (media && media.$) {
            imageUrl = media.$.url || media.$.href;
          }
        }

        // Gérer les différentes façons de stocker la date de publication
        let publishedAt = null;
        const possibleDateFields = [
          item.pubDate,
          item.dcDate,
          item.isoDate,
          item.date
        ];

        for (const dateField of possibleDateFields) {
          if (dateField) {
            const dateObj = new Date(dateField);
            if (!isNaN(dateObj.getTime())) {
              publishedAt = dateObj.toISOString().slice(0, 19).replace("T", " ");
              break;
            }
          }
        }

        // Extraire le contenu ou la description et nettoyer le HTML
        let content = stripHtml(item.content || "");
        let contentSnippet = stripHtml(item.contentSnippet || item.description || "");
        
        // Extraire les catégories ou sujets (dc:subject)
        let categories = [];
        if (item.categories && Array.isArray(item.categories)) {
          categories = item.categories;
        } else if (item.dcSubject && Array.isArray(item.dcSubject)) {
          categories = item.dcSubject;
        }

        // Normaliser le GUID
        let guid = item.guid;
        if (typeof guid === 'object' && guid._) {
          guid = guid._;
        }
        if (!guid && item.link) {
          guid = item.link; // Utiliser le lien comme GUID de secours
        }

        // Normaliser le titre
        let title = "";
        if (item.title) {
          title = typeof item.title === 'string' ? item.title : item.title._;
          title = stripHtml(title);
        }

        const newArticle = {
          feed_id: article.feed_id,
          title: title,
          link: item.link || "",
          category_id: article.category_id || null,
          published_at: publishedAt,
          content: content,
          content_snippet: contentSnippet,
          image_url: imageUrl,
          guid: guid,
          iso_date: item.isoDate || publishedAt
        };

        try {
          // Vérifier si l'article existe déjà
          const exists = await Articles.existsByGuid(newArticle.guid);
          if (exists) {
            continue;
          }

          await new Promise((resolve, reject) => {
            Articles.create(newArticle, (err, data) => {
              if (err) reject(err);
              else {
                articlesCreated++;
                totalArticlesCreated++;
                resolve(data);
              }
            });
          });
        } catch (error) {
          console.error(`Error processing article ${newArticle.guid}:`, error);
        }
      }
    }

    console.log(`Total articles created in this cycle: ${articlesCreated}`);
    console.log(`Cumulative total articles created: ${totalArticlesCreated}`);

    return articlesCreated;
  } catch (error) {
    console.error("Global error in createArticles:", error);
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
        console.log(`Retrieved RSS feed: ${feed.url}, found ${rssFeed.items.length} articles`);

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