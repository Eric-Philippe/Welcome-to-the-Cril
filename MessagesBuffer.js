const { Message } = require("discord.js");
module.exports = class MessagesBuffer {
  constructor() {
    /**
     * @type {Array.<Message>}
     * Messages Buffer
     */
    this.messagesBuffer = [];
  }
  /**
   * Add a message to the buffer
   * @param {Message} message
   * @returns {Number}
   */
  add(message) {
    return this.messagesBuffer.push(message);
  }
  /**
   * Delete all messages in the buffer
   * @returns {Number} Amount of message deleted
   */
  async clear() {
    let i = 0;
    for (const message of this.messagesBuffer) {
      try {
        if (message && message.channel && message.deletable) {
          message
            .delete()
            .then(() => i++)
            .catch((err) => {});
        }
      } catch (error) {
        console.error(error);
      }
    }
    this.messagesBuffer = [];
    return i;
  }
  /**
   * Returns the last message in the buffer
   * @returns {Message}
   */
  last() {
    return this.messagesBuffer[this.messagesBuffer.length - 1];
  }
  /**
   * Returns the first message in the buffer
   * @returns {Number}
   */
  length() {
    return this.messagesBuffer.length;
  }
};
