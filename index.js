const axios = require('axios');

class NewsService {
  constructor() {
    this.users = new Map();
  }

  addUserRegion(chatId, region) {
    const user = this.users.get(chatId) || { chatId, regions: [] };
    if (!user.regions.includes(region)) {
      user.regions.push(region);
    }
    this.users.set(chatId, user);
  }

  removeUserRegion(chatId, region) {
    const user = this.users.get(chatId);
    if (user) {
      user.regions = user.regions.filter((r) => r !== region);
      this.users.set(chatId, user);
    }
  }

  getAllUsers() {
    return Array.from(this.users.values());
  }

  async fetchNewsForRegions(regions, currencies, NEWS_API_TOKEN) {
    const regionString = regions.join(',');
    let url = `https://cryptopanic.com/api/v1/posts/?auth_token=${NEWS_API_TOKEN}&regions=${regionString}`;

    if (currencies) {
      url += `&currencies=${currencies.join(',')}`;
    }
    const response = await axios.get(url);
    return this.decorateNews(response.data.results);
  }

  decorateNews(results) {
    const decoratedNews = results.map((post, index) => {
      const emoji = this.getEmoji(index);
      const fullLink = this.getFullLink(post.domain, post.slug);
      return `${index + 1}. ${emoji} ${post.title} - [Get full here](${fullLink})`;
    });
    return `📰 Update news:\n${decoratedNews.join('\n')}`;
  }

  getEmoji(index) {
    const emojis = [
      '🌟', '💼', '💰', '🌎', '🏅', '📉', '⛏', '🚀', '💡', '🔗',
      '📉', '🤖', '💼', '💰', '🔥', '⚠️', '⏳', '📉', '🌏', '🤣'
    ];
    return emojis[index % emojis.length];
  }

  getFullLink(domain, slug) {
    return `${domain}/${slug}`;
  }
}

module.exports = NewsService;
