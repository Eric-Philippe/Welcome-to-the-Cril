const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");

const {
  token,
  mainGuildID,
  secondGuildID,
  secondGuildStudentRole,
  codedUserRoleID,
} = require("./config.js");

const InitiationProcess = require("./InitiationProcess/InitiationProcess");
const EntrySystem = require("./EntrySystem/EntrySystem");

const { verifiedAccount, bypassEntry } = require("./verifiedAccount.json");

const { client } = require("./client");

client.once("ready", () => {
  client.user.setActivity("👋 Salutations, Voyageurs !");
  console.log(`%cLogged on ${client.user.tag}!`, "color: red;");
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
});
/**
 * New Member Event
 */
client.on("guildMemberAdd", (member) => {
  // Allow the user to bypass all the entry processs
  if (bypassEntry.includes(member.id)) return;
  // If the member just joined the main server
  if (member.guild.id === mainGuildID) {
    new EntrySystem(member);

    // If the member just joined the second server
  } else if (member.guild.id === secondGuildID) {
    let studentRole = member.guild.roles.cache.get(secondGuildStudentRole);
    let code;
    member.roles.add(studentRole);

    // If the user came with a code
    if (verifiedAccount.includes(member.user.id)) {
      let verifiedUserRole = member.guild.roles.cache.get(codedUserRoleID);
      member.roles.add(verifiedUserRole);
      code = "CODE";
    }

    let IP = new InitiationProcess(member, code);
    IP.process().catch((err) => {
      console.log(err);
    });
  }
});

client.login(token);
