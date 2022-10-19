const {
  GuildMember,
  Guild,
  TextChannel,
  Interaction,
  ButtonInteraction,
} = require("discord.js");
/** ##################################################################### */
/** ##################### @Discord_Objects_Manager ##################### */
/** ################################################################### */
const Embeds = require("./embedsManager"); // Embeds
const { createCodeModal } = require("./modalsManager"); // Modals
/** ##################################################################### */
/** ############################ @Ressources ########################### */
/** ################################################################### */
const { createSelfChannel, pingId } = require("../../utils/utils"); // Utils
const {
  selfChannelCategoryMainId,
  initServerId,
  etuRole,
  discordProRole,
  logChannelId,
} = require("../../env"); // Env variables
const { TIME } = require("../../TimeEnum"); // Time enum
const CodesEntry = require("../../database/Codes.json").Codes; // Entry codes
const FinishedUsers =
  require("../../database/ActivitiesUsers.json").FinishedUser; // Finished users db
/** ##################################################################### */
/** ############################ @Collectors ########################### */
/** ################################################################### */
const {
  FILTERS, // Universal filters for collectors
  ButtonsCollector,
  GuildJoinedCollectorWrapper, // GuildJoinedCollector
  GuildLeavedCollectorWrapper, // GuildLeavedCollector
} = require("../../events/CollectorManager");
/** ##################################################################### */
/** ########################### @Dependencies ########################## */
/** ################################################################### */
const MessagesBuffer = require("../../MessagesBuffer"); // MessagesBuffer
const InformationsInput = require("../InformationsInput/InformationsInput"); // InformationsInput
const { addPendingUser } = require("../../database/main");
/**
 * @class
 * @classdesc EntrySystem class
 * @depends {MessagesBuffer}
 */
