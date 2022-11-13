const { EmbedBuilder, VoiceChannel, GuildMember } = require("discord.js");

module.exports = class EmbedsManager {
  constructor(color) {
    this.colorName = color.name;
    this.color = color.color;
  }

  welcomeEmbed() {
    let embed = new EmbedBuilder()
      .setColor(this.color)
      .setTitle("BIENVENUE !")
      .setDescription(
        "Bienvenue dans l’activité Découverte du Discord du CRIL. Ceci est bien l’activité Découverte. Il ne s’agit pas d’une discussion avec une tutrice. Vous devrez suivre les étapes du parcours balisé pour découvrir Discord. \n**Lisez bien toutes les instructions**. \n\nCliquez sur suivant pour continuer"
      );
    return embed;
  }

  canalVocalEmbed() {
    let embed = new EmbedBuilder()
      .setColor(this.color)
      .setTitle("ELEMENTS DE DISCORD - Canal Vocal")
      .setAuthor({
        name: "Pensez à cliquer sur l'image pour l'agrandir !",
      })
      .setImage(
        "https://media.discordapp.net/attachments/910200998339944479/1032326729282359397/voc.png?width=1255&height=661"
      )
      .setDescription(
        "Ceci ``🟥encadré rouge`` est un canal vocal, avec symbole haut-parleur devant son nom. \nLorsque vous venez pour une activité interaction, il faudra rejoindre le canal vocal __dont le titre correspond à votre réservation.__ \n➜ Par exemple, *discussion libre niveau débutant en anglais*. \n➜ Chaque canal vocal a un canal texte qui lui correspond, vous devrez dire **bonjour par écrit** pour signaler votre présence ``🟦encadré bleu``. \n➜ Il y a de nombreux canaux vocaux dans le discord du CRIL, repérez-vous en lisant leur titre !"
      );
    return embed;
  }

  canalTextuelEmbed() {
    let embed = new EmbedBuilder()
      .setColor(this.color)
      .setTitle("ELEMENTS DE DISCORD - Canal Textuel")
      .setAuthor({
        name: "Pensez à cliquer sur l'image pour l'agrandir !",
      })
      .setImage(
        "https://media.discordapp.net/attachments/910200998339944479/1032326700190670988/texte.png"
      )
      .setDescription(
        "Ceci ``🟥encadré rouge`` est un canal / chat texte, avec **#** devant son nom. \n➜ Pour envoyer votre message, utilisez la zone en bas ``🟦encadré bleu``. \n➜ Vous pourrez voir dans le serveur du CRIL différents canaux texte pour les coaching, les annonces, demander de l’aide… **lisez leurs titres pour savoir de quoi il s’agit**"
      );
    return embed;
  }

  mentionEmbed() {
    let embed = new EmbedBuilder()
      .setColor(this.color)
      .setTitle("ELEMENTS DE DISCORD - Mention | Couleur")
      .setAuthor({
        name: "Pensez à cliquer sur l'image pour l'agrandir !",
      })
      .setImage(
        "https://media.discordapp.net/attachments/910200998339944479/1032326750320988191/mention.png?width=1056&height=661"
      )
      .setDescription(
        "Ceci est une mention en ``🔴 | entouré rouge dans l'image``. \n➜ Cela signifie qu’un message vous est adressé dans un des canaux texte (🔴 | rouge, dans l’exemple : Victoria Ackerman). \n➜ Si vous voyez une mention avec votre nom, prenez connaissance du message. Si vous voyez un message qui mentionne le nom de quelqu’un d’autre, il est adressé à __**quelqu’un d’autre que vous**__. ***N’en tenez pas compte***. \n\n" +
          `**➜ Pendant l’activité Découverte**, les messages qui vous sont adressés vous mentionneront et auront un encadré ${this.colorName}. Ne suivez que les instructions des messages dans lesquels vous êtes mentionné ET portant la couleur ${this.colorName}.`
      );
    return embed;
  }

  reReadEmbed() {
    let embed = new EmbedBuilder()
      .setColor(this.color)
      .setTitle("PASSONS A LA SUITE !")
      .setDescription(
        "Vous allez maintenant suivre un parcours sur Discord par étapes pour vous faire utiliser ce que nous venons de vous montrer, suivi de QCM. \n➜ Nous vous rappelons qu’il est **essentiel** **__de bien lire les messages qui vous sont adressés et suivre les instructions__**. \n➜ Des aides sont disponibles en cliquant sur les boutons selon ce dont vous avez besoin. \n➜ __Revenez toujours dans ce channel si vous êtes perdu__ \n\nSi vous souhaitez relire les descriptions des éléments Discord, vous pouvez naviguer dans les pages avec précédent et suivant. \n\n**Quand vous êtes prêt, cliquez sur le bouton Passer à la suite.**"
      );
    return embed;
  }

  bookEmbed() {
    return [
      this.welcomeEmbed(),
      this.canalVocalEmbed(),
      this.canalTextuelEmbed(),
      this.mentionEmbed(),
      this.reReadEmbed(),
    ];
  }
  /**
   *
   * @param {VoiceChannel} channel
   * @returns
   */
  joinVoiceChannel(channel) {
    let embed = new EmbedBuilder()
      .setColor(this.color)
      .setDescription(
        `Merci de rejoindre le canal vocal suivant : <#${channel.id}> dans la catégorie` +
          "``" +
          channel.parent.name.replace("/─/g", "") +
          "`` ! \n Une fois cela fait, rejoignez le canal textuel correspondant à ce canal vocal et suivez les instructions du message qui vous mentionne !"
      );
    return embed;
  }

  captchaEmbed(emote) {
    let embed = new EmbedBuilder()
      .setColor(this.color)
      .setDescription(
        "Merci de cliquer sur l'emoji suivant pour passer à la suite : "
      )
      .addFields({
        name: "Emoji à cliquer ci-dessous du message : ",
        value: emote,
      });
    return embed;
  }
  /**
   *
   * @param {GuildMember} member
   * @returns
   */
  radioEmbed(member) {
    let embed = new EmbedBuilder()
      .setColor(this.color)
      .setTitle("🔊 | Test de son ! ")
      .setDescription(
        "Merci de rejoindre le canal vocal nommé 🔊 radio dans la catégorie ``🪙 JUST CHATTING`` sur votre gauche ! - Vous allez ensuite être mentionné, trouvez la mention et rejoignez le channel textuel du dit vocal pour continuer !"
      );
    return embed;
  }
  /**
   *
   * @param {GuildMember} member
   * @returns
   */
  canYouHearMe(member) {
    let embed = new EmbedBuilder()
      .setColor(this.color)
      .setTitle("Radio - Can you hear me ?")
      .setDescription(
        `🔊 | ${member.nickname}, pouvez-vous entendre la musique ? \n🔇 | Si oui, cliquez sur le bouton Oui en vert, dans le cas contraire, cliquez sur le bouton Help en rouge.`
      );
    return embed;
  }

  timeOutEmbed() {
    let embed = new EmbedBuilder()
      .setColor(this.color)
      .setTitle("Activité Initiation !")
      .setDescription(
        "Vous avez mis trop de temps à répondre ou bien un problème est survenu ; recommencez depuis le début !"
      );
    return embed;
  }
  /**
   *
   * @param {Boolean} areYouCode
   * @returns
   */
  endEmbed(areYouCode) {
    let embed = new EmbedBuilder()
      .setColor(this.color)
      .setTitle("C'est presque terminé !");
    if (areYouCode) {
      embed.setDescription(
        "C’est presque terminé ! L’équipe consultera votre parcours Découverte et si tout est bon, votre activité sera validée sous trois jours. La toute dernière étape : rejoindre le serveur principal et explorer ! Lors de votre prochaine activité ou coaching à distance, connectez vous à votre compte discord et vous trouverez le serveur CRIL dans la liste de vos serveurs – plus besoin de lien. \n\nCliquez sur REJOINDRE pour conclure l’activité"
      );
    } else {
      embed.setDescription(
        "C’est presque terminé ! La toute dernière étape : rejoindre le serveur principal et explorer/trouver le canal de l’activité que vous avez réservée ! Lors de votre prochaine activité ou coaching à distance, connectez-vous à votre compte discord et vous trouverez le serveur CRIL dans la liste de vos serveurs – plus besoin de lien. \n\nCliquez sur REJOINDRE."
      );
    }
    return embed;
  }
  /**
   * End DM User
   */
  endDMEmbed() {
    let embed = new EmbedBuilder()
      .setColor(this.color)
      .setTitle("C'est presque terminé !")
      .setDescription(
        "Bravo! Vous avez terminé l'Activité Découverte et rejoint le serveur du Centre de Langues. Vous avez maintenant accès à tous les channels pour faire vos activités et coaching en ligne. \nRéférez-vous au channel Support pour toute question. "
      );
    return embed;
  }
};
