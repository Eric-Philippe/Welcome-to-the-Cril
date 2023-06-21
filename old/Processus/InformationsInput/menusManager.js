const { ActionRowBuilder, SelectMenuBuilder } = require("discord.js");
const Departments = require("./Departments.json").dpts;

module.exports = {
  createDptMenu: function () {
    let menu = new SelectMenuBuilder()
      .setCustomId("select-dpt")
      .setPlaceholder("Cliquez sur moi !")
      .setMinValues(1)
      .setMaxValues(1);
    for (let dpt of Departments) {
      menu.addOptions({ label: dpt.name, value: dpt.name, emoji: dpt.emoji });
    }

    const rowMenu = new ActionRowBuilder().addComponents(menu);

    return rowMenu;
  },
};
