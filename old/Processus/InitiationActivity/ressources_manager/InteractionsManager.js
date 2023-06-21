const { ButtonInteraction } = require("discord.js");

module.exports = {
  /**
   * @param {ButtonInteraction} interaction
   */
  helpJoinVoiceChat: async (interaction) => {
    await interaction.reply({
      content: `Afin de rejoindre un vocal, il vous suffit d'afficher la liste des channels (Téléphone : Slide vers la droite), puis de cliquer sur le channel vocal (channel contenant l'icône 🔈) correspondant à celui demandé en faisant bien attention à la catégorie également en question ! Il ne vous restera qu'à appuyer sur le bouton "Rejoindre le Vocal" !`,
      ephemeral: true,
    });
  },
  helpJoinTextChat: async (interaction) => {
    await interaction.reply({
      content: "Suivez-le tutoriel afin de vous guider  : ",
      files: ["./doc/Support-Salon-Textuel-Vocaux.pdf"],
      ephemeral: true,
    });
  },
  helpSoundsProblem: async (interaction) => {
    await interaction.reply({
      content:
        "Merci de vous référer à la documentation pour plus d'informations jusqu'à trouver solution à votre problème !",
      files: ["./doc/Support_Vocal.pdf"],
      ephemeral: true,
    });
  },
};
