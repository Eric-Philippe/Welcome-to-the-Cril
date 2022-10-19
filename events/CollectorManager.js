const ButtonsCollector = require("./ButtonsCollector");
const MenusCollector = require("./MenusCollector");
const {
  GuildJoinedCollectorWrapper,
  createGuildJoinedCollector,
  GuildJoinedCollector,
} = require("./GuildJoinedCollector");
const {
  GuildLeavedCollectorWrapper,
  createGuildLeavedCollector,
  GuildLeavedCollector,
} = require("./GuildLeavedCollector");
const {
  VoiceJoinedCollectorWrapper,
  createVoiceJoinedCollector,
  VoiceJoinedCollector,
} = require("./VoiceJoinedCollector");
const FILTERS = require("./filters");
const ButtonsRecursiveCollector = require("./ButtonsRecursiveCollector");
const ReactionsCollector = require("./ReactionsCollector");
module.exports = {
  /**
   * ButtonsCollector
   * @param {Discord.Message} msg The message we're working with
   * @param {Function} filter Filter for the collector
   * @param {Number} time Time before the collector ends by itself in ms
   * @param {Boolean} deferUpdate Whether or not to defer the update
   * @returns {Promise<Discord.ButtonInteraction>}
   * @example
   * const { ButtonsCollector } = require("./events/CollectorManager");
   */
  ButtonsCollector: ButtonsCollector,
  /**
   * ButtonsRecursiveCollector
   * @param {Discord.Message} msg The message we're working with
   * @param {Function} filter Filter for the collector
   * @param {Number} time Time before the collector ends by itself in ms
   * @param {Discord.User} user User that will be able to resolve the collector
   * @returns {Promise<Discord.ButtonInteraction>}
   * @example
   * const { ButtonsRecursiveCollector } = require("./events/CollectorManager");
   */
  ButtonsRecursiveCollector: ButtonsRecursiveCollector,
  /**
   * ReactionCollector
   * @param {Discord.Message} msg The message we're working with
   * @param {Function} filter Filter for the collector
   * @param {Number} time Time before the collector ends by itself in ms
   * @returns {Promise<String>}
   * @example
   * const { ReactionsCollector } = require("./events/CollectorManager");
   */
  ReactionsCollector: ReactionsCollector,
  /**
   * MenusCollector
   * @param {Function} filter Filter for the collector
   * @param {Number} time Time before the collector ends by itself in ms
   * @returns {Promise<Discord.SelectMenuInteraction>}
   * @example
   * const { MenusCollector } = require("./events/CollectorManager");
   */
  MenusCollector,
  /** ###################### @Guild_Joined_Collector ###################### */
  /**
   * GuildJoinedCollector Wrapper
   * @param {Discord.GuildMember} member Member targeted by the collector
   * @param {String} guildId Guild ID targeted by the collector
   * @param {Number} time Time before the collector ends by itself in seconds
   * @returns {Promise<String>} reason
   * @example
   * const { GuildJoinedCollectorWrapper } = require("./events/CollectorManager");
   */
  GuildJoinedCollectorWrapper,

  /**
   * Guild Joined Collector Creator
   * @param {Discord.GuildMember} member Member targeted by the collector
   * @param {String} guildId Guild ID targeted by the collector
   * @param {Number} time Time before the collector ends by itself in seconds
   * @returns {GuildJoinedCollector}
   * @example
   * const { createGuildJoinedCollector } = require("./events/CollectorManager");
   * const collector = createGuildJoinedCollector(member, guildId, time);
   * collector.on("collect", (reason) => {
   *    console.log(reason);
   * });
   * collector.on("end", (reason) => {
   *    console.log(reason);
   * });
   */
  createGuildJoinedCollector,
  /**
   * @Class GuildJoinedCollector
   */
  GuildJoinedCollector,

  /** ###################### @Guild_Leaved_Collector ###################### */
  /**
   * GuildLeavedCollectorWrapper
   * @param {Discord.GuildMember} member Member targeted by the collector
   * @param {String} guildId Guild ID targeted by the collector
   * @param {Number} time Time before the collector ends by itself in seconds
   * @returns {Promise<String>} reason
   * @example
   * const { GuildLeavedCollectorWrapper } = require("./events/CollectorManager");
   */
  GuildLeavedCollectorWrapper,

  /** Guild Leaved Collector Creator
   * @param {Discord.GuildMember} member Member targeted by the collector
   * @param {String} guildId Guild ID targeted by the collector
   * @param {Number} time Time before the collector ends by itself in seconds
   * @returns {GuildLeavedCollector}
   * @example
   * const { createGuildLeavedCollector } = require("./events/CollectorManager");
   * const collector = createGuildLeavedCollector(member, guildId, time);
   * collector.on("collect", (reason) => {
   *   console.log(reason);
   * });
   * collector.on("end", (reason) => {
   *  console.log(reason);
   * });
   */
  createGuildLeavedCollector,
  /**
   * @Class GuildLeavedCollector
   */
  GuildLeavedCollector,

  /** ###################### @Voice_Joined_Collector ###################### */
  /**
   * VoiceJoinedCollectorWrapper
   * @param {Discord.GuildMember} member Member targeted by the collector
   * @param {String} guildId Guild ID targeted by the collector
   * @param {Number} time Time before the collector ends by itself in seconds
   * @returns {Promise<String>} reason
   * @example
   * const { VoiceJoinedCollectorWrapper } = require("./events/CollectorManager");
   */
  VoiceJoinedCollectorWrapper,
  /**
   * Voice Joined Collector Creator
   * @param {Discord.GuildMember} member Member targeted by the collector
   * @param {String} guildId Guild ID targeted by the collector
   * @param {Number} time Time before the collector ends by itself in seconds
   * @returns {VoiceJoinedCollector}
   * @example
   * const { createVoiceJoinedCollector } = require("./events/CollectorManager");
   * const collector = createVoiceJoinedCollector(member, guildId, time);
   * collector.on("collect", (reason) => {
   *  console.log(reason);
   * });
   * collector.on("end", (reason) => {
   * console.log(reason);
   * });
   */
  createVoiceJoinedCollector,
  /**
   * @Class VoiceJoinedCollector
   */
  VoiceJoinedCollector,

  /**
   * Filters usable in collectors
   * @example
   * const { FILTERS } = require("./events/CollectorManager");
   * const { ButtonsCollector } = require("./events/CollectorManager");
   */
  FILTERS,

  /**
   * Filters usable in menus collectors
   * @example
   * const { FILTERS_MENU } = require("./events/CollectorManager");
   * const { MenusCollector } = require("./events/CollectorManager");
   */
  FILTERS_MENU: FILTERS.MENUS,

  /**
   * Filters usable in buttons collectors
   * @example
   * const { FILTERS_BUTTONS } = require("./events/CollectorManager");
   * const { ButtonsCollector } = require("./events/CollectorManager");
   */
  FILTERS_BUTTON: FILTERS.BUTTONS,
};
