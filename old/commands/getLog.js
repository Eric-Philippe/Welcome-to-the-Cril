const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("getlogs")
    .setDescription("Getter of the logs file !")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    await interaction.reply("📁 Here is the logs file ! 📁");
    await interaction.followUp({ files: ["./logs/Events.log"] });
  },
};
