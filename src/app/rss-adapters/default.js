module.exports = {
    name: 'default',
    parse: (rawFeed) => {
      try {
        // Extraction basique qui fonctionne pour la plupart des flux
        return {
          items: rawFeed.items.map(item => ({
            title: item.title ? (typeof item.title === 'string' ? item.title : item.title._) : "",
            link: item.link || "",
            description: item.content || item.description || item.contentSnippet || "",
            pubDate: item.pubDate || item.isoDate || item.dcDate,
            guid: item.guid ? (typeof item.guid === 'object' ? item.guid._ : item.guid) : (item.link || ""),
            imageUrl: null
          }))
        };
      } catch (error) {
        console.error('Error parsing with default adapter:', error);
        return { items: [] };
      }
    }
  };