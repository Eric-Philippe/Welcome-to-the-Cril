const { Message, ButtonInteraction, ComponentType } = require("discord.js");
/**
 * Basic ButtonsCollector Wrapper
 * @param {Message} msg The message we're working with
 * @param {Function} filter Filter for the collector
 * @param {Number} time Time before the collector ends by itself in ms
 * @param {Boolean} deferUpdate Whether or not to defer the update
 * @returns {Promise.<ButtonInteraction>}
 */
module.exports = function ButtonsCollector(
  msg,
  filter,
  time = 6 * 60 * 60_000,
  deferUpdate
) {
  return new Promise((resolve, reject) => {
    if (!filter) filter = () => true;
    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter,
      time,
    });
    collector.on("collect", (interaction) => {
      if (deferUpdate) interaction.deferUpdate();
      resolve(interaction);
    });
    collector.on("end", (collected, reason) => {
      if (reason == "channelDelete") return;
      if (reason === "time") reject(new Error("time"));
      else if (reason === "error") reject(new Error(reason));
    });
  });
};
