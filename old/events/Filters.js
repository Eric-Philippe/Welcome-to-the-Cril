const { User } = require("discord.js");
const FILTERS = {
  BUTTONS: {
    Only_User: function (user) {
      return (interaction) => interaction.user.id === user.id;
    },
    Those_Buttons: function (buttons) {
      return (interaction) => buttons.includes(interaction.customId);
    },
    /**
     *
     * @param {Array<String>} buttons
     * @param {User} user
     * @returns {Boolean}
     */
    Those_Buttons_And_This_User: function (buttons, user) {
      return (interaction) =>
        buttons.includes(interaction.customId) &&
        interaction.user.id === user.id;
    },
    This_Button_And_This_User: function (button, user) {
      return (interaction) =>
        interaction.customId === button && interaction.user.id === user.id;
    },
    This_Button: function (button) {
      return (interaction) => interaction.customId === button;
    },
  },
  MENUS: {
    Only_User: function (user) {
      return (interaction) => interaction.user.id === user.id;
    },
  },
  REACTIONS: {
    This_User_This_Reaction(emote, us) {
      return (reaction, user) =>
        reaction.emoji.name === emote && user.id === us.id && !us.bot;
    },
    This_User_Those_Reactions(reactions, us) {
      return (reaction, user) =>
        reactions.includes(reaction.emoji.name) && us.id === user.id && !us.bot;
    },
  },
};

module.exports = FILTERS;
