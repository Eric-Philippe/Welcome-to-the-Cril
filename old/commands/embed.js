const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Créer un embed classique rouge.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setMinLength(1)
        .setRequired(true)
        .setName("message")
        .setDescription("Message à afficher dans l'embed.")
    ),
  async execute(interaction) {
    let embed = new EmbedBuilder()
      .setColor("#ff0000")
      .setDescription(interaction.options.getString("message"));
    await interaction.channel.send({ embeds: [embed] });
    await interaction.reply({ content: "Done", ephemeral: true });
  },
};
