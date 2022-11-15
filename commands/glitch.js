const {
  SlashCommandBuilder,
  ChannelType,
  ChatInputCommandInteraction,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("glitch")
    .setDescription(
      "Begin a rude fight of ping-pong agaisnt the undefeated bot !"
    )
    .addStringOption((option) =>
      option
        .setName("answer")
        .setDescription("Answer")
        .setRequired(true)
        .setMinLength(4)
    ),
  /**
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    if (interaction.channel) return interaction.deferReply();
    let answer = interaction.options.getString("answer");
    if (answer.toLowerCase() === "boobs") {
      interaction.reply({ content: "You won !" });
    } else {
      let answers_prop = [
        "I'm not agree with your answer",
        "I love you, but that's not the answer",
        "BOOBS",
        "Have a great evening !",
        "silkskin",
        "T'es vraiment pas ouf",
        "FreePass pour un massage intégral",
        "FreePass pour un jar until you can't handle it anymore",
        "FreePass pour une tablette de chocolat",
      ];
      // Get a random answer
      let prop = answers_prop[Math.floor(Math.random() * answers_prop.length)];
      interaction.reply({ content: prop });
    }
  },
};
