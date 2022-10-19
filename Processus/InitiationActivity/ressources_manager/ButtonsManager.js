const { ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");

module.exports = {
  afterBook: () => {
    let row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("afterBook")
        .setLabel("Passer à la suite")
        .setEmoji("🪄")
        .setStyle(ButtonStyle.Success)
    );
    return row;
  },

  helpJoinVocal: () => {
    let row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("help_vocal")
        .setLabel("Comment Rejoindre le chat vocal !")
        .setEmoji("🔊")
        .setStyle(ButtonStyle.Secondary)
    );

    let row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("help_text")
        .setLabel("Comment Rejoindre le chat textuel du vocal !")
        .setEmoji("📝")
        .setStyle(ButtonStyle.Secondary)
    );
    return [row, row2];
  },

  canyouHearMeButtons: () => {
    let row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("yes")
        .setLabel("Oui")
        .setEmoji("✅")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("no")
        .setLabel("Non")
        .setEmoji("❌")
        .setStyle(ButtonStyle.Danger)
    );
    return row;
  },
};
