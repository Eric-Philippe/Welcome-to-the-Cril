const Discord = require("discord.js");
const { chickenGif } = require("../config");
const Answer_Interface = require("./Answer_Interface");
const Question_Interface = require("./Question_Interface");
/**
 * @class MCQ
 * Multiple Choice Question Generic Class
 * @extends Question_Interface
 * @extends Answer_Interface
 *
 */
module.exports = class MCQ {
  /**
   * Constructor for the MCQ
   * @param {Discord.GuildMember} member
   * @param {Discord.TextBasedChannel} channel
   */
  constructor(member, channel, time, timer = false) {
    /** @type {Discord.GuildMember} Main User of the MCQ */
    this.member = member;
    /** @type {Discord.TextBasedChannel} Channel where the MCQ is based*/
    this.channel = channel;
    /** @type {Array.<Question_Interface>} Questions linked to the MCQ */
    this.Questions = [];
    /** @type {Discord.Embed} */
    this.Instructions;
    /** @type {Number} Step of the process */
    this.step = 0;
    /** @type {Number} Length of the MCQ */
    this.length = this.Questions.length;
    /** @type {Number} Maximum allowed inactivty time */
    this.time = time;
    /** @type {Number} Timer can be optional. It's in second*/
    this.timer = timer ? 0 : -1;
    /** @type {Boolean} */
    this.isLaunched = false;
    /** @type {Boolean} */
    this.isEnded = false;
    /** @type {Discord.Message} Current Working Message */
    this.msg = undefined;
    /** @type {Array.<Discord.Message>} */
    this.messages = [];
    /** @type {Array.<Discord.Collector>} */
    this.collectors = [];
  }
  /** =================== MAIN_PROCESS =================== */
  async start() {
    return new Promise(async (resolve, reject) => {
      if (!this.isSetup()) throw new Error("MCQ not fully setup !");
      this.isLaunched = true;
      if (this.timer === 0) this.#launchTimer();
      this.msg = await this.sendInstructions();
      let i = await this.#buttonCollector().catch((e) => {
        reject("TIME");
      });
      if (!i) return;
      i.deferUpdate();
      this.#nextStep();
      let wellAnswered = null;

      do {
        this.msg = await this.#displayQuestion();
        let notAnsweredWell = 0;
        do {
          let interactionQuestion = await this.#buttonCollector().catch((e) => {
            reject("TIME");
          });
          if (!interactionQuestion) return;
          interactionQuestion.deferUpdate();
          this.#cleanCollectors();
          if (
            this.Questions[this.step - 1].isGoodAnswer(
              this.#transformCode(interactionQuestion.customId)
            )
          ) {
            wellAnswered = true;
            let embedT = new Discord.EmbedBuilder()
              .setColor("07D201")
              .setDescription("✅ | Bonne réponse !");
            await this.channel.send({ embeds: [embedT] }).then((m) => {
              setTimeout(() => {
                if (m) {
                  if (m.channel) {
                    m.delete();
                  }
                }
              }, 3500);
            });
          } else {
            notAnsweredWell++;
            wellAnswered = false;
            let embedF = new Discord.EmbedBuilder()
              .setColor("DA0000")
              .setDescription("❌ | Mauvaise réponse !")
              .setFooter({ text: "Merci de réessayer !" });
            await this.channel.send({ embeds: [embedF] }).then((m) => {
              setTimeout(() => {
                m.delete();
              }, 3500);
            });
            if (notAnsweredWell === 2) {
              this.channel.send(chickenGif).then((m) => {
                setTimeout(() => {
                  m.delete();
                }, 2000);
              });
            }
          }
        } while (!wellAnswered);
        this.#nextStep();
      } while (this.isLaunched);
      resolve(this.timer > 0 ? this.transformTimer() : this.timer);
    });
  }

  #nextStep() {
    this.step++;
    this.#cleanCollectors();
    if (this.step - 1 >= this.length)
      (this.isEnded = true), (this.isLaunched = false);
  }
  /**  ===================== UI ==================== */
  /** First Step of the process. Send the instructions to the user */
  async sendInstructions() {
    return new Promise((resolve) => {
      if (!this.Instructions) throw new Error("Instructions not set!");
      let row = new Discord.ActionRowBuilder().addComponents(
        new Discord.ButtonBuilder()
          .setCustomId("go")
          .setLabel("Lancer le QCM !")
          .setEmoji("✅")
          .setStyle(Discord.ButtonStyle.Success)
      );
      this.channel
        .send({
          embeds: [this.Instructions],
          components: [row],
          content: `||<@${this.member.id}>||`,
        })
        .then((msg) => {
          resolve(msg);
          this.messages.push(msg);
        });
    });
  }

  async #displayQuestion() {
    return new Promise(async (resolve) => {
      const [embed, row] = this.Questions[this.step - 1].toEmbed();
      if (this.step === 1) {
        await this.channel
          .send({ embeds: [embed], components: [row] })
          .then((msg) => {
            resolve(msg);
            this.messages.push(msg);
          });
      } else {
        if (!this.msg) throw new Error("No message found !");
        this.msg.edit({ embeds: [embed], components: [row] }).then((msg) => {
          resolve(msg);
        });
      }
    });
  }
  /** =================== COLLECTORS ====================*/
  /**
   *
   * @returns {Promise.<Discord.ButtonInteraction>}
   */
  #buttonCollector() {
    if (!this.msg) throw new Error("No message found !");
    return new Promise((resolve, reject) => {
      const collector = this.msg.createMessageComponentCollector({
        componentType: Discord.ComponentType.Button,
        time: this.time,
      });

      this.collectors.push(collector);

      collector.on("collect", (i) => {
        if (i.user.id === this.member.id) {
          resolve(i);
        }
      });

      collector.on("end", (collected, reason) => {
        if (reason === "time") {
          reject(reason);
          this.cleanProcess();
        }
      });
    });
  }
  /** ===================== CLEAN ===================== */
  #cleanCollectors() {
    for (let collector of this.collectors) {
      collector.stop();
    }
    this.collectors = [];
  }

  #cleanMessages() {
    for (let message of this.messages) {
      try {
        message.delete();
      } catch (e) {
        console.info("Message already deleted");
      }
    }
    this.messages = [];
  }

  cleanProcess() {
    this.#cleanCollectors();
    this.#cleanMessages();
  }

  /** =================== SETTER =================== */
  /**
   * Setter for the first Instruction Embed of the MCQ
   * @param {Discord.EmbedBuilder} instructions
   */
  setInstructions(instructions) {
    if (typeof instructions != "object") throw new Error("Invalid type !");
    this.Instructions = instructions;
  }
  /**
   * Toggle the timer on and off
   */
  toggleTimer() {
    if (this.isLaunched)
      throw new Error("Can't toggle the timer while the MCQ is running");
    if (!this.timer) this.timer = 0;
    if (!isNaN(this.timer)) this.timer = -1;
  }

  /** =================== BUILDER =================== */
  /**
   * Build the MCQ from the questions Database
   */
  #Builder(questions) {
    let treatedAnswer, treatedQuestion; // Temporary variables
    // For each question Object like so {title: "", answers: [{text: ""}]} from the db
    for (let question of questions) {
      // Create a new Question Object
      treatedQuestion = new Question_Interface();
      // Add a title
      treatedQuestion.setTitle(question.title);
      treatedQuestion.setGoodAnswers(question.good_answers);
      // If a URL img is set, put it inside the object
      if (question.imgURL) treatedQuestion.setImgURL(question.imgURL);
      // If a URL link is set, put it inside the object
      if (question.linkURL) treatedQuestion.setLinkURL(question.linkURL);
      // Loop all the answers of the question
      for (let i = 0; i < question.answers.length; i++) {
        // Create a new Answer Object
        treatedAnswer = new Answer_Interface();
        // Set the text of the answer
        treatedAnswer.setText(question.answers[i]);
        // Set the positioning of the answer (1 to 5(starting from 0))
        treatedAnswer.setPostioning(i);
        // Add the answer to the Answer Object
        treatedQuestion.addAnswer(treatedAnswer);
      }
      // Push all the build inside the Questions Array
      this.Questions.push(treatedQuestion);
      this.length = this.Questions.length;
    }
    //console.info("MCQ Is well setup and ready to be launched !");
  }
  /** =================== SELECTER =================== */
  /**
   * Select the questions Database to use
   * @param {Number} index
   */
  selectQuestionsDatabase(index) {
    let file_title;
    switch (index) {
      case 0:
        file_title = "Questions_ResaCRIL";
        break;
      case 1:
        file_title = "Questions_English";
        break;
    }

    let file = require(`./MCQ_Database/${file_title}.json`);
    if (!file) throw new Error("File not found !");
    if (!file.Questions) throw new Error("No questions found !");
    this.#Builder(file.Questions);
  }
  /** =================== TIMER ====================*/
  /**
   * When launched, add one second to the timer
   */
  #launchTimer() {
    var loop = setInterval(() => {
      this.timer++;
      if (!this.isLaunched) clearInterval(loop);
    }, 1000);
  }
  /**
   * Getter of the timer
   */
  getTimer() {
    return this.timer;
  }
  /** =================== TOOLS =================== */
  /**
   * Check if the MCQ is well setup
   * @returns {Boolean}
   */
  isSetup() {
    return this.Questions.length > 0 && this.Instructions && this.channel;
  }
  /**
   * pick a random Int between zero and max
   */
  randomInt(max) {
    if (max < 1) throw new Error("Max must be superior to 1");
    return Math.floor(Math.random() * Math.floor(max));
  }
  /**
   * Transform the timer from seconds to a human lisble time format
   */
  transformTimer() {
    let minutes = Math.floor(this.timer / 60);
    let seconds = this.timer % 60;
    return `${minutes} minutes ${seconds} seconds`;
  }
  /**
   * Transform the code id into an index
   * @returns {Number}
   * @example id = :one: => index = 0
   */
  #transformCode(id) {
    switch (id) {
      case "one":
        return 0;
      case "two":
        return 1;
      case "three":
        return 2;
      case "four":
        return 3;
      case "five":
        return 4;
      case "six:":
        return 5;
      case "seven":
        return 6;
      case "eight":
        return 7;
      case "nine":
        return 8;
      case "ten":
        return 9;
    }
  }
};
