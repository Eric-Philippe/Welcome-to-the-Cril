const Discord = require("discord.js");

const Answer_Interface = require("./Answer_Interface");
/**
 * @Class Question_Interface
 * Question Object Interface
 */
module.exports = class Question {
  /**
   * Build the Question Object Interface
   */
  constructor() {
    /** @type {String} */
    this.title = undefined;
    /** @type {Array.<Answer_Interface>} */
    this.answers = [];
    /** @type {Array.<Number>} */
    this.goodAnswers = [];
    /** @type {String} */
    this.imgURL = undefined;
    /** @type {String} */
    this.linkURL = undefined;
    /** @type {String} */
    this.color = "#00BFFF";
  }
  /**
   * Setup the title of the question
   * @param {String} title
   */
  setTitle(title) {
    this.title = title;
  }
  /**
   * Add an answer to the question
   * @param {Answer_Interface} answer
   */
  addAnswer(answer) {
    this.answers.push(answer);
  }
  /**
   * Setup a image URL for the question
   * @param {String} imgURL
   */
  setImgURL(imgURL) {
    this.imgURL = imgURL;
  }
  /**
   * Setup a ressource link for the question
   * @param {String} linkURL
   */
  setLinkURL(linkURL) {
    this.linkURL = linkURL;
  }
  /**
   * Setup the good answers of the question
   * @param {Array.<Number>} goodAnswers
   */
  setGoodAnswers(goodAnswers) {
    this.goodAnswers = goodAnswers;
  }
  /**
   * Get the label of the question
   * @returns {String}
   */
  getTitle() {
    return this.title;
  }
  /**
   * Get the answers of the question
   * @returns {Array.<Answer_Interface>}
   */
  getAnswer() {
    return this.answers;
  }
  /**
   * Get the image URL of the question
   * @returns {String}
   */
  getImgURL() {
    return this.imgURL;
  }
  /**
   * Get the ressource URL of the question
   * @returns {String}
   */
  getLinkURL() {
    return this.linkURL;
  }
  /**
   * Return if the answer is good
   * @param {Number} index
   * @returns {Boolean}
   */
  isGoodAnswer(index) {
    return this.goodAnswers.includes(index);
  }
  /**
   * ObjectToEmbed
   * @returns {Array.<Discord.Embed | Discord.ActionRowBuilder>}
   */
  toEmbed() {
    if (!this.title || !this.answers)
      throw new Error("Title or answers not set!");
    if (this.answers.length >= 6) throw new Error("Too much answers !");
    let row = new Discord.ActionRowBuilder();
    let embed = new Discord.EmbedBuilder()
      .setTitle(this.title)
      .setColor(this.color);
    if (this.linkURL)
      embed.setDescription(
        `[Cliquez sur ce lien en bleu pour accéder à la ressource !](${this.linkURL})`
      );
    if (this.imgURL)
      embed.setImage(this.imgURL).setFooter({
        text: "Vous pouvez cliquer sur l'image pour la voir en plein écran",
      });
    for (let answer of this.answers) {
      embed.addFields({
        name: answer.getEmote(),
        value: answer.getText(),
        inline: true,
      });
      row.addComponents(
        new Discord.ButtonBuilder()
          .setCustomId(answer.getID())
          .setEmoji(answer.getEmote())
          .setStyle(Discord.ButtonStyle.Secondary)
      );
    }

    return [embed, row];
  }
};
