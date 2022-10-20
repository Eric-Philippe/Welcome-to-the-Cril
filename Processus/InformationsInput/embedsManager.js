const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextChannel,
  ActionRowBuilder,
} = require("discord.js");
const { gifAlert, gifChicken } = require("../../ressources");
const { PROPERTIES } = require("./Properties");

module.exports = {
  sendInstructionsEmbed: async function (channel, member) {
    let embedInstructions = new EmbedBuilder()
      .setTitle("⚙️ | Instructions")
      .setDescription(
        "On commence avec vos prénom, nom et département de l'IUT pour vous identifier sur le serveur. \n Cliquez sur le bouton vert pour commencer \n\n ⚠️ | **Pensez à bien lire tout ce que vous voyez car si vous êtes bloqué, c'est très probablement que vous avez __lu de travers les consignes ...__ \n ||ou bien vous ne les avez juste pas lus.|| \n ➡️ Ce par quoi vous serez tenu comme seul fautif.**"
      )
      .setColor("#BD0000")
      .setThumbnail(gifAlert)
      .setTimestamp();

    return await channel.send({ embeds: [embedInstructions] });
  },
  /**
   *
   * @param {TextChannel} channel
   * @param {*} member
   * @returns
   */
  sendFirstLastNameEmbed: async function (channel, member) {
    let embedFirstLastName = new EmbedBuilder()
      .setTitle("👤 | Prénom et Nom")
      .setDescription(
        "Cliquez maintenant sur le bouton en vert afin de pouvoir rentrer votre prénom puis votre nom de famille !"
      )
      .setColor("#D22601")
      .setThumbnail(member.user.avatarURL() || gifChicken)
      .setTimestamp();

    let row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Cliquez ici !")
        .setStyle(ButtonStyle.Success)
        .setCustomId(PROPERTIES.LAUNCH_MODAL_NAME)
        .setEmoji("👤")
    );

    return await channel.send({
      embeds: [embedFirstLastName],
      components: [row],
    });
  },

  sendValidationEmbed: async function (channel, member, values) {
    let embed = new EmbedBuilder()
      .setTitle("Merci de vérifier vos informations !")
      .setDescription(
        "Si tout est bon pour vous, cliquez sur le bouton vert pour valider ! S'il y a une erreur, cliquez sur le bouton rouge pour recommencer !"
      )
      .addFields(
        { name: "Prénom : ", value: values[0], inline: true },
        { name: "Nom : ", value: values[1], inline: true },
        { name: "Département : ", value: values[2], inline: true }
      )
      .setColor("#B9FF00")
      .setThumbnail(member.user.avatarURL() || gifChicken);

    // Add the buttons
    let row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(PROPERTIES.VALIDATE_NAME)
        .setLabel("Valider")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(PROPERTIES.REJECT_NAME)
        .setLabel("Recommencer")
        .setStyle(ButtonStyle.Danger)
    );

    return channel.send({ embeds: [embed], components: [row] });
  },
};
