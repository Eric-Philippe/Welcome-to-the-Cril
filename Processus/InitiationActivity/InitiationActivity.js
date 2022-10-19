const { GuildMember, Guild } = require("discord.js");
const {
  createSelfChannel,
  randomColor,
  pickChannelForMember,
} = require("../../utils/utils");
const {
  selfChannelCategorySecondId,
  radioChannelId,
  mainServerId,
  codeUserRoleId,
  etuRoleSecondId,
  etuRole,
  firstServerInvite,
  cleanFirstServerInvite,
  fishRoleId,
} = require("../../env");
const EmbedsManager = require("./ressources_manager/EmbedsManager");
const {
  afterBook,
  canyouHearMeButtons,
  helpJoinVocal,
} = require("./ressources_manager/ButtonsManager");
const InformationsInput = require("../InformationsInput/InformationsInput");
const { ACTIVITY, NON_ACTIVITY } = require("../../TimeEnum").TIME;
const BookEmbed = require("../../BookEmbeds/BookEmbed");
const {
  ButtonsCollector,
  FILTERS_BUTTON,
  VoiceJoinedCollectorWrapper,
  ReactionsCollector,
  ButtonsRecursiveCollector,
  GuildLeavedCollectorWrapper,
  GuildJoinedCollectorWrapper,
} = require("../../events/CollectorManager");
const MessagesBuffer = require("../../MessagesBuffer");
const { EMOTES_NUMBERS } = require("../../ressources");
const { REACTIONS } = require("../../events/Filters");
const MCQ = require("../MCQ/MCQ_Class");
const { embedResaCRIL } = require("../MCQ/MCQ_Database/embedResaCRIL");
const { embedEnglish } = require("../MCQ/MCQ_Database/embedEnglish");
const { client } = require("../../client");
const { logEnd, logEvent } = require("./logs");
const Journalisation = require("../../logs/Journalisation");
const { EVENTS } = require("../../logs/Types");
const {
  helpJoinVoiceChat,
  helpJoinTextChat,
  helpSoundsProblem,
} = require("./ressources_manager/InteractionsManager");
const { addFinishedUser, removePendingUser } = require("../../database/main");

