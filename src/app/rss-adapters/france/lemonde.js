module.exports = {
  name: 'LeMonde',
  parse: (rawFeed) => {
    try {
      return {
        items: rawFeed.items.map(item => {
          // Extraire l'image - Le Monde utilise media:content
          let imageUrl = null;
          if (item.mediaContent && item.mediaContent.length > 0) {
            // Certains flux RDF/RSS utilisent mediaContent (transformé par rss-parser)
            const media = item.mediaContent.find(m => m.$ && (m.$.url || m.$.href));
            if (media && media.$) {
              imageUrl = media.$.url || media.$.href;
            }
          } else if (item.enclosure && item.enclosure.url) {
            imageUrl = item.enclosure.url;
          }
          
          // Nettoyer le titre des balises CDATA
          let title = item.title || '';
          if (typeof title === 'string') {
            title = title.replace(/<!\[CDATA\[|\]\]>/g, '').trim();
          }
          
          // S'assurer que content et content_snippet ne sont pas vides
          let content = '';
          if (item.description) {
            content = item.description.replace(/<!\[CDATA\[|\]\]>/g, '').trim();
          } else if (item.content) {
            content = item.content.replace(/<!\[CDATA\[|\]\]>/g, '').trim();
          } else if (item.contentSnippet) {
            content = item.contentSnippet.replace(/<!\[CDATA\[|\]\]>/g, '').trim();
          }
          
          // Créer un snippet à partir du contenu
          const contentSnippet = content.length > 255 ? content.substring(0, 252) + '...' : content;
          
          // Normaliser le guid
          let guid = item.guid;
          if (typeof guid === 'object' && guid._) {
            guid = guid._;
          } else if (typeof guid === 'object' && guid.isPermaLink) {
            guid = item.link;
          }
          
          return {
            title: title,
            link: item.link || guid,
            content: content,
            contentSnippet: contentSnippet,  // Ajout explicite du contentSnippet
            pubDate: item.pubDate,
            guid: guid || item.link,
            imageUrl: imageUrl,
            categories: item.categories || ['actualité']
          };
        })
      };
    } catch (error) {
      console.error('Error parsing with LeMonde adapter:', error);
      return { items: [] };
    }
  }
};