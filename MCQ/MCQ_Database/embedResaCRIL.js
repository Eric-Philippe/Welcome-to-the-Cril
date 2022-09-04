const Discord = require("discord.js");

const { chickenGif } = require("../../config.js");
/**
 * Basic Embed Instruction for the ResaCRIL MCQs
 * @param {Discord.GuildMember} member
 */
const embedResaCRIL = (member) => {
  let embed = new Discord.EmbedBuilder()
    .setTitle("Initiation à RésaCril")
    .setColor("#00BFFF")
    .setDescription(
      "La suite de ton initiation va se poursuivre avec un QCM sur RésaCRIL ! N'hésite pas à bien regarder les documents fournis lors de chaque question !"
    )
    .setThumbnail(member.avatarURL() || chickenGif)
    .setTimestamp();

  return embed;
};

exports.embedResaCRIL = embedResaCRIL;
