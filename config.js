const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  /** CONFIG */
  token: process.env.TOKEN,
  clientID: process.env.CLIENT_ID,

  /** IMG */
  whiteLogo: process.env.WHITE_LOGO_URL,
  redLogo: process.env.RED_LOGO_URL,
  mailLogo: process.env.MAIL_LOGO_URL,
  alertGif: process.env.ALERT_GIF,
  chickenGif: process.env.CHICKEN_GIF,
  listenGif: process.env.LISTEN_GIF,
  fishGif: process.env.FISH_GIF,

  /** INVITE */
  mainGuildInvite: process.env.PERMANENT_INVITE_MAIN,
  secondGuildInvite: process.env.PERMANENT_INVITE_SECOND,
  mainGuildInviteTwo: process.env.PERMANENT_INVITE_MAIN_TWO,

  /** GUILD_ID */
  mainGuildID: process.env.MAIN_GUILD_ID,
  secondGuildID: process.env.SECOND_GUILD_ID,

  /** MAIN_CHANNELS_ID */
  entryCategory: process.env.ENTRY_CATEGORY_ID,
  logsChannel: process.env.LOGS_CHANNEL_ID,

  /** SECOND_CHANNELS_ID */
  radioChannelID: process.env.SECOND_RADIO_CHANNEL_ID,
  welcomeChannelSecondGuildID: process.env.SECOND_WELCOME_CHANNEL_ID,
  QCMCatgoryID: process.env.SECOND_QCM_CATEGORY_ID,

  /** MAIN_ROLES_ID */
  discordProRoleID: process.env.MAIN_DISCORD_PRO_ROLE_ID,
  mainStudentRole: process.env.MAIN_STUDENT_ROLE_ID,
  mainFishRole: process.env.MAIN_FISH_ROLE_ID,

  /** SECOND_ROLES_ID */
  codedUserRoleID: process.env.SECOND_GUILD_CODED_USER_ROLE_ID,
  secondGuildStudentRole: process.env.SECOND_GUILD_STUDENT_ROLE_ID,
};
