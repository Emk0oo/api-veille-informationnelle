module.exports = {
  name: 'franceinfo',
  parse: (rawFeed) => {
    try {
      return {
        items: rawFeed.items.map(item => {
          // France Info utilise le champ enclosure pour les images
          let imageUrl = null;
          if (item.enclosure && item.enclosure.url) {
            imageUrl = item.enclosure.url;
          }
          
          return {
            title: item.title,
            link: item.link,
            content: item.content,
            pubDate: item.pubDate,
            guid: item.guid,
            imageUrl: imageUrl,
            categories: ['monde'] // France Info Monde
          };
        })
      };
    } catch (error) {
      console.error('Error parsing with franceinfo adapter:', error);
      return { items: [] };
    }
  }
};