const { Message } = require("discord.js");
/**
 * Basic ReactionsCollector Wrapper
 * @param {Message} msg The message we're working with
 * @param {Function} filter Filter for the collector
 * @param {Number} time Time before the collector ends by itself in ms
 * @returns {Promise.<String>}
 */
module.exports = function ReactionsCollector(
  msg,
  filter,
  time = 6 * 60 * 60_000
) {
  return new Promise((resolve, reject) => {
    if (!filter) filter = () => true;
    const collector = msg.createReactionCollector({
      filter,
      time,
    });
    collector.on("collect", (reaction, user) => {
      resolve(reaction.emoji.name);
    });
    collector.on("end", (collected, reason) => {
      if (reason === "time") reject(new Error("time"));
      else if (reason === "error")
        console.trace("Error in the ReactionsCollector");
    });
  });
};
