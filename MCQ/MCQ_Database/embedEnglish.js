const Discord = require("discord.js");

const { chickenGif } = require("../../config.js");
/**
 * Instruction Embed for the English Comprenhension MCQ
 * @param {Discord.GuildMember} member
 */
const embedEnglish = (member) => {
  let embed = new Discord.EmbedBuilder()
    .setTitle("Quizz de compréhension en anglais")
    .setColor("#FF00FB")
    .setDescription(
      "🇬🇧 | Passons à la suite. \n\n Répondez aux questions suivantes. Pour ouvrir les vidéos de compréhension sur certaines questions il vous suffit de cliquer sur le lien ressource. \n Ce Quizz n'est pas noté !"
    )
    .setThumbnail(member.avatarURL() || chickenGif)
    .setTimestamp();

  return embed;
};

exports.embedEnglish = embedEnglish;
