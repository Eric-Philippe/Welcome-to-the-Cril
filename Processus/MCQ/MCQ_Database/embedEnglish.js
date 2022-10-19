const Discord = require("discord.js");

const { gifChicken } = require("../../../ressources");
/**
 * Instruction Embed for the English Comprenhension MCQ
 * @param {Discord.GuildMember} member
 */
const embedEnglish = (member) => {
  let embed = new Discord.EmbedBuilder()
    .setTitle("Quizz de compréhension en anglais")
    .setColor("#FF0000")
    .setDescription(
      "🇬🇧 | Voici la dernière partie de l’activité découverte. Ce QCM en anglais n’est pas noté, mais si vous ne le faites pas avec soin, votre activité ne sera pas validée, par exemple si vous cliquez au hasard sur les réponses sans regarder les images ou vidéos proposées. \n\nCliquez sur Lancer le QCM quand vous êtes prêt"
    )
    .setThumbnail(member.avatarURL() || gifChicken)
    .setTimestamp();

  return embed;
};

exports.embedEnglish = embedEnglish;
