const Discord = require("discord.js"); // Import the discord.js module
const { client } = require("../client"); // Import the client
const REFRESH_RATE = 100; // Refresh rate of the detector in milliseconds
/**
 * GuildJoinedDetector
 * @module GuildJoinedDetector
 */
/** Class that collect when a given user join a given Guild */
module.exports = class GuildJoinedDetector {
  /**
   * Constructor of the guildJoined Detector class
   * @param {Discord.User} user Given user
   * @param {String} guildID Given Guild ID
   * @param {Number} time Time Limit
   */
  constructor(user, guildID, time = 10 * 60 * 1000) {
    /** @type {Discord.User} Given user */
    this.user = user;
    /** @type {String} Given Guild ID */
    this.guildID = guildID;
    /** @type {Number} Time Limit for the collector to run */
    this.time = time;
    /** @type {Boolean} Is the collector launched */
    this.launched = false;
    /** @type {Boolean} Is the detector ends up with the user joined */
    this.naturalFinish = null;
    /** @type {Boolean} Is the detector gets switched off */
    this.forcedFinish = null;
  }
  /**
   * Detector on Event
   * @param {String} event Event triggered
   * @param {Function} callback callback function with the promise's result
   * @return {(Promise.<Discord.GuildMember>|Promise.<String>)}
   */
  on(event, callback) {
    // The event is promise based
    return new Promise(async (resolve) => {
      // Switch between the different events
      switch (event) {
        // Launching event
        case "collect":
          // Put the collector in launched mode
          this.launched = true;
          // Trigger the collector and wait for the user to join the guild
          let user = await this.trigger();
          // Launch the callback with the returned paramater
          callback(user);
          break;
        // Ending event
        case "end":
          // Wait for the collector to end
          let result = await this.end();
          // Launch the callback with the returned paramater
          callback(result);
          break;
      }
    });
  }
  /**
   * Launch the collector
   * @return {Promise.<Discord.GuildMember>}
   */
  async trigger() {
    // Promise Based function
    return new Promise((resolve) => {
      // If the collector is launched
      if (this.launched) {
        // Basic client event receiver
        client.once("guildMemberAdd", async (member) => {
          // Given user and guild verification
          if (
            member.user.id === this.user.id &&
            member.guild.id === this.guildID
          ) {
            // Give a clean end state
            this.naturalFinish = true;
            // resolve the promise with the member
            resolve(member);
          } else {
            // Calls itself recursively
            resolve(this.trigger());
          }
        });
      }
    });
  }
  /**
   * End Event
   * @return {Promise.<String>}
   */
  async end() {
    // Promise Based function
    return new Promise((resolve) => {
      // If time still remains and the collector is still launched
      if (this.time >= 0 && this.launched === true) {
        // Loop every 100 ms
        setTimeout(() => {
          // Update the time remaining
          this.time = this.time - REFRESH_RATE;
          // If the collector finish by user joining the given guild on time
          if (this.naturalFinish) {
            // user resolve
            resolve("user");
            // If the collector finish by time limit
          } else if (this.time <= 0) {
            // Stop the collector
            this.launched = false;
            // time resolve
            resolve("time");
            // If the collector was manually stopped
          } else if (this.forcedFinish) {
            // forced resolve
            resolve("forced");
          } else {
            // Calls itself recursively
            resolve(this.end());
          }
        }, REFRESH_RATE);
      }
    });
  }
  /**
   * Force the collector to end
   */
  stop() {
    // Stop the collector
    this.launched = false;
    // Set the forcedFinish to true
    this.forcedFinish = true;
  }
};
