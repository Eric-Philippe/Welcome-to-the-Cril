const { Collection } = require("discord.js");
const path = require("path");
const fs = require("fs");

const { client } = require("../client.js");
/**
 * Loads all the commands from the commands folder
 */
module.exports = function commandsLoad() {
  client.bypassEntry = [];
  client.commands = new Collection();
  const commandsPath = path.join("./commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require("../" + filePath);
    client.commands.set(command.data.name, command);
  }
};
