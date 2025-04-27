const defaultAdapter = require('./default');
const franceInfoAdapter = require('./franceinfo');

class AdapterRegistry {
  constructor() {
    this.adapters = {
      'default': defaultAdapter,
      'franceinfo': franceInfoAdapter
    };
    
    console.log(`Loaded ${Object.keys(this.adapters).length} RSS adapters`);
  }

  getAdapterForUrl(url) {
    // Pour le test, on utilise franceinfo seulement pour l'URL spécifique
    if (url.includes('francetvinfo.fr')) {
      console.log('Using franceinfo adapter for URL:', url);
      return this.adapters.franceinfo;
    }
    
    console.log('Using default adapter for URL:', url);
    return this.adapters.default;
  }
}

module.exports = new AdapterRegistry();