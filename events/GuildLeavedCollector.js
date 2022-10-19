const { GuildMember, AuditLogEvent } = require("discord.js");

const { client } = require("../client.js");
const Collector = require("./Collector.js");

const GuildJoinedCollector = class extends Collector {
  constructor(member, guildId, time) {
    super(member, guildId, time);
    this.member = member;
    this.targetId = guildId;
    this.time = time;
  }
  /**
   * @param {GuildMember} member Member targeted by the collector
   * @param {String} guildId Guild ID targeted by the collector
   * @param {Number} time Time before the collector ends by itself in seconds
   * @returns {GuildJoinedCollector}
   */
  static createGuildLeavedCollector(member, guildId, time) {
    return new GuildJoinedCollector(member, guildId, time);
  }
  /**
   * Launch the collector
   * @param {('collect'|'end')} event
   * @param {Function} callback
   */
  async on(event, callback) {
    switch (event) {
      case "collect":
        this.launched = true;
        callback(await this.collect());
        break;
      case "end":
        if (!this.time) {
          callback(await this.end());
        } else {
          Promise.race([this.end(), this.launchTimer()]).then((value) => {
            callback(value);
          });
        }
        break;
      default:
        throw new Error("Invalid event");
    }
  }
  /**
   * Collector event
   * @returns {Promise<GuildMember>}
   */
  collect() {
    return new Promise((resolve) => {
      if (this.time <= 0) this.launched = false;
      if (!this.launched) return;
      client.once("guildMemberRemove", async (member) => {
        if (member.id === this.member.id && member.guild.id === this.targetId) {
          this.launched = false;
          this.endState = "collected";

          const fetchedLogs = await member.guild.fetchAuditLogs({
            limit: 1,
            type: AuditLogEvent.MemberKick,
          });
          const kickLog = fetchedLogs.entries.first();
          const { executor, target } = kickLog;
          if (
            target.id == member.id &&
            kickLog.createdTimestamp > Date.now() - 5000
          ) {
            return resolve("kicked");
          } else {
            return resolve("leaved");
          }
        } else {
          resolve(this.collect());
        }
      });
    });
  }
  /**
   * End Receiver
   */
  async end() {
    return new Promise((resolve) => {
      if (this.launched) {
        setTimeout(() => {
          resolve(this.end());
        }, 1_000);
      } else {
        resolve(this.endState);
      }
    });
  }
};
/**
 * @param {GuildMember} member Member targeted by the collector
 * @param {String} guildId Guild ID targeted by the collector
 * @param {Number} time Time before the collector ends by itself in seconds
 * @returns {Promise<String>} reason
 */
const GuildLeavedCollectorWrapper = (member, guildId, time) => {
  return new Promise((resolve, reject) => {
    const collector = GuildJoinedCollector.createGuildLeavedCollector(
      member,
      guildId,
      time
    );
    collector.on("collect", (reason) => {
      resolve(reason);
    });

    collector.on("end", (reason) => {
      if (reason == "time") reject(new Error("time"));
    });
  });
};

module.exports = {
  GuildLeavedCollectorWrapper,
  createGuildLeavedCollector: GuildJoinedCollector.createGuildLeavedCollector,
  GuildJoinedCollector,
};
