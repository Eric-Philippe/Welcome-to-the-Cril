const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");

const codesEntry = require("../codesEntry.json"); // BDD

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
      if (codesEntry.CODES.includes(code))
        return interaction.reply("⭕ | Le code existe déjà.");
      codesEntry.CODES.push(code);
      fs.writeFileSync("codesEntry.json", JSON.stringify(codesEntry, null, 2));
      interaction.reply("✅ | Le code a été ajouté.");
    } else if (subcommand === "remove") {
      let code = interaction.options.getString("code");
      code = "#" + code;
      if (!codesEntry.CODES.includes(code))
        return interaction.reply("⭕ | Le code n'existe pas.");
      codesEntry.CODES.splice(codesEntry.CODES.indexOf(code), 1);
      fs.writeFileSync("codesEntry.json", JSON.stringify(codesEntry, null, 2));
      interaction.reply("✅ | Le code a été retiré.");
    } else if (subcommand === "display") {
      interaction.reply(
        "Voici la liste des codes : " + codesEntry.CODES.join(", ")
      );
    }
  },
};
