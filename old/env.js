const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  /** CONFIG */
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,

  mainServerId: process.env.MAIN_SERVER_ID,
  initServerId: process.env.INIT_SERVER_ID,

  etuRole: process.env.ETU_ROLE_ID,
  discordProRole: process.env.DISCORD_PRO_ROLE_ID,
  fishRoleId: process.env.FISH_ROLE_ID,
  etuRoleSecondId: process.env.ETU_ROLE_SECOND_ID,
  codeUserRoleId: process.env.CODE_USER_ROLE_ID,

  selfChannelCategoryMainId: process.env.SELF_CHANNEL_CATEGORY_MAIN_ID,
  selfChannelCategorySecondId: process.env.SELF_CHANNEL_CATEGORY_SECOND_ID,

  radioChannelId: process.env.RADIO_CHANNEL_ID,
  logChannelId: process.env.LOG_CHANNEL_ID,

  mainSecondServerInvite: process.env.SECOND_SERVER_INVITE,
  firstServerInvite: process.env.FIRST_SERVER_INVITE,
  cleanFirstServerInvite: process.env.CLEAN_FIRST_SERVER_INVITE,
};