module.exports = class InitiationsActivity {
  /**
   *
   * @param {GuildMember} member
   * @param {Boolean} areYouACode
   */
  constructor(member, areYouACode) {
    /**
     * The member we're working with
     * @type {GuildMember}
     */
    this.member = member;
    /**
     * The guild we're working with
     * @type {Guild}
     */
    this.guild = member.guild;
    /**
     * The channel we're working with
     * @type {TextChannel}
     */
    this.channel = null;
    /**
     * The Color that the member will have
     * { color: String, name: String }
     * @type {{<String, String>}}
     */
    this.color = randomColor();
    /**
     * Embeds Manager
     */
    this.embeds = new EmbedsManager(this.color);
    /**
     * @type {Number}
     */
    this.time = areYouACode ? ACTIVITY : NON_ACTIVITY;
    /**
     * @type {Number}
     * Time Elapsed in the activity in sec
     */
    this.timeElapsed = 0;
    this.areYouACode = areYouACode;
    this.mBuffer = new MessagesBuffer();
    this.Logger = new Journalisation(EVENTS);
    this.MainProcess();
  }

  async *main() {
    try {
      this.channel = await createSelfChannel(
        this.member,
        this.guild,
        selfChannelCategorySecondId
      );
      if (this.areYouACode) {
        let role = this.guild.roles.cache.get(codeUserRoleId);
        this.member.roles.add(role);
      }
      this.timer();
      yield "CHANNEL_CREATED";

      this.myInfos = await InformationsInput(
        this.channel,
        this.member,
        this.time
      );
      this.member.setNickname(this.myInfos.join(" "));
      yield "INFORMATIONS_INPUT";

      let myBook = new BookEmbed(this.channel, this.member, this.time);
      await myBook.loadPages(this.embeds.bookEmbed());
      myBook.setLanguage("fr");
      myBook.setColor(this.color.color);
      await myBook.awaitBookToBeRead();
      yield "BOOK_READ";

      let msg = await myBook
        .getMessage()
        .edit({ components: [myBook.getMessage().components[0], afterBook()] });
      await ButtonsCollector(
        msg,
        FILTERS_BUTTON.This_Button_And_This_User("afterBook", this.member.user),
        this.time
      );
      let role = await this.guild.roles.cache.get(etuRoleSecondId);
      await this.member.roles.add(role);
      yield "START_JOURNEY";

      let targetChannel = await pickChannelForMember(this.guild, role);
      msg = await this.channel.send({
        embeds: [await this.embeds.joinVoiceChannel(targetChannel)],
        components: helpJoinVocal(),
      });

      ButtonsRecursiveCollector(
        msg,
        FILTERS_BUTTON.This_Button("help_vocal"),
        null,
        this.member.user,
        helpJoinVoiceChat
      );

      ButtonsRecursiveCollector(
        msg,
        FILTERS_BUTTON.This_Button("help_text"),
        null,
        this.member.user,
        helpJoinTextChat
      ).catch((e) => {});

      targetChannel.send({
        content: `<@${this.member.user.id}>`,
      });

      await VoiceJoinedCollectorWrapper(
        this.member,
        targetChannel.id,
        this.time
      );
      yield "VOICE_JOINED";

      // Get three different random numbers between 0 and 9
      let numbers = [];
      while (numbers.length < 3) {
        let random = Math.floor(Math.random() * 10);
        if (!numbers.includes(EMOTES_NUMBERS[random])) {
          numbers.push(EMOTES_NUMBERS[random]);
        }
      }
      // Pick a random number between 0 and 2
      let pickedNumber = numbers[Math.floor(Math.random() * 3)];
      this.mBuffer.add(
        await targetChannel.send({
          embeds: [this.embeds.captchaEmbed(pickedNumber)],
        })
      );
      await this.mBuffer.last().react(numbers[0]);
      await this.mBuffer.last().react(numbers[1]);
      await this.mBuffer.last().react(numbers[2]);

      await ReactionsCollector(
        this.mBuffer.last(),
        REACTIONS.This_User_This_Reaction(pickedNumber, this.member.user),
        this.time
      );
      yield "CAPTCHA_DONE";

      await targetChannel.send({
        embeds: [await this.embeds.radioEmbed(this.member)],
        content: `<@${this.member.user.id}>`,
      });
      targetChannel = await this.guild.channels.cache.get(radioChannelId);
      await VoiceJoinedCollectorWrapper(
        this.member,
        targetChannel.id,
        this.time
      );
      yield "VOICE_JOINED_RADIO";

      await this.mBuffer.add(
        await targetChannel.send({
          embeds: [await this.embeds.canYouHearMe(this.member)],
          components: [canyouHearMeButtons()],
          content: `<@${this.member.user.id}>`,
        })
      );

      ButtonsRecursiveCollector(
        this.mBuffer.last(),
        FILTERS_BUTTON.This_Button("no"),
        null,
        this.member.user,
        helpSoundsProblem
      ).catch((e) => {});

      await ButtonsRecursiveCollector(
        this.mBuffer.last(),
        FILTERS_BUTTON.This_Button("yes"),
        this.time,
        this.member.user
      );

      await this.mBuffer.add(
        await targetChannel.send({
          content: `${this.member.nickname}, merci de rejoindre ton channel à ton nom en bas à gauche !`,
        })
      );
      yield "CAN_HEAR_RADIO";

      let myMCQ = new MCQ(this.member, this.channel, this.time);
      await myMCQ.setInstructions(embedResaCRIL(this.member));
      await myMCQ.selectQuestionsDatabase(0);
      await myMCQ.start();
      yield "MCQ_RESACRIL_DONE";

      if (this.areYouACode) {
        let englishMCQ = new MCQ(this.member, this.channel, this.time, true);
        await englishMCQ.setInstructions(embedEnglish(this.member));
        await englishMCQ.selectQuestionsDatabase(1);
        this.resultsMCQ = await englishMCQ.start();
        yield "MCQ_ENGLISH_DONE";
      }

      await this.channel.send({
        embeds: [await this.embeds.endEmbed()],
        content: cleanFirstServerInvite,
      });

      client.bypassEntry.push(this.member.user.id);

      let newMember = await GuildJoinedCollectorWrapper(
        this.member,
        mainServerId,
        this.time
      );

      role = await newMember.guild.roles.cache.get(etuRole);
      await newMember.roles.add(role);
      role = await newMember.guild.roles.cache.get(fishRoleId);
      await newMember.roles.add(role);
      await newMember.setNickname(this.myInfos.join(" "));
      await addFinishedUser(newMember.user.id);

      // Remove the user from the bypassEntry array
      client.bypassEntry.splice(
        client.bypassEntry.indexOf(this.member.user.id),
        1
      );

      this.reason = "clean_exit";
      yield "ACTIVITY_FINISHED";
    } catch (err) {
      console.log("Erreur !");
      console.log(err);
      if (err.message === "time") {
        this.reason = "time";
      }
    } finally {
      this.done = true;
      logEvent(this.reason, this.member);
      this.cleanProcess();
    }
  }

  async MainProcess() {
    this.launchLeaveCollector(); // Launch the leave collector
    this.process = this.main();
    while (!this.done) {
      let res = await this.process.next();
      if (res.value) this.Logger.addLog(res.value, this.member.user);
    }
  }

  timer() {
    this.intervalId = setInterval(() => {
      this.timeElapsed += 1;
    }, 1_000);
  }

  async launchLeaveCollector() {
    try {
      const reason = await GuildLeavedCollectorWrapper(
        this.member,
        this.guild.id
      );
      if (reason == "stopped") return;
      this.reason = reason;
      this.done = true;
      this.cleanProcess();
    } catch (error) {
      console.error(error);
    }
  }

  cleanProcess() {
    if (!this.cleaned) {
      this.cleaned = true;
      logEnd(this.reason, this);
      try {
        if (this.reason === "time" || this.reason === "kicked") {
          if (this.member.user.dmChannel) {
            this.member.user.dmChannel.send({
              embeds: [this.embeds.timeOutEmbed()],
              content: firstServerInvite,
            });
          }
        }
        if (this.intervalId) clearInterval(this.intervalId);
        if (this.channel.deletable) this.channel.delete();
        if (this.member.kickable) this.member.kick(this.reason);
        this.mBuffer.clear();
      } catch (e) {
        console.log(e);
      }
    }
  }
};
