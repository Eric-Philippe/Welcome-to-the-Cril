const {
  TextChannel,
  EmbedBuilder,
  Message,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
  ComponentType,
  GuildMember,
} = require("discord.js");
const Page = require("./structure/PageInterface");
const labels = require("./LANG_LABELS");
module.exports = class BookEmbeds {
  /**
   * Book Embeds Discord Format
   * @param {TextChannel} channel
   * @param {GuildMember} member
   * @param {Number} time
   */
  constructor(channel, member, time) {
    /**
     * @type {TextChannel}
     * The channel where the book will be sent
     */
    this.channel = channel;
    /**
     * @type {Number}
     * The time before the book is deleted
     */
    this.time = time ? time : 15 * 60 * 1000;
    /**
     * @type {GuildMember}
     * The member who will read the book
     */
    this.member = member;
    /**
     * @type {Message}
     * The message representing the book
     */
    this.msg = undefined;
    /**
     * @type {Array.<Page>}
     * All the pages of the book
     */
    this.pages = [];
    /**
     * @type {Array.<Number>}
     * The viewed pages
     */
    this.viewedPages = [];
    /**
     * @type {number}
     * The current page of the book
     * @default 0
     */
    this.currentPage = 0;
    /**
     * @type {number}
     * The amount of pages in the book
     * @default 0
     */
    this.totalPages = 0;
    /**
     * @type {String}
     * The color of the book
     * @default #000000
     */
    this.color = "#000000";
    /**
     * @type {String}
     * The title of the book
     * @default "Book"
     */
    this.title = "Book";
    /**
     * Language
     * @type {('en'|'fr')}
     * @default "en"
     * @description
     * en: English
     * fr: French
     * @example
     * bookEmbeds.setLanguage("fr");
     * bookEmbeds.setLanguage("en");
     */
    this.language = "en";
    /**
     * Languages available
     * @type {Array.<String>}
     * @default ["en", "fr"]
     * @readonly
     */
    this._languages = ["en", "fr"];
    /**
     * Is the book read
     * @type {Boolean}
     * @default false
     */
    this.isRead = false;
  }
  /**
   * Set the language of the book
   * @param {('en'|'fr')} language
   * @returns {BookEmbeds}
   */
  setLanguage(language) {
    if (!this._languages.includes(language))
      throw new Error("Invalid language");
    this.language = language;
    return this;
  }
  /**
   * Getter of the available languages
   * @returns {Array.<String>}
   */
  getLanguages() {
    return this._languages;
  }
  /**
   * Set the color of the book
   * @param {String} color
   * @returns {BookEmbeds}
   */
  setColor(color) {
    // Check if the color is a valid hex color
    if (!/^#[0-9A-F]{6}$/i.test(color)) throw new Error("Invalid color");
    this.color = color;
    return this;
  }
  /**
   * Getter of the message
   * @returns {Message}
   */
  getMessage() {
    return this.msg;
  }
  /**
   * Set the title of the book
   * @param {String} title
   * @returns {BookEmbeds}
   */
  setTitle(title) {
    this.title = title;
    return this;
  }
  /**
   * Load all the pages of the book
   * with a given array of embeds
   * @param {Array.<EmbedBuilder>} embeds
   * @returns {Number}
   */
  loadPages(embeds) {
    for (const embed of embeds) {
      if (typeof embed !== "object") throw new Error("Invalid embed");
      this.pages.push(new Page(embed));
    }
    this.totalPages = this.pages.length;
    return this.totalPages;
  }
  /**
   * Check if all is setup
   * Then send the first page of the book
   */
  async loadBook() {
    if (this.channel === undefined) throw new Error("Channel not set");
    if (this.pages.length === 0) throw new Error("Pages not set");
    if (this._iterator) this._iterator.next();
    this.viewedPages.push(this.currentPage);

    try {
      this.msg = await this.channel.send({
        embeds: [
          this.pages[this.currentPage].loadPage(
            this.color,
            this.currentPage + 1,
            this.totalPages
          ),
        ],
        components: [this.generateNavigationButtons()],
      });
      this.buttonBookCollector();
    } catch (e) {
      console.log(e);
    }
  }
  /**
   * Edit the new Page
   */
  async newPage() {
    this.msg = await this.msg.edit({
      embeds: [
        this.pages[this.currentPage].loadPage(
          this.color,
          this.currentPage + 1,
          this.totalPages
        ),
      ],
    });
    if (!this.viewedPages.includes(this.currentPage)) {
      this.viewedPages.push(this.currentPage);
    }
    if (this.viewedPages.length === this.totalPages) this.isRead = true;
    this.buttonBookCollector();
    if (this._iterator) this._iterator.next();
  }
  /**
   *  Generate the navigation buttons
   * @returns {ActionRowBuilder}
   */
  generateNavigationButtons() {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("previous")
        .setLabel(labels[this.language].PREVIOUS)
        .setStyle(ButtonStyle.Primary)
        .setEmoji("⬅️"),
      new ButtonBuilder()
        .setCustomId("next")
        .setLabel(labels[this.language].NEXT)
        .setStyle(ButtonStyle.Primary)
        .setEmoji("➡️")
    );
    return row;
  }
  /**
   * Navigation Button collector
   */
  buttonBookCollector() {
    const collector = this.msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: this.isRead ? undefined : this.time,
      filter: (button) => button.user.id === this.member.user.id,
      max: 1,
    });

    collector.on("collect", (button) => {
      button.deferUpdate();
      if (button.customId === "previous") {
        if (this.currentPage === 0) {
          this.currentPage = this.totalPages - 1;
        } else {
          this.currentPage--;
        }
      } else if (button.customId === "next") {
        if (this.currentPage === this.totalPages - 1) {
          this.currentPage = 0;
        } else {
          this.currentPage++;
        }
      }
      this.newPage();
    });

    collector.on("end", (collected, reason) => {
      if (reason === "time" && this.reject && !this.isRead) {
        console.log(this.currentPage);
        this.reject(new Error("time"));
      }
    });
  }
  /**
   * Send a resolve when the book is read
   */
  async awaitBookToBeRead() {
    this.loadBook();
    return new Promise((resolve, reject) => {
      this._iterator = this._generator(resolve);
      this.reject = reject;
    });
  }

  *_generator(resolve) {
    while (!this.isRead) {
      yield;
      if (this.isRead) resolve("Read !");
    }
  }
};
