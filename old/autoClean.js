const {
  Client,
  PermissionFlagsBits,
  ChannelType,
  CategoryChannel,
  Guild,
  Message,
} = require("discord.js");

const ENV = require("./env");

const MAIN_SERVER_ID = ENV.mainServerId;
const SECOND_SERVER_ID = ENV.initServerId;
const ETU_ROLE_SECOND_SERVER_ID = ENV.etuRoleSecondId;
const SELF_CHANNEL_CATEGORY_MAIN_ID = ENV.selfChannelCategoryMainId;
const SELF_CHANNEL_CATEGORY_SECOND_ID = ENV.selfChannelCategorySecondId;
const WELCOME_CHANNEL_MAIN_SERVER_ID = "1015236097355300925";

const Journalisation = require("./logs/Journalisation");
const Types = require("./logs/Types");

const Logger = new Journalisation(Types.CLEAN);

const OPTIONS = {
  MainChannels: "mainChannels",
  SecondChannels: "secondChannels",
  SecondMembers: "secondMembers",
  SecondMessages: "secondMessages",
  ALL: "all",
};

module.exports = class AutoClean {
  constructor(client, options = {}) {
    /**
     * @param {Client} client
     * The client of the bot
     */
    this.client = client;
    /**
     * @param {Object} options
     */
    this.options = options;
  }
  /**
   * Returns the options
   * @returns {Object} options
   */
  static getAllOption() {
    return { ALL: true };
  }
  /**
   * Main Runnner
   */
  async run() {
    let all = false;
    if (this.options["ALL"]) all = true;
    // If the option is set to true, clear the main server channels
    if (this.options[OPTIONS.MainChannels] || all) {
      const channelsNames = await this.clearMainServerWelcomeChannels();
      if (channelsNames.length > 0) {
        Logger.addBasicLogs(
          "Les channels suivants ont été supprimés sur le principal serveur  :",
          channelsNames
        );
      }
    }
    // If the option is set to true, clear the second server channels
    if (this.options[OPTIONS.SecondChannels] || all) {
      const channelsNames = await this.clearSecondServerWelcomeChannel();
      if (channelsNames.length > 0) {
        Logger.addBasicLogs(
          "Les channels suivants ont été supprimés sur le second serveur :" +
            " " +
            channelsNames +
            " " +
            "avec succès",
          channelsNames
        );
      }
    }
    // If the option is set to true, clear the second server members
    if (this.options[OPTIONS.SecondMembers] || all) {
      const membersNames = await this.kickSecondServerGarbageMembers();
      Logger.addLog("Les membres restants sur le second serveur ont été kick", {
        username: "AutoClean",
        id: "#0069",
      });
    }
    // If the option is set to true, clear the second server messages
    if (this.options[OPTIONS.SecondMessages] || all) {
      const messages = await this.clearSecondServerMessages();
      Logger.addLog("Les messages détritus ont été supprimés avec succès :", {
        username: "AutoClean",
        id: "#0069",
      });
    }
  }
  /**
   * Clear on the main server the welcome category, keeping only the welcome channel
   * @returns {Promise<String[]>}
   */
  async clearMainServerWelcomeChannels() {
    return new Promise(async (resolve, reject) => {
      /** @type {Guild} */
      const mainServer = this.client.guilds.cache.get(MAIN_SERVER_ID);
      /** @type {CategoryChannel} */
      const welcomeCategory = mainServer.channels.cache.get(
        SELF_CHANNEL_CATEGORY_MAIN_ID
      );
      const welcomeChannel = welcomeCategory.children.cache.find(
        (channel) => channel.id === WELCOME_CHANNEL_MAIN_SERVER_ID
      );
      const channelsToDelete = welcomeCategory.children.cache.filter(
        (channel) => channel.id !== welcomeChannel.id
      );
      const channelsToDeleteNames = channelsToDelete.map(
        (channel) => channel.name
      );
      await Promise.all(
        channelsToDelete.map((channel) => channel.delete("AutoClean"))
      );
      resolve(channelsToDeleteNames);
    });
  }
  /**
   * Clear on the main server the welcome category, keeping only the welcome channel
   * @returns {Promise<String[]>}
   */
  async clearSecondServerWelcomeChannel() {
    return new Promise(async (resolve, reject) => {
      const secondServer = this.client.guilds.cache.get(SECOND_SERVER_ID);
      const welcomeCategory = secondServer.channels.cache.get(
        SELF_CHANNEL_CATEGORY_SECOND_ID
      );
      const channelsToDelete = welcomeCategory.children.cache;
      const channelsToDeleteNames = channelsToDelete.map(
        (channel) => channel.name
      );
      await Promise.all(
        channelsToDelete.map((channel) => channel.delete("AutoClean"))
      );
      resolve(channelsToDeleteNames);
    });
  }
  /**
   * Kick all the members of the second server that are supposed to be timed out
   * @returns {Promise<String[]>}
   */
  async kickSecondServerGarbageMembers() {
    return new Promise(async (resolve, reject) => {
      // If a member has no role or the role etu, kick him
      const secondServer = this.client.guilds.cache.get(SECOND_SERVER_ID);
      const etuRole = secondServer.roles.cache.get(ETU_ROLE_SECOND_SERVER_ID);
      const members = secondServer.members.cache.filter(
        (member) =>
          member.roles.cache.size === 0 || member.roles.cache.has(etuRole.id)
      );
      const membersNames = members.map((member) => member.user.tag);
      await Promise.all(members.map((member) => member.kick("AutoClean")));
      resolve(membersNames);
    });
  }
  /**
   * Delete all the messages of the second server that are not from an admin or a bot
   * @returns {Promise}
   */
  async clearSecondServerMessages() {
    return new Promise(async (resolve, reject) => {
      const secondServer = this.client.guilds.cache.get(SECOND_SERVER_ID);
      const channels = secondServer.channels.cache.filter(
        (channel) => channel.type === ChannelType.GuildText
      );
      await Promise.all(
        channels.map(async (channel) => {
          /** @type {Message[]} */
          const messages = await channel.messages.fetch();
          const messagesToDelete = messages.filter(
            (message) =>
              !message.member ||
              (message.member &&
                !message.member.permissions.has(
                  PermissionFlagsBits.Administrator
                ) &&
                !message.author.bot)
          );
          await Promise.all(
            messagesToDelete.map((message) => message.delete("AutoClean"))
          );
        })
      );
      resolve(0);
    });
  }
};
