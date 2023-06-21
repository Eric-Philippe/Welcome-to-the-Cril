const {
  Message,
  SelectMenuInteraction,
  ComponentType,
  InteractionCollector,
} = require("discord.js");

const { client } = require("../client");
/**
 * Basic MenusCollector Wrapper
 * @param {Function} filter Filter for the collector
 * @param {Number} time Time before the collector ends by itself in ms
 * @returns {Promise<SelectMenuInteraction>}
 */
module.exports = function MenusCollector(
  filter = true,
  time = 6 * 60 * 60_000
) {
  return new Promise((resolve, reject) => {
    const menuCollector = new InteractionCollector(client, {
      time: time,
      filter: filter,
      componentType: ComponentType.SelectMenu,
      maxUsers: 1,
    });

    menuCollector.on("collect", (i) => {
      i.reply({
        content: "Vous avez séléctionné " + i.values[0],
        ephemeral: true,
      });
      resolve(i.values[0]);
    });

    menuCollector.on("end", (collected, reason) => {
      if (reason === "time") reject(new Error("time"));
      else if (reason === "error")
        console.trace("Error in the ButtonsCollector");
    });
  });
};
