const {
  ButtonInteraction,
  Message,
  ComponentType,
  User,
} = require("discord.js");

const Journalisation = require("../logs/Journalisation");
const { ERRORS } = require("../logs/Types");
/**
 * Button Collector that will call itself if someone not expected click on the button
 * @param {Message} msg The message we're working with
 * @param {Function} filter Filter for the collector
 * @param {Number} time Time before the collector ends by itself in ms
 * @param {User} user User that will be able to resolve the collector
 * @param {Function} recursiveAfterResolve If the collector will call itself after a resolve
 * @returns {Promise.<ButtonInteraction>}
 */
module.exports = function ButtonsRecursiveCollector(
  msg,
  filter,
  time = 6 * 60 * 60_000,
  user,
  recursiveAfterResolve
) {
  const Logger = new Journalisation(ERRORS);
  return new Promise((resolve, reject) => {
    if (!filter) filter = () => true;

    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      filter,
      time,
      max: 1,
    });

    collector.on("collect", (interaction) => {
      if (interaction.user.id === user.id) {
        if (recursiveAfterResolve) {
          recursiveAfterResolve(interaction);
          resolve(
            ButtonsRecursiveCollector(
              msg,
              filter,
              time,
              user,
              recursiveAfterResolve
            )
          );
        } else {
          interaction.deferUpdate();
          resolve(interaction);
        }
      } else {
        interaction.reply({ content: "That's not for you !", ephemeral: true });
        Logger.addLog(
          "User clicked on a button that wasn't meant for him",
          user
        );
        resolve(ButtonsRecursiveCollector(msg, filter, time, user));
      }
    });

    collector.on("end", (collected, reason) => {
      if (reason === "time") reject(new Error("time"));
      else if (reason === "error")
        console.log("Error in the ButtonsRescursiveCollector");
    });
  });
};
