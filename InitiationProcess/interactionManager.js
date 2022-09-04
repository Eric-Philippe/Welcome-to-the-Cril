const Discord = require("discord.js");
module.exports = {
  /**
   * Send the help message to explain how to join a vocals
   * @param {Discord.Interaction} i
   */
  helpJoinVocal: async (i) => {
    let content = `Afin de rejoindre un vocal, il vous suffit d'afficher la liste des channels (Téléphone : Slide vers la droite), puis de cliquer sur le channel vocal (channel contenant l'icône 🔈) correspondant à celui demandé en faisant bien attention à la catégorie également en question ! Il ne vous restera qu'à appuyer sur le bouton "Rejoindre le Vocal" !`;
    try {
      await i.reply({
        content: content,
        ephemeral: true,
      });
    } catch (err) {
      i.editReply({
        content: content,
        ephemeral: true,
      });
    }
  },
  /**
   * Send the help message to explain how to see a mention inside a channel
   * @param {Discord.Interaction} i
   */
  helpMentionChannel: async (i) => {
    let content = "Suivez-le tutoriel afin de vous guider  : ";
    try {
      await i.reply({
        content: content,
        files: ["./assets/Helper/Support-Salon-Textuel-Vocaux"],
        ephemeral: true,
      });
    } catch (err) {
      i.editReply({
        content: content,
        ephemeral: true,
      });
    }
  },
  /**
   * Send the help message to fix the issue with voicechat
   * @param {Discord.Interaction} i
   */
  helpCanYouHear: async (i) => {
    let content =
      "Merci de vous référer à la documentation pour plus d'informations jusqu'à trouver solution à votre problème !";
    let file = "./assets/Helper/Support_Vocal.pdf";
    try {
      await i.reply({
        content: content,
        files: [file],
        ephemeral: true,
      });
    } catch (err) {
      i.editReply({
        content: content,
        ephemeral: true,
      });
    }
  },
};
