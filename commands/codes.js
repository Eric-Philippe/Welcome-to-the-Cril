const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

const { addCode, removeCode, getCodes } = require("../database/main"); // Database

module.exports = {
  data: new SlashCommandBuilder()
    .setName("codes")
    .setDescription("Affiche tous les codes permettant de faire l'initiation !")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand.setName("display").setDescription("Affiche tous les codes")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription(
          "Ajoute un code à la liste sous la forme XXXXX Ex: R2D2A"
        )
        .addStringOption((option) =>
          option
            .setName("code")
            .setDescription("Code à ajouter")
            .setRequired(true)
            .setMinLength(5)
            .setMaxLength(5)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Retire un code de la liste.")
        .addStringOption((option) =>
          option
            .setName("code")
            .setDescription("Code à retirer")
            .setRequired(true)
            .setMinLength(5)
            .setMaxLength(5)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "add") {
      let code = interaction.options.getString("code");
      code = "#" + code;
      let i = await addCode(code);
      if (i == -1) return interaction.reply("⭕ | Le code existe déjà.");
      interaction.reply("✅ | Le code a été ajouté.");
    } else if (subcommand === "remove") {
      let code = interaction.options.getString("code");
      code = "#" + code;
      let i = await removeCode(code);
      if (i == -1) return interaction.reply("⭕ | Le code n'existe pas.");
      return interaction.reply("✅ | Le code a été retiré.");
    } else if (subcommand === "display") {
      interaction.reply("Voici la liste des codes : " + getCodes().join(", "));
    }
  },
};
