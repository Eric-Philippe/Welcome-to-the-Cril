const { User, ChatInputCommandInteraction } = require("discord.js");
const fs = require("fs");

module.exports = class Journalisation {
  constructor(title) {
    this.title = title;
  }
  /**
   * Add a log to the journal
   * @param {String} log
   * @param {User} user
   */
  addLog(log, user) {
    // Get the date in a format yyyy-mm-dd hh:mm:ss
    let date = new Date();
    let dateStr = `[ ${date.getFullYear()}/${
      date.getMonth() + 1
    }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ]`;
    fs.appendFile(
      `./logs/${this.title}.log`,
      dateStr + " - " + log + " - " + `"${user.username}" - ${user.id}` + "\n",
      (err) => {
        if (err) throw err;
      }
    );
  }
  /**
   * Add Channels logs to the journal
   * @param {String} log
   */
  addBasicLogs(log) {
    // Get the date in a format yyyy-mm-dd hh:mm:ss
    let date = new Date();
    let dateStr = `[ ${date.getFullYear()}/${
      date.getMonth() + 1
    }/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ]`;
    fs.appendFile(
      `./logs/${this.title}.log`,
      dateStr + " - " + log + "\n",
      (err) => {
        if (err) throw err;
      }
    );
  }

  /**
   * Give the user the log file
   * @param {ChatInputCommandInteraction} i
   */
  getLog(i) {
    i.reply({
      content: "Voici le journal demandé",
      files: [`./logs/${this.title}.log`],
    });
  }
};
