const Discord = require("discord.js"); // Import the discord.js module

const { listenGif, whiteLogo, mainGuildInviteTwo } = require("../config.js"); // Import the miscellaneous stuff we need

module.exports = {
  /**
   * Send a welcome message to the user
   * @param {Discord.GuildMember} member
   * @param {Discord.Channel} channel
   * @returns {Promise.<Discord.Message>}
   */
  welcomeMessage: function (member, channel) {
    return new Promise((resolve) => {
      let txt = `<@${member.user.id}> ! \n Bienvenue sur le serveur. Ce serveur va te permettre de pouvoir appréhender les bases de Discord ainsi que du centre de Langue ! Clique sur le bouton vert afin de lancer le processus !`;
      //Create an embed
      let embed = new Discord.EmbedBuilder()
        .setColor("#0099ff")
        .setTitle("🚥 Bienvenue sur le serveur ! 🚥")
        .setDescription(txt)
        .setTimestamp()
        .setThumbnail(member.user.avatarURL());

      // Create a button
      let row = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
          .setCustomId("launch_process")
          .setLabel("Lancer le processus")
          .setStyle(Discord.ButtonStyle.Success)
      );
      // Send all the components created above
      channel.send({ embeds: [embed], components: [row] }).then((m) => {
        resolve(m);
      });
    });
  },
  /**
   * Send a message to ask the user to join the given Vocal
   * @param {Discord.GuildMember} member
   * @param {Discord.Channel} channel
   * @returns {Promise.<Object.<Discord.Message, Discord.ActionRowBuilder>>}
   */
  vocalMessage: function (member, channel) {
    let txt =
      `Merci de rejoindre la canal vocal suivant : <#${channel.id}> dans la catégorie` +
      "``" +
      channel.parent.name.replace("/─/g", "") +
      "`` ! \n Une fois cela fait, n'hésite pas à revenir sur ce message pour avoir de l'aide si tu as besoin !";
    //Create an embed
    let embed = new Discord.EmbedBuilder()
      .setColor("#0099ff")
      .setTitle(`Activité initiation ${member.user.username} - Vocal`)
      .setDescription(txt);
    // Thumbnail with an icon of a speaker

    let row = new Discord.ActionRowBuilder().addComponents(
      new Discord.ButtonBuilder()
        .setCustomId("help")
        .setLabel("Au secours :(")
        .setStyle(Discord.ButtonStyle.Primary)
    );

    return [embed, row];
  },
  /**
   * Send a message to notify the user that he get mentionned
   * @param {Discord.GuildMember} member
   * @param {Discord.Channel} channel
   * @return {Object(Discord.Embed, Discord.Component)}
   */
  mentionMessage: function (member, channel) {
    return new Promise((resolve) => {
      let txt = `🔴 | Vous venez de vous faire mentionner dans le canal vocal suivant : <#${channel.id}> \n merci de vous y rendre et de suivre les instructions sur le prochain message !`;
      //Create an embed
      let embed = new Discord.EmbedBuilder()
        .setColor("#ff0000")
        .setTitle(`Activité initiation ${member.user.username} - Vocal`)
        .setDescription(txt);

      let row = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
          .setCustomId("help_mention")
          .setLabel("Aled D':")
          .setStyle(Discord.ButtonStyle.Primary)
      );

      resolve([embed, row]);
    });
  },
  /**
   * Send a message to ask the user to click on a given emote
   * @param {Array.<String>} pickedEmotes
   * @param {String} targetEmote
   * @param {Discord.Channel} channel
   * @param {Discord.GuildMember} member
   * @returns {Promise.<Discord.Message>}
   */
  emojiMessage: async function (pickedEmotes, targetEmote, channel, member) {
    return new Promise((resolve) => {
      let txt = `Merci de cliquer sur l'emoji suivant pour passer à la suite.`;
      let embed = new Discord.EmbedBuilder()
        .setTitle(`Initiation réactions`)
        .setColor("#00ff00")
        .addFields({
          name: "Emoji à cliquer ci-dessous du message : ",
          value: targetEmote,
        })
        .setDescription(txt);

      channel
        .send({
          content: `||<@${member.user.id}>||`,
          embeds: [embed],
        })
        .then(async (m) => {
          await m.react(pickedEmotes[0]);
          await m.react(pickedEmotes[1]);
          await m.react(pickedEmotes[2]);
          resolve(m);
        });
    });
  },
  /**
   * Send a message to ask the user if he can hear the sound inside the voice channel
   * @param {String} userID
   * @param {Discord.Channel} channel
   * @returns {Promise.<Discord.Message>}
   */
  embedRadio(userID, channel) {
    return new Promise((resolve) => {
      let embed = new Discord.EmbedBuilder()
        .setColor("#00ff00")
        .setTitle('Radio -"Can you hear me ?" | ')
        .setDescription(
          "🔊 | Pouvez-vous entendre la musique en fond ? \n 🔇 | Si oui, cliquez sur le bouton Oui en vert, dans le cas contraire, cliquez sur le bouton Help en rouge."
        )
        .setThumbnail(listenGif);
      let row = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
          .setCustomId("can_hear")
          .setLabel("Oui !")
          .setStyle(Discord.ButtonStyle.Success),
        new Discord.ButtonBuilder()
          .setCustomId("help_radio")
          .setLabel("Heeeeeelp")
          .setStyle(Discord.ButtonStyle.Danger)
      );

      channel
        .send({
          content: `Hey Listen !`,
          embeds: [embed],
          components: [row],
        })
        .then((m) => {
          resolve(m);
        });
    });
  },
  /**
   * Send a message to ask the user to join the radio channel
   * @param {String} radioChannelID
   * @param {Discord.VoiceBasedChannel} channel
   * @returns {Promise.<Discord.Message>}
   */
  embedNextRadio: (radioChannelID, channel) => {
    return new Promise((resolve) => {
      let embed = new Discord.EmbedBuilder()
        .setColor("#00ff00")
        .setTitle("Prochaine étape !")
        .setDescription(
          `📻 | Merci de rejoindre le channel vocal suivant : <#${radioChannelID}>, vous venez d'y être mentionné, Accédez au canal textuel de ce dernier afin de passer à la suite !`
        );
      channel.send({ embeds: [embed] }).then((m) => {
        resolve(m);
      });
    });
  },
  /**
   * Send a message to ask the user to join the self channel
   * @param {String} channelId
   * @param {String} userID
   * @param {Discord.TextBasedChannel} channel
   * @returns {Promise.<Discord.Message>}
   */
  embedSelf: (channelId, userID, channel) => {
    return new Promise((resolve) => {
      let embed = new Discord.EmbedBuilder()
        .setColor("#00ff00")
        .setTitle("It's Presentation Time !")
        .setDescription(
          `❓ | Merci de rejoindre le channel <#${channelId}> et lire les consignes suivantes pour boucler ton initiation !`
        );

      channel
        .send({ embeds: [embed], content: `||<@${userID}>||` })
        .then((m) => {
          resolve(m);
        });
    });
  },
  /**
   *
   * @param {*} channel
   */
  embedEnd: async (channel) => {
    let embed = new Discord.EmbedBuilder()
      .setTitle("🎉 Félicitation vous avez terminé l'initiation ! 🎉")
      .setColor("#ff8c00")
      .setDescription(
        "📥 | Il ne vous reste plus qu'à rejoindre le serveur pour clôturer l'activité ! \n Merci de votre participation !"
      )
      .setThumbnail(whiteLogo);

    await channel.send({ embeds: [embed] });
    await channel.send(mainGuildInviteTwo);
  },
};
