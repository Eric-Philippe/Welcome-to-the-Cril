// Main IMPORTS
const Discord = require("discord.js"); // DiscordJS
const fs = require("fs"); // File-System

const COLLECTOR_TIME = 20 * 60 * 1000; // How much time user have before getting kicked for inactivitys

const InformationInput = require("../InformationInput"); // InformationInput class
const GuildJoinedDetector = require("../Collectors/GuildJoinedDetector"); // GuildJoinedDetector class

const { sendWelcomeMessage, editUKnowDiscord } = require("./embedManager.js"); // Embeds decentralized

const verifiedUsers = require("../verifiedAccount.json"); // BDD
const Codes = require("../codesEntry.json").CODES; // Codes
// ID and link that we need
const {
  mainStudentRole,
  discordProRoleID,
  entryCategory,
  secondGuildInvite,
  secondGuildID,
  mainGuildInvite,
} = require("../config");
const { client } = require("../client");
/**
 * @class EntrySystem
 * Provide a system to enter the server
 */
module.exports = class EntrySystem {
  /**
   * @param {Discord.GuildMember} member
   */
  constructor(member) {
    /** @type {Discord.GuildMember} */
    this.member = member;
    /** @type {Discord.Guild} */
    this.guild = member.guild;
    /** @type {String} */
    this.userID = member.id;
    /** @type {Discord.GuildChannel} */
    this.channel = null;
    /** @type {Discord.Message} */
    this.msg = null;
    /** @type {Discord.Collector[]} */
    this.collectors = [];
    this.codeUser = true;
    this.normalLeave = false;
    this.mainProcess();
  }
  /**
   * Main process of the EntrySystem
   */
  async mainProcess() {
    this.guildLeavedDetector();
    // Create a self channel for the new member
    this.channel = await this.createChannel();
    if (!this.channel) throw new Error("Channel not created");
    // Setup a new message asking for a code
    this.msg = await sendWelcomeMessage(this.channel, this.member);
    // If the user send a code or skip the step
    let value;
    do {
      value = await Promise.race([
        this.messageCodeCollector(this.channel),
        this.buttonCollector(this.msg),
      ]);

      this.clearCollectors();
    } while (!value || value.customId == "ive_a_code");
    // If a valid code is entered
    if (
      value === "good_code" &&
      !verifiedUsers.activityFinished.includes(this.userID)
    ) {
      await this.channel.send(
        `Merci de rejoindre ce serveur pour participer à l'initiation ! \n ${secondGuildInvite} \n Il te suffit de cliquer sur le bouton "Rejoindre" !`
      );
      await this.addToCodeDatabase(); // Add the user to the DB
      await this.guildJoinedDetector(); // Wait the user to join the second guild
      this.cleanProcess();
      // Basic Entry
    } else {
      this.codeUser = false;
      // Send the embed asking the user if he knows the basics of discord
      this.msg = await editUKnowDiscord(this.msg);
      let buttonCollected = await this.buttonCollector(this.msg);
      // If Yes
      if (buttonCollected.customId === "yes") {
        // Put him trough the Information Input Process
        let II = new InformationInput(
          this.channel,
          this.member,
          COLLECTOR_TIME
        );
        let informations = await II.process().catch((err) => {
          this.cleanProcess("TIME");
        });
        // Add the different roles
        this.member.roles.add(mainStudentRole);
        this.member.roles.add(discordProRoleID);
        // Set a clean Nickname
        this.member.setNickname(informations.join(" "));
        // Clear the self channel
        this.channel.delete();
      } else {
        await this.channel.send(
          `Merci de rejoindre ce serveur pour participer à l'initiation ! \n ${secondGuildInvite} \n Il te suffit de cliquer sur le bouton "Rejoindre" !`
        );
        await this.guildJoinedDetector();
        this.cleanProcess();
      }
    }
  }
  /**
   * Create a Self Channel at the name of the user
   * @returns {Promise<Discord.TextBasedChannel>}
   */
  createChannel() {
    return new Promise((resolve, reject) => {
      // Creation of the channel
      this.guild.channels
        .create({
          name: this.usernameInLinkedName(),
          type: Discord.ChannelType.GuildText,
        })
        .then((channel) => {
          // Set category
          channel.setParent(entryCategory).then((channel) => {
            // Permission update
            channel.permissionOverwrites.create(this.guild.roles.everyone, {
              ViewChannel: false,
            });
            channel.permissionOverwrites.create(this.userID, {
              ViewChannel: true,
              SendMessages: true,
            });
            resolve(channel);
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  /** ############## @COLLECTORS ############### */
  /**
   * Guild Joined Detector
   * @returns {Promise<Discord.GuildMember>}
   */
  async guildJoinedDetector() {
    return new Promise(async (resolve) => {
      const collector = new GuildJoinedDetector(
        this.member.user,
        secondGuildID,
        COLLECTOR_TIME
      );

      this.collectors.push(collector);
      this.normalLeave = true;

      collector.on("collect", (member) => {
        this.normalLeave = false;
        resolve(member);
      });

      collector.on("end", (reason) => {
        if (reason === "time") {
          this.cleanProcess("TIME");
        }
      });
    });
  }
  /**
   * Guild Leaved Detector
   */
  guildLeavedDetector() {
    client.once("guildMemberRemove", (member) => {
      if (member.id === this.userID && !this.normalLeave) {
        this.cleanProcess("LEAVE");
      } else {
        this.guildLeavedDetector();
      }
    });
  }
  /**
   * Basic Button Collector
   * @param {Discord.Message} msg
   * @return {Discord.Interaction}
   */
  buttonCollector(msg) {
    return new Promise(async (resolve) => {
      const collector = msg.createMessageComponentCollector({
        componentType: Discord.ComponentType.Button,
        time: COLLECTOR_TIME,
      });

      this.collectors.push(collector);

      collector.on("collect", async (i) => {
        if (i.member.id === this.userID) {
          if (i.customId == "ive_a_code") {
            this.channel.send(
              `Entrez et envoyez en bas le code qui se trouve dans la Description de l'activité réservée, que vous retrouverez dans le mail de confirmation suite à votre réservation envoyé par : "noreply@iut-tlse3.fr"`
            );
          } else {
            resolve(i);
          }
          i.deferUpdate();
        }
      });

      collector.on("end", (collected, reason) => {
        if (reason === "time") {
          this.cleanProcess("TIME");
        }
      });
    });
  }
  /**
   * Basic Message Collector for the code exclusively
   * @param {Discord.TextBasedChannel} channel
   * @return {Promise<String>}
   */
  messageCodeCollector(channel) {
    return new Promise(async (resolve) => {
      const filter = (m) => {
        return m.author.id === this.userID;
      };

      const collector = channel.createMessageCollector({
        filter,
        time: COLLECTOR_TIME,
        max: 1,
      });

      await this.collectors.push(collector);

      collector.on("collect", async (msg) => {
        // The code has to be 6 characters long and starts with a #
        if (msg.content.length === 6 && msg.content.startsWith("#")) {
          if (Codes.includes(msg.content)) {
            resolve("good_code");
          } else {
            msg
              .reply(
                "Merci d'entrer un code valide : Code Erroné. Le code se compose d'un total de six caractères, commençant par un #."
              )
              .then((m) => {
                setTimeout(() => {
                  if (m) m.delete();
                }, 7500);
              });
            resolve(this.messageCodeCollector(channel));
          }
        } else {
          msg
            .reply(
              "Le code se compose de la facon suivante : #XXXXX. Merci de réessayer. Le code se compose d'un total de six caractères, commençant par un #."
            )
            .then((m) => {
              setTimeout(() => {
                if (m) m.delete();
              }, 7500);
            });
          resolve(this.messageCodeCollector(channel));
        }
      });
    });
  }

  /** ################# @TOOLS ################# */

  /**
   * Transform the username of the given member into a one word string
   * @returns {String}
   */
  usernameInLinkedName() {
    return this.member.user.username.replace(/\s/g, "-");
  }
  /**
   * Add the user to the database
   * @returns {Promise<void>}
   */
  addToCodeDatabase() {
    return new Promise(async (resolve, reject) => {
      //Add the user to the json file if it doesnt exist
      let verifiedAccount = verifiedUsers.verifiedAccount;
      if (!verifiedAccount.includes(this.userID)) {
        verifiedAccount.push(this.userID);
        await fs.writeFile(
          "verifiedAccount.json",
          JSON.stringify(verifiedUsers),
          (err) => {
            if (err) reject(err);
            reject("DB_ERROR");
          }
        );
        await resolve();
      } else {
        resolve("ALREADY_EXISTS");
      }
    });
  }

  clearCollectors() {
    this.collectors.forEach(async (collector) => {
      await collector.stop();
    }),
      (this.collectors = []);
  }

  /**
   *
   * @param {String} reason
   */
  async cleanProcess(reason) {
    this.collectors.forEach((collector) => {
      collector.stop();
    }),
      this.channel.delete();

    if (reason === "TIME") {
      let embedKick = new Discord.EmbedBuilder()
        .setTitle("Vous avez été kick pour inactivité !")
        .setColor("#FF0000")
        .setTimestamp()
        .setDescription(
          "Vous avez été kick pour inactivité ! \n Revenez sur le serveur pour réessayer !"
        );
      await this.member.user
        .send({
          content: "Lien vers le serveur : " + mainGuildInvite,
          embeds: [embedKick],
        })
        .catch((e) => {
          console.warn("Can't send msg to user");
        });
    }
    try {
      this.normalLeave = true;
      if (this.member) await this.member.kick();
    } catch (err) {
      console.log(err);
    }
  }
};
