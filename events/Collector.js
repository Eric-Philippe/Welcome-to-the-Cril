/**
 * @Class Collector
 */
module.exports = class Collector {
  constructor(member, targetId, time) {
    /**
     * @type {Discord.GuildMember}
     * Member targeted by the collector
     */
    this.member = member;
    /**
     * @type {any}
     * Guild targeted by the collector
     */
    this.targetId = targetId;
    /**
     * @type {Number}
     * Time before the collector ends by itself
     */
    this.time = time;
    /**
     * @type {Boolean}
     * Is the collector launched?
     * @default false
     */
    this.launched = false;
    /**
     * @type {Boolean}
     */
    this.endState = null;
  }

  launchTimer() {
    return new Promise((resolve) => {
      if (this.launched) {
        if (this.time > 0) {
          setTimeout(() => {
            this.time -= 1_000;
            resolve(this.launchTimer());
          }, 1_000);
        } else {
          this.endState = "time";
          resolve(this.endState);
        }
      }
    });
  }

  stop() {
    this.launched = false;
    this.endState = "stopped";
    return "stopped";
  }
};
