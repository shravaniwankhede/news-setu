const crypto = require('crypto');

/**
 * Generates a unique SHA-256 hash for an article based on its title and description.
 * This is used to uniquely identify articles for caching purposes.
 * 
 * @param {string} title - The article title
 * @param {string} description - The article description
 * @returns {string} - SHA-256 hex digest
 */
const generateArticleHash = (title, description) => {
  const content = `${(title || '').trim().toLowerCase()}|${(description || '').trim().toLowerCase()}`;
  return crypto.createHash('sha256').update(content).digest('hex');
};

module.exports = {
  generateArticleHash,
};
