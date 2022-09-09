const Discord = require("discord.js"); // Discord API

const MAIN_COLOR = "#048B9A"; // Setup the Main Color of the embeds
const { whiteLogo, mailLogo } = require("../config"); // Miscellaneous

module.exports = {
  /**
   * Send a welcome message with the first instructions
   * @param {Discord.GuildMember} member
   * @param {Discord.GuildTextBasedChannel} channel
   */
  sendWelcomeMessage: (channel, member) => {
    return new Promise((resolve) => {
      let embed = new Discord.EmbedBuilder()
        .setColor(MAIN_COLOR)
        .setTimestamp()
        .setTitle("Bienvenue sur le serveur !")
        .setDescription(
          "Bienvenue sur le serveur du centre de Langue ! \n" +
            "**Faites-vous partie d'une activité initiation ? ** \n\n" +
            "📇 | Si **OUI**, merci d'entrer le code reçu dans votre boite mail étudiante par l'adresse __cril.langues@iut-tlse3.fr__ ! \n\n" +
            '🪄 | Sinon, si cela ne te dit strictement __rien__ merci de simplement cliquer sur le bouton vert "Entrer sur le serveur" !'
        )
        .setThumbnail(whiteLogo)
        .setAuthor({
          name: "Accéder à la boite mail en cliquant ici !",
          iconURL: mailLogo,
          url: "https://outlook.office.com/mail/",
        })
        .setFooter({
          text: member.user.username,
          iconURL: member.user.avatarURL(),
        });

      let row = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
          .setCustomId("launch_process")
          .setLabel("Je n'ai pas de code !")
          .setEmoji("🪄")
          .setStyle(Discord.ButtonStyle.Primary),
        new Discord.ButtonBuilder()
          .setCustomId("ive_a_code")
          .setLabel("J'ai un code !")
          .setEmoji("📇")
          .setStyle(Discord.ButtonStyle.Success)
      );

      channel
        .send({
          content: `||<@${member.id}>||`,
          embeds: [embed],
          components: [row],
        })
        .then((m) => {
          resolve(m);
        });
    });
  },
  /**
   * Edit a given message with a new embed
   * @param {Discord.Message} msg
   * @returns {Promise<Discord.Message>}
   */
  editUKnowDiscord: (msg) => {
    return new Promise((resolve) => {
      let embed = new Discord.EmbedBuilder()
        .setColor(MAIN_COLOR)
        .setTimestamp()
        .setTitle("Sais-tu utiliser Discord et RésaCril ?")
        .setDescription(
          `🟩 | Si **tu sais utiliser Discord et Résacril**, clique sur le bouton vert "Oui" \n\n` +
            '🟥 | Si **tu ne sais pas utiliser Discord et Résacril**, clique sur le bouton rouge "Non" \n\n' +
            "⚠️ | *Si tu ne sais pas utiliser Discord et que tu cliques tout de même sur Oui, en cas de quelconque problème technique tu seras considéré comme **seul fautif**.*"
        )
        .setThumbnail(whiteLogo)
        .setFooter({
          text: "Le CRIL se résèrve le droit de vous faire passer l'inititation au besoin ! :D",
          iconURL: mailLogo,
        });
      // Row Builder
      let row = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
          .setCustomId("yes")
          .setLabel("Oui")
          .setEmoji("✅")
          .setStyle(Discord.ButtonStyle.Success),

        new Discord.ButtonBuilder()
          .setCustomId("no")
          .setLabel("Non")
          .setEmoji("❌")
          .setStyle(Discord.ButtonStyle.Secondary)
      );
      // Edit the message
      msg.edit({ embeds: [embed], components: [row] }).then((m) => {
        resolve(m);
      });
    });
  },
};
