const { Message, ButtonInteraction, ComponentType } = require("discord.js");
/**
 *
 * @param {Message} msg
 * @param {Function} filter
 * @param {Number} time
 * @param {Boolean} deferUpdate
 * @returns
 */
module.exports = function GeneralButtonsCollector(
  msg,
  filter,
  time = 6 * 60 * 60_000,
  deferUpdate
) {
  return new Promise((resolve, reject) => {
    if (!filter) filter = () => true;
    const collector = msg.createMessageComponentCollector({
      ComponentType: ComponentType.Button,
      filter,
      time,
    });

    collector.on("on");
  });
};
