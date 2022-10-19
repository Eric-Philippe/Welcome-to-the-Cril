/**
 * Array that contains the number emotes
 * @const {Array.<String>}
 */
const Emotes_Array = [
  "1️⃣",
  "2️⃣",
  "3️⃣",
  "4️⃣",
  "5️⃣",
  "6️⃣",
  "7️⃣",
  "8️⃣",
  "9️⃣",
  "🔟",
];
/**
 * Array that contains the number texts
 * @const {Array.<String>}
 */
const Id_Array = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
];
/**
 * @Class Answer_Interface
 * Answer Object Interface
 */
module.exports = class Answer_Interface {
  /**
   * Build the Answer Object Interface
   */
  constructor() {
    /** @type {String} */
    /** @example "The Headphones !" */
    this.text = "";
    /** @type {Number} */
    /** @example 1 */
    this.positioning = -1;
    /** @type {String} */
    /** @example ":one:" */
    this.emote = "";
    /** @type {String} */
    /** @example "one" */
    this.id = "";
  }
  /**
   * Setup the label of the answer
   * @param {String} text
   */
  setText(text) {
    this.text = text;
  }
  /**
   * Setup the positioning of the answer
   * @param {Number} int
   */
  setPostioning(int) {
    this.positioning = int;
    this.emote = Emotes_Array[int];
    this.id = Id_Array[int];
  }
  /**
   * Get the text of the answer
   * @returns {String}
   */
  getText() {
    return this.text;
  }
  /**
   * Get the emote of the answer
   * @returns {String}
   */
  getEmote() {
    return this.emote;
  }
  /**
   * Get the id of the answer
   * @returns {String}
   */
  getID() {
    return this.id;
  }
};
