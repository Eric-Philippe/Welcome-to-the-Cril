const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription(
      "Clear de 1 à 100 messages dans le salon où la commande est entrée."
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setMinValue(1)
        .setMaxValue(100)
        .setDescription("Nombre de messages à supprimer")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");
    try {
      await interaction.channel.bulkDelete(amount);
    } catch (error) {
      console.error(error);
    }
    interaction.reply({
      content: `✅ | ${amount} messages supprimés.`,
      ephemeral: true,
    });
  },
};
