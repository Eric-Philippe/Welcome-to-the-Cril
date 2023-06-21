const { EmbedBuilder, Embed } = require("discord.js");
module.exports = class Page {
  /**
   *
   * @param {EmbedBuilder} embed
   */
  constructor(embed) {
    /**
     * @type {EmbedBuilder}
     * The Display of the page
     */
    this.embed = embed;
  }
  /**
   * Load the page
   * @param {String} color
   * @param {Number} numPage
   * @param {Number} totalPages
   * @returns {EmbedBuilder}
   */
  loadPage(color, numPage, totalPages) {
    this.embed.setColor(color);
    this.embed.setFooter({ text: `Page ${numPage}/${totalPages}` });
    return this.embed;
  }
};