module.exports = class EntrySystem {
  /**
   * @constructor
   * Create a new EntrySystem
   * @param {GuildMember} member
   * @param {Guild} guild
   */
  constructor(member, guild) {
    /**
     * @type {GuildMember}
     * System member
     */
    this.member = member;
    /**
     * @type {Guild}
     * System guild
     */
    this.guild = guild;
    /**
     * @type {TextChannel}
     * Main Self Channel of the system
     */
    this.channel = null;
    /**
     * @type {MessagesBuffer}
     * Messages Buffer
     */
    this.messagesBuffer = new MessagesBuffer(); // Create a new MessagesBuffer
    this.launchLeaveCollector(); // Launch the leave collector
    this.__init__(); // Init the system
  }
  /**
   * - Create the self Channel for the new user
   * - Initiate the new MessagesBuffer
   * - Launch the activity buttons collector
   */
  async __init__() {
    if (!this.channel) await this.createChannelProcess();
    this.msgToEdit = await Embeds.sendWelcomeEmbed(this.member, this.channel);
    this.__activityButtonsCollector__();
  }
  /**
   * - Create a new button collector
   * - Redirect the user to the next steps or sending the activty secret code
   */
  async __activityButtonsCollector__() {
    // Launch a button Collector on the last message sent only for the user with the two buttons of the embed for the TIME.ENTRY Value
    let collector = this.msgToEdit.createMessageComponentCollector({
      filter: FILTERS.BUTTONS.Those_Buttons_And_This_User(
        ["launch_direct_entry", "launch_code_collector"],
        this.member.user
      ),
      time: TIME.ENTRY,
    });

    collector.on("collect", async (i) => {
      /** ######################################## */
      /** If the Launch Code Collector is clicked */
      /** ###################################### */
      if (
        i.customId === "launch_code_collector" &&
        !FinishedUsers.includes(this.member.id)
      ) {
        // Modal Display
        await i.showModal(await createCodeModal());
        let submitted = await i
          .awaitModalSubmit({
            time: TIME.ENTRY,
            filter: (i) => i.user.id === this.member.user.id,
          })
          .catch((reason) => {
            this.clearSystem(reason);
          });

        // Modal Receiver
        let code = submitted.fields.getTextInputValue("code");
        let txt;
        if (code.includes("#")) {
          if (CodesEntry.includes(code)) {
            addPendingUser(this.member.user.id);
            return this.__sendServerInvite__(submitted);
          } else {
            txt =
              "Code erroné ! Merci d'entrer un code valide du format suivant : #CODEAB";
          }
        } else {
          txt = "Merci d'entrer un code démarrant par un # !";
        }
        return submitted.reply({ content: txt }).catch((err) => {});

        /** ###################################### */
        // If the Direct Entry Button is clicked
        /** ###################################### */
      } else if (
        i.customId === "launch_direct_entry" ||
        FinishedUsers.includes(this.member.id)
      ) {
        i.deferUpdate();
        this.__directEntry__(i);
      }
    });

    collector.on("end", (collected) => {
      if (collected.size === 0) {
        this.clearSystem("time");
      }
    });
  }
  /**
   * - Send the server invite to the user
   * - Launch the server join collector
   * - Clear the system
   * @param {Interaction} i
   */
  async __sendServerInvite__(i) {
    await Embeds.sendInviteServer(i);
    await GuildJoinedCollectorWrapper(
      this.member,
      initServerId,
      TIME.ENTRY
    ).catch((reason) => {
      return this.clearSystem(reason);
    });
    this.clearSystem("end_activity_launched");
  }
  /**
   * - Ask the user if he knows how to use Discord
   * - Launch the collector
   * - If the user knows launch __endEntry__()
   * - If the user doesn't know launch __sendServerInvite__()
   * @param {ButtonInteraction} i
   */
  async __directEntry__(i) {
    let m = await Embeds.editUKnowDiscord(i.message);
    let answer = await ButtonsCollector(
      m,
      FILTERS.BUTTONS.Those_Buttons_And_This_User(
        ["yes", "no"],
        this.member.user
      ),
      TIME.ENTRY
    ).catch((reason) => {
      this.clearSystem(reason);
    });

    if (answer.customId === "yes") {
      answer.deferUpdate();
      this.__endEntry__();
    } else {
      this.__sendServerInvite__(answer);
    }
  }
  /**
   * - Launch a new InformationsInput System and wait for the end
   * - Add the differents roles to the user
   * - Rename the user with the given informations
   * - Clear System
   */
  async __endEntry__() {
    const myInfos = await InformationsInput(
      this.channel,
      this.member,
      TIME.ENTRY
    ).catch((reason) => {
      this.clearSystem(reason);
    });

    this.member.roles.add([etuRole, discordProRole]);
    this.member.setNickname(myInfos.join(" "));
    this.clearSystem("end_pro");
  }
  /**
   * Create a new SelfChannel and send a mention inside it
   * @returns {Number}
   */
  async createChannelProcess() {
    this.channel = await createSelfChannel(
      this.member,
      this.guild,
      selfChannelCategoryMainId
    );
    await pingId(this.channel, this.member.id);
    return 0;
  }
  /**
   * Parallel Leave Collector that'll destroy the system if the user leaves
   */
  async launchLeaveCollector() {
    try {
      const reason = await GuildLeavedCollectorWrapper(
        this.member,
        this.guild.id
      );
      if (reason == "stopped") return;
      if (!this.cleaned) {
        let logChannel = this.guild.channels.cache.get(logChannelId);
        logChannel.send({
          embeds: [await Embeds.leaveLogEmbed(this.member, reason)],
        });
        this.clearSystem(reason);
      }
    } catch (error) {
      console.error(error);
    }
  }
  /**
   * Cleaner of the System, singleton scheme
   * @param {String} reason
   */
  clearSystem(reason) {
    if (this.cleaned) return;
    this.cleaned = true;
    if (reason == "end_activity_launched")
      this.member.kick("Activité Initiation Starting");
    if (reason == "time") this.member.kick("TimeOut");
    try {
      if (this.channel) this.channel.delete();
      this.messagesBuffer.clear();
    } catch (error) {}
  }
};
