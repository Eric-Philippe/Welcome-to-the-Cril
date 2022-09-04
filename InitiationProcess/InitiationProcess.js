/** ============================================================= */
/** ====================== @Module_Import ====================== */
/** =========================================================== */
const Discord = require("discord.js"); // Import the discord.js module
const fs = require("fs"); // Import the fs module

/** ==================== @Class @Import ==================== */
// VocalJoinedDetector collector module
const VocalJoinedDetector = require("../Collectors/VocalJoinedDetector");
const GuildJoinedDetector = require("../Collectors/GuildJoinedDetector");
// Presentation Input Full Module
const InformationInput = require("../InformationInput");
// MCQ System Module
const MCQ = require("../MCQ/MCQ_Class");

/** ======== @ID_Variables_Environement_Import ======== */
const { client } = require("../client"); // Import the client
const {
  mainGuildID,
  mainGuildInvite,
  QCMCatgoryID,
  welcomeChannelSecondGuildID,
  radioChannelID,
  logsChannel,
  mainStudentRole,
  mainFishRole,
  fishGif,
  redLogo,
  secondGuildID,
} = require("../config.js"); // Environement Variable (Channel's/Role's/Guild's/Image's ID)
const Emote_Numbers_Array = [
  "1️⃣",
  "2️⃣",
  "3️⃣",
  "4️⃣",
  "5️⃣",
  "6️⃣",
  "7️⃣",
  "8️⃣",
  "9️⃣",
  "🔟",
]; // Emote Number Array

/** ==================== @EmbedsBuilder ==================== */
// Bigger Embeds are relocated in others files in order to reduce a bit the size of this file
const {
  welcomeMessage,
  vocalMessage,
  mentionMessage,
  emojiMessage,
  embedRadio,
  embedSelf,
  embedNextRadio,
  embedEnd,
} = require("./embedManager");
// Instruction Embed for the MCQ
const { embedResaCRIL } = require("../MCQ/MCQ_Database/embedResaCRIL");
const { embedEnglish } = require("../MCQ/MCQ_Database/embedEnglish");
// Interaction response module
const {
  helpJoinVocal,
  helpMentionChannel,
  helpCanYouHear,
} = require("./interactionManager");

/** ==================== @Database ==================== */
const verifiedUsers = require("../verifiedAccount.json");

/** ============================================================= */
/** ======================== @Main_Class ======================= */
/** =========================================================== */
/**
 * InitiationProcess
 * @module InitiationProcess
 */
