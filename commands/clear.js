const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription(
      "Clear de 1 à 100 messages dans le salon où la commande est entrée."
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  // .addIntegerOption((option) => {
  //   option.setMaxValue(100);
  //   option.setMinValue(1);
  //   option.setName("amount");
  //   option.setDescription("Nombre de messages à supprimer");
  //   option.setRequired(true);
  // })
  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");
    try {
      await interaction.channel.bulkDelete(amount);
    } catch (error) {
      console.error(error);
    }
    interaction.reply(`✅ | ${amount} messages supprimés.`);
  },
};
