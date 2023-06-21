const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");

const { MODAL_NAME } = require("./Properties").PROPERTIES;

module.exports = {
  createFirstLastNameModal: async function () {
    const modalInputName = new ModalBuilder()
      .setCustomId(MODAL_NAME)
      .setTitle("Merci d'entrer les champs suivants !");

    const fields = {
      firstNameInput: new TextInputBuilder()
        .setCustomId("firstNameInput")
        .setLabel("Prénom : ")
        .setMinLength(2)
        .setMaxLength(15)
        .setStyle(TextInputStyle.Short)
        .setRequired(true),

      lastNameInput: new TextInputBuilder()
        .setCustomId("lastNameInput")
        .setLabel("Nom : ")
        .setMinLength(2)
        .setMaxLength(15)
        .setStyle(TextInputStyle.Short)
        .setRequired(true),
    };

    const firstActionRow = new ActionRowBuilder().addComponents(
      fields.firstNameInput
    );
    const secondActionRow = new ActionRowBuilder().addComponents(
      fields.lastNameInput
    );

    modalInputName.addComponents(firstActionRow, secondActionRow);

    return modalInputName;
  },
};
