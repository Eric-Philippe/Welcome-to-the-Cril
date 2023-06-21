const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription(
      "Begin a rude fight of ping-pong agaisnt the undefeated bot !"
    ),
  async execute(interaction) {
    await interaction.reply("🏓 Pong! 🏓");
    await interaction.followUp({ content: "🏓 Pong Again ! Easy Win 🏓" });
  },
};
