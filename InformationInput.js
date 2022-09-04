const Discord = require("discord.js"); // Main Module

const { alertGif, chickenGif } = require("./config.js"); // Gif for the .env
// All the departements of the school listed
const DPT = [
  "GEAR",
  "GMP",
  "GEAP",
  "GCCD",
  "INFOCOM",
  "MEPH",
  "GCCP",
  "INFO",
  "GEII",
  "TECH DE CO",
  "CASTRES CHIMIE",
];
/**
 * Class asking for the first name, last name, and the department of the user based on promises.
 */
module.exports = class InformationInput {
  /**
   * Create an applicant object
   * @param {Discord.Channel} channel
   * @param {Discord.GuildMember} member
   */
  constructor(channel, member, timeLimit = 60 * 10 * 1000) {
    /** @type {Discord.TextChannel} channel where the process is occuring */
    this.channel = channel;
    /** @type {Discord.GuildMember} member concerned by the process */
    this.member = member;
    /** @type {String} member's ID */
    this.userID = member.user.id;
    /** @type {Number} customisable timeLimit */
    this.timeLimit = timeLimit;
    /** @type {Array.<Discord.Message>} storage of the message sent */
    this.messages = [];
    /** @type {Discord.Message} ephemeral messages storage */
    this.msg = undefined;
    /** @type {Number} step of the process */
    this.step = 0;
    /** @type {Array.<String>} Final values */
    this.values = [undefined, undefined, undefined];
    /** @type {Discord.Collector} */
    this.collector = undefined;
  }
  /**
   * Launch the process of the applicant
   * @returns {Promise.<String[]>}
   */
  async process() {
    let balise = false; // Boolean that will provide a reboot of the system if the user is not answering correctly
    this.channel.send(`||<@${this.userID}>||`).then((m) => {
      this.messages.push(m);
    });
    // Repeat at least one time
    do {
      this.step = 0;
      // Send the instruction embed and ask the user for his firstname
      this.msg = await this.sendEmbeds();
      // Getter for the firstname
      const firstname = await this.getString();
      this.collector.stop();
      this.step += 1; // Increment the step
      // Announce the user's input then clean it
      await this.channel.send(`Votre prénom est **${firstname}**`).then((m) => {
        this.messages.push(m);
      });
      // Edit the embed to ask for the lastname
      await this.editEmbedName();
      // Getter for the lastname
      const name = await this.getString();
      this.collector.stop();
      this.step += 1; // Increment the step
      // Announce the user's input then clean it
      await this.channel
        .send(`${firstname}, ton nom est : **${name}**`)
        .then((m) => {
          this.messages.push(m);
        });
      // Clean the String Input
      await this.msg.delete();
      // Ask for the department
      await this.sendDPTEmbed();
      // Getter for the department
      const dpt = await this.getDPT();
      this.collector.stop();
      // Announce the user's input then clean it
      await this.channel
        .send(`${firstname}, ton département est : **${dpt}**`)
        .then((m) => {
          this.messages.push(m);
        });
      // Clean the department Input
      await this.msg.delete();
      // Ask the user if he is sure of his input
      let message = await this.sendVerifEmbed();
      balise = await this.getVerif(message); // Yes or No
      this.collector.stop();
      // Clean all the parent messages
      if (!balise) {
        let messagesToDelete = await this.channel.messages.fetch();
        messagesToDelete.forEach((m) => {
          if (m) m.delete();
        });
      }

      // Reboot the system if the user is not answering correctly
    } while (!balise);
    // Promise resolve with the values
    this.values[0] =
      this.values[0].charAt(0).toUpperCase() + this.values[0].slice(1);
    this.values[1] = this.values[1].toUpperCase();
    this.values[2] = this.values[2].toUpperCase();
    return this.values;
  }
  /** ################ EmbedManager ################ */
  /**
   * Send the instruction embed then ask for the firstname
   * @returns {Promise.<Discord.Message>}
   */
  async sendEmbeds() {
    return new Promise((resolve) => {
      let embedInstruction = new Discord.EmbedBuilder()
        .setTitle("⚙️ | Instructions")
        .setDescription(
          "Bienvenue ! \n Au cours des prochaines minutes tu vas **d'abord** rentrer ton __prénom__, **puis le message d'après** ton __nom de famille__ et pour terminer ton __département d'étude__ afin que l'on puisse mieux te reconnaitre par la suite sur le serveur ! \n\n ⚠️ | **Pense à bien lire tout ce que tu vois car si tu es bloqué, c'est très probablement que tu as __lu de travers les consignes ...__ \n ||ou bien tu ne les as juste pas lu.|| \n ➡️ Ce par quoi tu seras tenu comme seul fautif.**"
        )
        .setColor("#BD0000")
        .setThumbnail(alertGif)
        .setTimestamp();

      this.channel.send({ embeds: [embedInstruction] }).then((m) => {
        this.messages.push(m);
      });

      let mainEmbed = new Discord.EmbedBuilder()
        .setTitle("Merci d'entrer ton prénom !")
        .setDescription(
          "Afin d'entrer ton prénom, il suffit de l'écrire en cliquant sur la zone juste en bas et de l'envoyer ! ⏬⏬⏬"
        )
        .setColor("#D22601")
        .setThumbnail(this.member.user.avatarURL() || chickenGif);

      setTimeout(async () => {
        this.channel.send({ embeds: [mainEmbed] }).then((m) => {
          resolve(m);
        });
      }, 5000);
    });
  }
  /**
   * Edit the embed to ask for the lastname
   * @returns {Promise.<void>}
   */
  async editEmbedName() {
    return new Promise((resolve, reject) => {
      let embed = new Discord.EmbedBuilder()
        .setTitle("Merci d'entrer ton nom !")
        .setDescription(
          "Afin d'entrer ton nom, il suffit de l'écrire en cliquant sur la zone juste en bas et de l'envoyer ! ⏬⏬⏬"
        )
        .setColor("#FFA200")
        .setThumbnail(this.member.user.avatarURL() || chickenGif);
      try {
        this.msg.edit({ embeds: [embed] });
        resolve();
      } catch (err) {
        console.log(err);
        //reject(err);
      }
    });
  }
  /**
   * Send the embed to ask for the department
   * @returns {Promise.<void>}
   */
  async sendDPTEmbed() {
    return new Promise((resolve, reject) => {
      let embed = new Discord.EmbedBuilder()
        .setTitle("Merci d'entrer ton département d'étude !")
        .addFields(
          {
            name: "Département : ",
            value:
              "**[1]** : 📕 - GEAR \n **[2]** : 🛠️ - GMP \n **[3]** : 📗 - GEAP \n  **[4]** : 🏗️ - GCCD \n  **[5]** : 💾 - INFOCOM \n  ",
            inline: true,
          },
          {
            name: "Département : ",
            value:
              "**[6]** : 🔭 - MEPH \n **[7]** : 🔬 - GCGP \n **[8]** : 💻 - INFO \n  **[9]** : 💡 - GEII \n  **[10]** : 📈 - TECH DE CO \n **[11]** : 🧪 CASTRES CHIMIE  ",
            inline: true,
          }
        )
        .setColor("#FFE400");

      try {
        this.channel.send({ embeds: [embed] }).then((m) => {
          this.msg = m;
        });
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }
  /**
   * Ask the user if he is sure of his input
   * @returns {Promise.<void>}
   */
  async sendVerifEmbed() {
    return new Promise((resolve, reject) => {
      let embed = new Discord.EmbedBuilder()
        .setTitle("Merci de vérifier tes informations !")
        .setDescription(
          "Afin de vérifier tes informations, il suffit de cliquer sur le bouton vert en bas, au cas échéant, clique sur le bouton rouge pour recommencer !"
        )
        .addFields(
          { name: "Prénom : ", value: this.values[0], inline: true },
          { name: "Nom : ", value: this.values[1], inline: true },
          { name: "Département : ", value: this.values[2], inline: true }
        )
        .setColor("#B9FF00")
        .setThumbnail(this.member.user.avatarURL() || chickenGif);

      // Add the buttons
      let row = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
          .setCustomId("valid")
          .setLabel("Valider")
          .setStyle(Discord.ButtonStyle.Success),
        new Discord.ButtonBuilder()
          .setCustomId("no_valid")
          .setLabel("Recommencer")
          .setStyle(Discord.ButtonStyle.Danger)
      );

      try {
        this.channel.send({ embeds: [embed], components: [row] }).then((m) => {
          this.messages.push(m);
          resolve(m);
        });
      } catch (err) {
        reject(err);
      }
    });
  }
  /** ################ GETTER ################ */
  /**
   * Basic String getter
   * @returns {Promise.<String>}
   */
  async getString() {
    return new Promise((resolve, reject) => {
      const filter = (m) => {
        return (
          m.content.length <= 20 &&
          m.content.length >= 2 &&
          m.author.id === this.userID
        );
      };
      const collector = this.channel.createMessageCollector({
        filter,
        time: this.timeLimit,
        max: 1,
      });

      this.collector = collector;

      collector
        .on("collect", (m) => {
          this.values[this.step] = m.content;
          m.delete();
          resolve(m.content);
        })
        .on("end", (collected, reason) => {
          if (reason === "time") {
            reject("TIME");
            this.msg.channel.send("Temps écoulé ! 1");
          }
        });
    });
  }
  /**
   * Complex Int and string getter
   * @returns {Promise.<String>}
   */
  async getDPT() {
    return new Promise((resolve, reject) => {
      const filter = (m) =>
        m.author.id === this.userID &&
        ((!isNaN(m.content) &&
          m.content <= DPT.length &&
          Number(m.content) > 0 &&
          Number(m.content) <= 11) ||
          DPT.includes(m.content.toUpperCase()));

      let collector = this.channel.createMessageCollector({
        filter,
        time: this.timeLimit,
        max: 1,
      });

      this.collector = collector;

      collector
        .on("collect", (m) => {
          if (isNaN(m.content)) {
            this.values[this.step] = m.content;
          } else {
            this.values[this.step] = DPT[m.content - 1];
          }
          if (m) m.delete();
          resolve(this.values[this.step]);
        })
        .on("end", (collected, reason) => {
          if (reason === "time") {
            reject("TIME");
            this.msg.channel.send("Temps écoulé ! 2");
          }
        });
    });
  }

  /**
   * Boolean getter
   * @param {Discord.Message} message
   * @returns
   */
  async getVerif(message) {
    return new Promise((resolve, reject) => {
      const collector = message.createMessageComponentCollector({
        componentType: Discord.ComponentType.Button,
        time: this.timeLimit,
      });

      this.collector = collector;

      collector.on("collect", async (i) => {
        i.deferUpdate();
        if (i.user.id === this.userID) {
          if (i.customId === "valid") {
            await resolve(true);
          } else {
            await resolve(false);
          }
        }
      });

      collector.on("end", (collected, reason) => {
        if (reason === "time") {
          reject("TIME");
          this.msg.channel.send("Temps écoulé ! 3");
        }
      });
    });
  }
};