/** Class that provide a full system for a user to learn the plateform */
module.exports = class InitiationProcess {
  /**
   * Constructor of the plateform Initiation
   * @param {Discord.GuildMember} member - The member who is doing the initiation
   * @param {Any} - if the user joined with a code or without
   */
  constructor(member, code = null) {
    /** @type {Discord.GuildMember} Participant of the initiation */
    this.member = member;
    /** @type {String} If the user came with a code */
    this.code = code;
    /** @type {Number} timeLimit is allowing 10min of inactivity for codeUser and 2h for basicUser */
    this.timeLimit = code ? 10 * 60 * 1000 : 2 * 60 * 60 * 1000;
    /** @type {String} User ID */
    this.userID = member.user.id;
    /** @type {Discord.Guild} Guild where the initiation is occuring */
    this.guild = member.guild;
    /** @type {Discord.Channel} Keep track of the channel where the user has to go */
    this.targetChannel = null;
    /** @type {Array.<Discord.Message>} Keep in memory all the message to keep clean the server after the process */
    this.messages = [];
    /** @type {Array.<Discord.Collector>} Keep in memory all the collector to shut off them when necessary */
    this.collectors = [];
    /** @type {Discord.Message} Keep track of the current message we're working with */
    this.msg = null;
    /** @type {Number} Step track */
    this.step = 0;
    /** @type {Boolean} */
    this.normalLeave = false;
  }
  /**
   * Main Asynchronous Process for all the steps
   * @return {Promise}
   */
  async process() {
    this.guildLeavedDetector();
    // ===================================================
    /** ########### @STEP_1 - @Welcome_User ########### */
    // ==================================================
    // Load the welcome channel to welcome the new user
    const WelcomeChannel = this.guild.channels.cache.get(
      welcomeChannelSecondGuildID
    );
    // Send a first mention to notify the user and store the new message
    WelcomeChannel.send(`||<@${this.userID}>||`).then((m) => {
      this.messages.push(m);
    });
    // Send the first instructions and store the message inside the process memory
    this.messages.push(await welcomeMessage(this.member, WelcomeChannel));
    this.msg = this.messages[this.messages.length - 1];
    this.nextStep();

    // =================================================
    /** ########### @STEP_2 - @Join_Vocal ########### */
    // ================================================
    // Pick a random voice channel to make the user join
    this.targetChannel = await this.pickRandomChannel(2);
    // Edit the first embed with the new instructions
    await this.editEmbed(await vocalMessage(this.member, this.targetChannel));
    // Put a help button collector calling itself when it's clicked
    this.buttonCollector(this.msg, true);
    // Wait for the user to join the voice channel
    await this.vcJoindedCollector();
    this.nextStep();

    // ==========================================================
    /** ############ @STEP_3 - @Click_on_reaction ############ */
    // =========================================================
    // Edit the embed with the new instructions
    await this.editEmbed(await mentionMessage(this.member, this.targetChannel));
    // Put a help button collector calling itself when it's clicked
    this.buttonCollector(this.msg, true);
    // Pick three emotes to display in the embed
    const emotesPicked = Emote_Numbers_Array.sort(
      () => 0.5 - Math.random()
    ).slice(0, 3);
    // Pick randomly one of the three picked emote to be clicked by the user
    const targetEmote = emotesPicked[Math.floor(Math.random() * 3)];
    // Send an embed inside the targeted channel with the new instructions
    this.msg = await emojiMessage(
      emotesPicked,
      targetEmote,
      this.targetChannel,
      this.member
    );
    this.messages.push(this.msg);
    // Wait for the user to click on the right emote
    let emokiClicked = await this.reactionCollector(this.msg, emotesPicked);
    // Loop until the user click on the right emote
    while (emokiClicked !== targetEmote) {
      emokiClicked = await this.reactionCollector(this.msg, emotesPicked);
    }
    this.nextStep();

    // ===========================================================
    /** ########### @STEP_4 - @Radio / @Voice_Check ########### */
    // ==========================================================
    // Send the new instruction to the user
    this.messages.push(
      await embedNextRadio(radioChannelID, this.targetChannel)
    );
    // Change the channel target to the radio channel
    this.targetChannel = await client.channels.cache.get(radioChannelID);
    // Mention the user to help him find the channel
    await this.targetChannel.send(`||<@${this.userID}>||`).then((m) => {
      this.messages.push(m);
    });
    // Wait for the user to join the radio channel
    await this.vcJoindedCollector();
    // Send the new instruction to the user to knnow if he can hear the radio
    this.msg = await embedRadio(this.userID, this.targetChannel);
    await this.messages.push(this.msg);
    // Put a help button collector calling itself when it's clicked containing a .pdf with help
    this.buttonCollector(this.msg, true);
    await this.buttonCollector(this.msg);
    // Put a Yes button collector not recurrent confirming the user can hear the radio
    this.nextStep();

    // =======================================================
    /** ############ @STEP_5 - @Self_Presentation ######### */
    // ======================================================
    // Change the channel target to the self channel
    let oldChannel = this.targetChannel; // Keep the current channel in memory to get a new one
    this.targetChannel = await this.createSelfChannel(); // New Temporary Channel for the end of the system
    this.messages.push(
      await embedSelf(this.targetChannel.id, this.userID, oldChannel)
    );
    // Preload the InformationInput Class with the valid member
    const II = new InformationInput(
      this.targetChannel,
      this.member,
      this.timeLimit
    );
    // Launch the main process of the self presentation system
    const infos = await II.process().catch((err) => {
      if (err === "TIME") this.clearProcess("TIME");
    });
    if (!infos) return;

    // ====================================================
    /** ############ @STEP_6 - @ResaCRIL_QCM ########### */
    // ===================================================
    // Load a new MCQ
    let QCM = new MCQ(this.member, this.targetChannel, this.timeLimit);
    QCM.selectQuestionsDatabase(0); // Setup the ResaCril MCQ Database
    QCM.setInstructions(embedResaCRIL(this.member)); // Set the instructions embed
    let balise = await QCM.start().catch((e) => {}); // Launch the whole process
    if (!balise) return this.clearProcess("TIME");
    // If the user has not a code, it's the end of the system
    if (!this.code) {
      // =============================================
      /** ############ @STEP_7A - @END ########### */
      // ===========================================
      this.endProcess(infos); // Clean and close everything
    } else {
      // =============================================
      /** ###### @STEP_7B - @English_Lesson ###### */
      // ===========================================
      // Load a new MCQ
      let EnglishQCM = new MCQ(
        this.member,
        this.targetChannel,
        this.timeLimit,
        true
      );
      EnglishQCM.selectQuestionsDatabase(1);
      EnglishQCM.setInstructions(embedEnglish(this.member));
      this.timeElapsed = await EnglishQCM.start().catch((e) => {});
      if (!this.timeElapsed) return this.clearProcess("TIME");
      await this.endProcess(infos);
    }
  }
  /**
   * Natural end of the process
   * @param {Array.<String>} informations - [Name, Surname, Department]
   */
  async endProcess(informations) {
    // Put the user inside the activityFinished JSON array
    // Will Allow the Entry system to stay idle until the user is back
    verifiedUsers.activityFinished.push(this.userID);
    verifiedUsers.bypassEntry.push(this.userID);
    // Update the database
    await fs.writeFileSync(
      "verifiedAccount.json",
      JSON.stringify(verifiedUsers)
    ),
      await embedEnd(this.targetChannel);
    // Wait for the user to join the main Guild
    let newMember = await this.guildJoinedDetector();
    // Add the roles to the new member
    await newMember.roles.add(mainStudentRole);
    await newMember.roles.add(mainFishRole);
    // Setup the nickname with the informations from the Input System
    await newMember.setNickname(informations.join(" "));
    // Delete the Self Channel
    this.targetChannel.delete();
    // Delete the user from the db
    verifiedUsers.bypassEntry.splice(
      verifiedUsers.bypassEntry.indexOf(this.userID),
      1
    );
    if (this.code) {
      verifiedUsers.verifiedAccount.splice(
        verifiedUsers.verifiedAccount.indexOf(this.userID),
        1
      );
    }
    await fs.writeFileSync(
      "verifiedAccount.json",
      JSON.stringify(verifiedUsers)
    ),
      // Clean everything
      this.clearProcess();
  }
  /**
   * Main resolver when recursived interaction are received
   * @param {Discord.Interaction} i
   */
  async resolveInteraction(i) {
    // This will provied an help PDF for each help call with the button clicked
    switch (this.step) {
      case 1:
        helpJoinVocal(i);
        break;
      case 2:
        helpMentionChannel(i);
        break;
      case 3:
        // Two buttons are under the embed in this step
        // Only one has to be recursive
        if (i.customId === "help_radio") {
          helpCanYouHear(i);
        }
        break;
    }
  }
  /** ####################################################### */
  /** #################### @COLLECTORS ##################### */
  /** @Button_Message_Reaction_VoiceChannel_Guild_Collector */
  /** #################################################### */
  /**
   * Basic Button Collector
   * @param {Discord.Message} msg The message to listen to
   * @param {Boolean} reccurent if the button can be clicked multiple times
   * @returns {Promise.<String>}
   */
  async buttonCollector(msg, reccurent) {
    // Promise based Collector
    return new Promise((resolve, reject) => {
      // Classic Button Collector
      const collector = msg.createMessageComponentCollector({
        componentType: Discord.ComponentType.Button,
        time: this.timeLimit,
        max: 1,
      });
      // Push the collector inside the memory of the Bot
      this.collectors.push(collector);
      // Launch the collector
      collector.on("collect", async (i) => {
        if (i.member.id === this.userID) {
          if (!reccurent) {
            if (i.customId === "help_radio") return;
            // CLear away the interaction update
            i.deferUpdate();
            // Resolve the promise with the interaction
            resolve(i);
          } else {
            if (this.step === 3 && i.customId != "help_radio") return;
            // Recursive buttons
            this.resolveInteraction(i);
          }
        } else {
          // For the curious one
          await i.reply({
            content: "Ce bouton ne te concerne pas.",
            ephemeral: true,
          });
        }
      });
      /** End the Collector */
      collector.on("end", (collected, reason) => {
        if (reason === "time" && !reccurent) {
          this.clearProcess("TIME");
        }
      });
    });
  }
  /**
   * Basic Reaction Collector
   * @param {Discord.Message} msg
   * @param {String[]} pickedEmotes Array of emotes allowed to be clicked
   * @returns {Promise.<String>}
   */
  reactionCollector(msg, pickedEmotes) {
    // promise based collector
    return new Promise((resolve, reject) => {
      // Filter Setup
      const filter = (reaction, user) => {
        return (
          user.id === this.userID && pickedEmotes.includes(reaction.emoji.name)
        );
      };
      // Create the Collector Object
      const collector = msg.createReactionCollector({
        filter,
        time: this.timeLimit,
        max: 1,
      });
      // Push the collector inside the memory of the Bot
      this.collectors.push(collector);
      // Launch the collector
      collector.on("collect", async (reaction, user) => {
        await reaction.users.remove(this.userID);
        resolve(reaction.emoji.name);
      });
      // When the collector is finished
      collector.on("end", (collected, reason) => {
        this.collectors.splice(this.collectors.indexOf(collector), 1);
        if (reason === "time") {
          this.clearProcess("TIME");
        }
      });
    });
  }
  /**
   * Guild Leaved Detector
   */
  guildLeavedDetector() {
    client.once("guildMemberRemove", (member) => {
      if (
        member.id === this.userID &&
        !this.normalLeave &&
        member.guild.id === secondGuildID
      ) {
        this.clearProcess("LEAVE");
      } else {
        this.guildLeavedDetector();
      }
    });
  }
  /**
   * Handmade voicechat joined detector
   * @returns {Promise.<Discord.GuildMember>}
   */
  async vcJoindedCollector() {
    // Promise based Collector
    return new Promise((resolve) => {
      // Setup the collector object
      const collector = new VocalJoinedDetector(
        this.member,
        this.targetChannel,
        this.timeLimit
      );
      // Push the collector inside the memory of the Bot
      this.collectors.push(collector);
      // Launch the collector
      collector.on("collect", async (member) => {
        resolve(member);
      });
      // When the collector is finished
      collector.on("end", (reason) => {
        if (reason === "time") {
          this.clearProcess("TIME");
        }
      });
    });
  }
  /**
   * Handmade guild joined detector
   * @returns {Promise.<Discord.GuildMember>}
   */
  async guildJoinedDetector() {
    // Promise based Collector
    return new Promise(async (resolve) => {
      // Setup the collector object
      const collector = new GuildJoinedDetector(
        this.member.user,
        mainGuildID,
        this.timeLimit
      );
      // Push the collector inside the memory of the Bot
      this.collectors.push(collector);
      this.normalLeave = true;
      // Launch the collector
      collector.on("collect", (member) => {
        this.normalLeave = false;
        resolve(member);
      });
      // When the collector is finished
      collector.on("end", (reason) => {
        if (reason === "time") {
          this.clearProcess("TIME");
        }
      });
    });
  }
  /** ################################################ */
  /** #################### @TOOLS ################### */
  /** ############################################## */
  /**
   * Pick a random channel given a type
   * @param {Number} typeFilter
   * @returns {Discord.Channel} Channel Picked
   */
  async pickRandomChannel(typeFilter) {
    let channels = this.guild.channels.cache.filter((channel) => {
      // Check if the user has the permission to see the channel and send messages
      // And if the channel is not the radio channel
      return (
        channel.type === typeFilter &&
        channel
          .permissionsFor(this.member)
          .has(Discord.PermissionsBitField.Flags.ViewChannel) &&
        channel
          .permissionsFor(this.member)
          .has(Discord.PermissionsBitField.Flags.SendMessages) &&
        channel.id !== radioChannelID
      );
    });
    // Pick one amoung the filtered channels
    let randomChannel = await channels.random();
    return randomChannel;
  }
  /**
   * Create a channel with the name of the user
   * @returns {Promise.<Discord.TextBasedChannel>}
   */
  async createSelfChannel() {
    return new Promise((resolve, reject) => {
      // Creation of the channel
      this.guild.channels
        .create({
          name: `${this.member.user.username}`,
          type: Discord.ChannelType.GuildText,
        })
        .then((channel) => {
          // Set the channel's category
          channel.setParent(QCMCatgoryID).then(async (c) => {
            // Edit the permissions
            // @everyone not allowed to read
            await c.permissionOverwrites.create(this.guild.roles.everyone, {
              ViewChannel: false,
            });
            // @User can read and send messages
            await c.permissionOverwrites.create(this.member.id, {
              ViewChannel: true,
              SendMessages: true,
            });
            resolve(c);
          });
        })
        // Error Handler
        .catch((e) => {
          reject(e);
        });
    });
  }
  /**
   * Edit the main message class with a given messages components [Embed, Row, Content]
   * @param {Array.<Discord.Embed | Discord.Component>} embedElementArray
   * @returns
   */
  async editEmbed(embedElementArray) {
    return new Promise((resolve, reject) => {
      if (!this.msg) reject("No message found");
      // Edit the main message
      this.msg
        .edit({
          embeds: [embedElementArray[0]],
          components: [embedElementArray[1]],
        })
        .then((m) => {
          resolve(m);
        });
    });
  }
  /**
   * Function that do all the things needed to push the next step
   */
  nextStep() {
    this.step++; // Increment the step
    this.clearCollectors(); // Clear all the past collectors
  }
  /** ################################################ */
  /** #################### @CLEAR ################### */
  /** ############################################## */
  /**
   * Clear all the collectors in the memory of the bot
   */
  clearCollectors() {
    // Stop all the collectors
    this.collectors.forEach((collector) => {
      collector.stop();
    });
    // Empty the collectors array
    this.collectors = [];
  }
  /**
   * Clear all the messages of the process
   */
  cleanMessages() {
    // Delete all the messages
    this.messages.forEach((m) => {
      if (m) m.delete();
    });
    // Empty the messages array
    this.messages = [];
  }
  /**
   * Clear the process
   * @param {String} reason
   */
  async clearProcess(reason) {
    await this.cleanMessages(); // Clean all the messages
    await this.clearCollectors(); // Clear all the collectors
    // Load the defaults values for the Logs Embed
    let embed = new Discord.EmbedBuilder()
      .setColor("Orange")
      .setTimestamp()
      .addFields(
        {
          name: "Utilisateur en question : ",
          value: this.member.user.username,
          inline: true,
        },
        {
          name: "Utilisateur avec code : ",
          value: this.code ? "Oui" : "Non",
          inline: true,
        }
      );
    // If the user leaved the process because of a time limit
    if (reason === "TIME") {
      embed
        .setTitle("Un utilisateur s'est fait time out")
        .setDescription(
          "L'utilisateur est resté inactif pendant trop longtemps."
        )
        .setThumbnail(fishGif);

      let embedKick = new Discord.EmbedBuilder()
        .setTitle("Vous avez été kick pour inactivité !")
        .setColor("#FF0000")
        .setTimestamp()
        .setDescription(
          "Vous avez été kick pour inactivité ! \n Revenez sur le serveur pour réessayer !"
        );
      this.member.user
        .send({
          content: "Lien vers le serveur : " + mainGuildInvite,
          embeds: [embedKick],
        })
        .catch((e) => {
          console.warn("Can't send msg to user");
        });
    } else {
      embed
        .setTitle("Terminé !")
        .setDescription("L'utilisateur a fini correctement le processus !")
        .setThumbnail(redLogo);
      if (this.code && this.timeElapsed)
        embed.addFields({
          name: "Temps passé sur la compréhension : ",
          value: this.timeElapsed,
          inline: true,
        });
    }
    // Get the logs channel and send the embed
    await client.channels.cache.get(logsChannel).send({ embeds: [embed] });
    // Kick the user from the guild
    this.normalLeave = true;
    await this.member.kick();
  }
};
