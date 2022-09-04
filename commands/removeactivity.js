const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");

const verifiedUsers = require("../verifiedAccount.json"); // BDD

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removeactivity")
    .setDescription(
      "Retire un utilisateur de la liste d'utilisateurs ayant effectué l'activité initiation."
    )
    .addUserOption((option) =>
      option
        .setName("utilisateur")
        .setDescription("L'utilisateur à retirer de la liste.")
        .setRequired(true)
    ),
  async execute(interaction) {
    let user = interaction.options.getUser("utilisateur");
    if (!verifiedUsers.activityFinished.includes(user.id))
      return interaction.reply("⭕ | L'utilisateur n'est pas dans la liste.");

    verifiedUsers.activityFinished.splice(
      verifiedUsers.activityFinished.indexOf(user.id),
      1
    );
    fs.writeFileSync(
      "verifiedAccount.json",
      JSON.stringify(verifiedUsers, null, 2)
    );
    interaction.reply("✅ | L'utilisateur a été retiré de la liste.");
  },
};
