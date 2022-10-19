const Discord = require("discord.js");

const { gifChicken } = require("../../../ressources");
/**
 * Basic Embed Instruction for the ResaCRIL MCQs
 * @param {Discord.GuildMember} member
 */
const embedResaCRIL = (member) => {
  let embed = new Discord.EmbedBuilder()
    .setTitle("Initiation à RésaCril")
    .setColor("#00BFFF")
    .setDescription(
      "La suite de votre découverte va se poursuivre avec un QCM sur RésaCRIL ! N'hésitez pas à bien regarder les documents fournis lors de chaque question !"
    )
    .setThumbnail(member.avatarURL() || gifChicken)
    .setTimestamp();

  return embed;
};

exports.embedResaCRIL = embedResaCRIL;
