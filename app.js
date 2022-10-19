const { client } = require("./client.js");

const commandsLoad = require("./utils/commandsLoad.js");
const Journalisation = require("./logs/Journalisation.js");
const TYPES = require("./logs/Types.js");
const InfoLogs = new Journalisation(TYPES.EVENTS);

const { DISCORD_TOKEN, mainServerId, initServerId } = require("./env.js");

const EntrySystem = require("./Processus/EntrySystem/EntrySystem");
const InitiationActivity = require("./Processus/InitiationActivity/InitiationActivity");
const { getPendingUsers, removePendingUser } = require("./database/main.js");

commandsLoad();
client.once("ready", () => {
  client.user.setActivity("👋 Salutations, Voyageurs !");
  console.log(`%cLogged on ${client.user.tag}!`, "color: #c00006;");
});

client.on("guildMemberAdd", (member) => {
  if (client.bypassEntry.includes(member.user.id)) {
    removePendingUser(member.user.id);
    return;
  }
  InfoLogs.addLog(`Nouveau membre sur ${member.guild.name}`, member.user);
  const mainServer = client.guilds.cache.get(mainServerId);
  const mainServerMembersCache = mainServer.members.cache;
  const initServer = client.guilds.cache.get(initServerId);
  const initServerMembersCache = initServer.members.cache;

  if (
    mainServerMembersCache.has(member.id) &&
    initServerMembersCache.has(member.id)
  ) {
    if (member.guild.id === mainServer.id) {
      try {
        let initServerMember = initServerMembersCache.find(
          (mb) => mb.id == member.id
        );
        initServerMember.kick(
          "Double Entrée Détectée ! Annulation de l'activité . . ."
        );
        InfoLogs.addLog(
          `Double entrée détéctée pour ${member.user.username}`,
          member.user
        );
      } catch (err) {
        console.log(err);
      }
    }
  }

  switch (true) {
    case member.guild.id === mainServerId:
      new EntrySystem(member, member.guild);
      break;
    case member.guild.id === initServerId:
      new InitiationActivity(
        member,
        getPendingUsers().includes(member.user.id)
      );
      break;
    default:
      return;
  }
});

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

client.login(DISCORD_TOKEN);
