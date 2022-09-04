const { REST } = require("@discordjs/rest");
const { Routes } = require("discord.js");
const { token, clientID, secondGuildID, mainGuildID } = require("./config.js");
const fs = require("fs");

const commands = [];
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

const clientId = clientID;
const guildId = mainGuildID;

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    rest
      .put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
      .then(() => console.log("Successfully deleted all guild commands."))
      .catch(console.error);

    rest
      .put(Routes.applicationCommands(clientId), { body: [] })
      .then(() => console.log("Successfully deleted all application commands."))
      .catch(console.error);

    console.log(`Successfully deleted all the application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();
