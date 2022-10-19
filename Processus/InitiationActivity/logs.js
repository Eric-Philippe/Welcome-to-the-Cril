const { EmbedBuilder, GuildMember } = require("discord.js");
const { client } = require("../../client");
const { logChannelId } = require("../../env");
const { secondsToReadableTime } = require("../../utils/utils");
const InitiationsActivity = require("./InitiationActivity");
const Journalisation = require("../../logs/Journalisation");
const { EVENTS } = require("../../logs/Types");
const { checkLogo, kickLogo, outLogo } = require("../../ressources");
/**
 *
 * @param {String} reason
 * @param {InitiationsActivity} activity
 */
const logEnd = (reason, activity) => {
  let username = activity.myInfos
    ? activity.myInfos.join(" ")
    : activity.member.user.username;
  let embed = new EmbedBuilder().setTimestamp();

  switch (true) {
    case reason == "clean_exit":
      embed
        .setThumbnail(checkLogo)
        .addFields(
          {
            name: "Utilisateur à code : ",
            value: activity.areYouACode ? "Oui" : "Non",
          },
          {
            name: "Temps total passé sur l'activité : ",
            value: secondsToReadableTime(activity.timeElapsed),
          },
          {
            name: "ID de l'utilisateur : ",
            value: activity.member.user.id,
          }
        )
        .setTitle(
          `L'utilisateur ${username} a correctement terminé l'activité !`
        );
      if (activity.areYouACode) {
        let timeSpentTxt = activity.resultsMCQ[0].split(" ");
        // Make 6 min 30 sec becomes 6,5
        let timeSpent = Number(timeSpentTxt[0]) + Number(timeSpentTxt[2]) / 60;
        let ratio = activity.resultsMCQ[1] / timeSpent;
        embed.addFields(
          {
            name: "Nombre d'erreurs English QCM : ",
            value: `${activity.resultsMCQ[1]}`,
            inline: true,
          },
          {
            name: "Temps passé sur le QCM : ",
            value: activity.resultsMCQ[0],
          },
          // activity.resultsMCQ[0] = "6 min 35 sec"
          {
            name: "Ratio temps passé sur nombre erreurs : ",
            value: `${ratio.toFixed(2)} erreurs/min`,
          }
        );
        if (ratio < 0.5) {
          embed.setColor("Green");
        } else if (ratio < 1) {
          embed.setColor("Yellow");
        } else {
          embed.setColor("Red");
        }
      } else {
        embed.setColor("DarkGreen");
      }
      break;
    case reason == "kicked":
      embed
        .setThumbnail(kickLogo)
        .addFields(
          {
            name: "Utilisateur à code : ",
            value: activity.areYouACode ? "Oui" : "Non",
          },
          {
            name: "ID de l'utilisateur : ",
            value: activity.member.user.id,
          }
        )
        .setTitle(`L'utilisateur ${username} a été kick !`)
        .setColor("DarkOrange");
      break;
    case reason == "leaved":
      embed
        .setThumbnail(outLogo)
        .addFields(
          {
            name: "Utilisateur à code : ",
            value: activity.areYouACode ? "Oui" : "Non",
          },
          {
            name: "ID de l'utilisateur : ",
            value: activity.member.user.id,
          }
        )
        .setTitle(
          `L'utilisateur ${username} a quitté l'activité en cours de route !`
        )
        .setColor("DarkGold");
      break;
    case reason == "time":
      embed
        .addFields(
          {
            name: "Utilisateur à code : ",
            value: activity.areYouACode ? "Oui" : "Non",
          },
          {
            name: "ID de l'utilisateur : ",
            value: activity.member.user.id,
          }
        )
        .setTitle(`L'utilisateur ${username} s'est fait timeout !`)
        .setColor("DarkNavy");
      break;
    default:
      embed
        .setColor("DarkButNotBlack")
        .setTitle("Processus arrêté de force !")
        .setDescription(
          "Un processus s'est coupé sans raison apparente, merci de le signaler !"
        );
  }

  let logChannel = client.channels.cache.find((c) => c.id === logChannelId);
  if (!logChannel) return;
  logChannel.send({ embeds: [embed] });
};
/**
 * @param {String} reason
 * @param {GuildMember} member
 */
logEvent = (reason, member) => {
  let Logger = new Journalisation(EVENTS);
  switch (true) {
    case reason == "clean_exit":
      Logger.addLog(
        `L'utilisateur ${member.user.username} a correctement terminé l'activité !`,
        member.user
      );
      break;
    case reason == "kicked":
      Logger.addLog(
        `L'utilisateur ${member.user.username} a été kick de l'activité !`,
        member.user
      );
      break;
    case reason == "leaved":
      Logger.addLog(
        `L'utilisateur ${member.user.username} a quitté l'activité en cours de route !`,
        member.user
      );
      break;
    case reason == "time":
      Logger.addLog(
        `L'utilisateur ${member.user.username} s'est fait timeout de l'activité !`,
        member.user
      );
      break;
    default:
      Logger.addLog(
        `Un processus s'est coupé sans raison apparente !`,
        member.user
      );
  }
};

exports.logEnd = logEnd;
exports.logEvent = logEvent;
