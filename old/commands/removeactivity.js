const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

const { removeFinishedUser } = require("../database/main");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removeactivity")
    .setDescription(
      "Retire un utilisateur de la liste d'utilisateurs ayant effectué l'activité initiation."
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("L'utilisateur à retirer de la liste.")
        .setRequired(true)
    ),
  async execute(interaction) {
    let user = interaction.options.getUser("utilisateur");
    let i = await removeFinishedUser(user.id);
    if (i == -1)
      return interaction.reply("⭕ | L'utilisateur n'est pas dans la liste.");
    return interaction.reply("✅ | L'utilisateur a été retiré de la liste.");
  },
};
