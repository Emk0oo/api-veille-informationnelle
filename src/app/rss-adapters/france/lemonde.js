module.exports = {
  name: 'LeMonde',
  parse: (rawFeed) => {
    try {
      return {
        items: rawFeed.items.map(item => {
          // Extraire l'image - Le Monde utilise media:content
          let imageUrl = null;
          if (item.enclosure && item.enclosure.url) {
            imageUrl = item.enclosure.url;
          } else if (item.mediaContent && item.mediaContent.length > 0) {
            // Certains flux RDF/RSS utilisent mediaContent (transformé par rss-parser)
            const media = item.mediaContent.find(m => m.$ && (m.$.url || m.$.href));
            if (media && media.$) {
              imageUrl = media.$.url || media.$.href;
            }
          } else if (item['media:content'] && item['media:content'].$ && item['media:content'].$.url) {
            // Accès direct à media:content (au cas où)
            imageUrl = item['media:content'].$.url;
          }
          
          // Nettoyer le titre et la description des balises CDATA
          let title = item.title || '';
          if (typeof title === 'string') {
            title = title.replace(/<!\[CDATA\[|\]\]>/g, '').trim();
          }
          
          let content = item.description || '';
          if (typeof content === 'string') {
            content = content.replace(/<!\[CDATA\[|\]\]>/g, '').trim();
          }
          
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