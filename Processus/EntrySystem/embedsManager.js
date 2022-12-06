const {
  EmbedBuilder,
  GuildMember,
  TextChannel,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Message,
  InteractionResponse,
} = require("discord.js");
const { mainSecondServerInvite } = require("../../env");
const { whiteLogo, mailLogo, outLogo, kickLogo } = require("../../ressources");
const MAIN_COLOR = "#5e0000";

module.exports = {
  /**
   * Send Welcome Embed
   * @param {GuildMember} member
   * @param {TextChannel} channel
   * @returns {Message}
   */
  async sendWelcomeEmbed(member, channel) {
    const embed = new EmbedBuilder()
      .setColor(MAIN_COLOR)
      .setTimestamp()
      .setTitle(`Bienvenue sur le serveur ${member.user.username} !`)
      .setDescription(
        "Bienvenue sur le serveur du Centre de Langue ! \n\n" +
          '**📇 |  Si vous êtes inscrit à une activité découverte, merci de cliquer sur le bouton vert "Activité Découverte"** \n\n' +
          '🪄 | Sinon, si cela ne vous dit strictement __rien__ merci de simplement cliquer sur le bouton bleu "Entrée Directe" !'
      )
      .setThumbnail(whiteLogo)
      .setAuthor({
        name: "Accéder à la boîte mail en cliquant ici même !",
        iconURL: mailLogo,
        url: "https://outlook.office.com/mail/",
      })
      .setFooter({
        text: member.user.username,
        iconURL: member.user.avatarURL(),
      });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("launch_direct_entry")
        .setLabel("Entrée Directe !")
        .setEmoji("🪄")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("launch_code_collector")
        .setLabel("Activité Découverte")
        .setEmoji("📇")
        .setStyle(ButtonStyle.Success)
    );

    return await channel.send({ embeds: [embed], components: [row] });
  },
  /**
   * Send Invite Server
   * @param {ButtonInteraction} interaction
   * @returns {Promise.<InteractionResponse>}
   */
  async sendInviteServer(interaction) {
    const embed = new EmbedBuilder()
      .setColor(MAIN_COLOR)
      .setDescription(
        "Cliquez sur REJOINDRE pour aller dans le serveur de Découverte du Discord CRIL"
      );
    if (interaction.replied)
      return await interaction.editReply({ embeds: [embed] });

    return await interaction.reply({
      embeds: [embed],
      content: mainSecondServerInvite,
    });
  },
  /**
   * Edit You Know How to use Discord ?
   * @param {Message} msg
   * @returns {Promise.<Message>}
   */
  async editUKnowDiscord(msg) {
    const embed = new EmbedBuilder()
      .setColor(MAIN_COLOR)
      .setTimestamp()
      .setTitle("Savez-vous utiliser Discord et RésaCril ?")
      .setDescription(
        `🟩 | Si **tu sais utiliser Discord et Résacril**, clique sur le bouton vert "Oui" \n - *Pour faire une découverte de Discord avant de commencer ton activité ou ton coaching, considère que cela te prendra au moins 10 min.\n\n` +
          '🟥 | Si **tu ne sais pas utiliser Discord et Résacril**, clique sur le bouton rouge "Non" \n\n' +
          "⚠️ | *Si tu ne sais pas utiliser Discord et que tu cliques tout de même sur Oui, en cas de quelconque problème technique tu seras considéré comme **seul fautif**.*"
      )
      .setThumbnail(whiteLogo)
      .setFooter({
        text: "Le CRIL se résèrve le droit de vous faire passer l'inititation au besoin ! :D",
        iconURL: mailLogo,
      });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("yes")
        .setLabel("Oui")
        .setEmoji("🟩")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("no")
        .setLabel("Non")
        .setEmoji("❌")
        .setStyle(ButtonStyle.Danger)
    );

    return msg.edit({ embeds: [embed], components: [row] });
  },
  /**
   *
   * @param {GuildMember} member
   * @param {String} reason
   */
  async leaveLogEmbed(member, reason) {
    let embed = new EmbedBuilder().setTimestamp().setColor("Blurple").addFields(
      {
        name: "ID de l'utilisateur : ",
        value: member.user.id,
      },
      {
        name: "Compte créé le : ",
        value: member.user.createdAt.toLocaleString(),
      }
    );

    if (reason == "leaved") {
      embed
        .setTitle(`L'utilisateur ${member.user.username} a quitté l'Entry !`)
        .setThumbnail(outLogo);
    } else if (reason == "kicked") {
      embed
        .setTitle(
          `L'utilisateur ${member.user.username} a été kické  de l'Entry !`
        )
        .setThumbnail(kickLogo);
    }

    return embed;
  },
};
