const { GuildMember, VoiceBasedChannel, TextChannel } = require("discord.js");

const { client } = require("../client.js");
const Collector = require("./Collector.js");

const VoiceJoinedCollector = class extends Collector {
  constructor(member, channelId, time) {
    super(member, channelId, time);
    this.member = member;
    this.targetId = channelId;
    this.time = time;
  }
  /**
   * @param {GuildMember} member Member targeted by the collector
   * @param {String} channelId Channel targeted by the collector
   * @param {Number} time Time before the collector ends by itself in seconds
   * @returns {VoiceJoinedCollector}
   */
  static createVoiceJoinedCollector(member, channelId, time) {
    return new VoiceJoinedCollector(member, channelId, time);
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
      if (this.time <= 0) {
        this.launched = false;
        this.endState = "time";
      }
      if (!this.launched) return;
      client.once("voiceStateUpdate", (oldMember, newMember) => {
        if (
          newMember.id === this.member.id &&
          newMember.channel &&
          newMember.channel.id === this.targetId
        ) {
          this.launched = false;
          this.endState = "collected";
          resolve(newMember);
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
 * @param {String} channelId Channel ID targeted by the collector
 * @param {Number} time Time before the collector ends by itself in seconds
 * @returns {Promise<String>} reason
 */
const VoiceJoinedCollectorWrapper = (member, channelId, time) => {
  return new Promise((resolve, reject) => {
    const collector = VoiceJoinedCollector.createVoiceJoinedCollector(
      member,
      channelId,
      time
    );
    collector.on("collect", (reason) => {
      resolve(reason);
    });

    collector.on("end", (reason) => {
      if (reason == "time") reject(new Error("time"));
      else reject(new Error(reason));
    });
  });
};

module.exports = {
  VoiceJoinedCollector,
  createVoiceJoinedCollector: VoiceJoinedCollector.createVoiceJoinedCollector,
  VoiceJoinedCollectorWrapper,
};
