const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

module.exports = {
  createCodeModal: async function () {
    const modalInputCode = new ModalBuilder()
      .setCustomId("modal_code")
      .setTitle("🔒 | Merci d'entrer votre code");

    const fields = {
      firstNameInput: new TextInputBuilder()
        .setCustomId("code")
        .setLabel("🔑 | Voir mail de confirmation de l'activité")
        .setMinLength(6)
        .setMaxLength(6)
        .setPlaceholder("#")
        .setStyle(TextInputStyle.Short)
        .setRequired(true),
    };

    const firstActionRow = new ActionRowBuilder().addComponents(
      fields.firstNameInput
    );

    modalInputCode.addComponents(firstActionRow);

    return modalInputCode;
  },
};
