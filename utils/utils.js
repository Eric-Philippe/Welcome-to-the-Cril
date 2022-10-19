const {
  TextChannel,
  Message,
  GuildMember,
  Guild,
  CategoryChannel,
  ChannelType,
  PermissionFlagsBits,
  PermissionsBitField,
  Role,
} = require("discord.js");
const { radioChannelId } = require("../env.js");

const { COLORS, COLORS_TEXT } = require("../ressources.js");

module.exports = {
  /**
   *
   * @param {TextChannel} channel
   * @param {String} strID
   * @returns {}
   */
  async pingId(channel, strID) {
    return await channel.send(`<@${strID}>`);
  },
  /**
   * Pick a random color from an array of colors
   */
  randomColor() {
    let i = Math.floor(Math.random() * COLORS.length);
    return { color: COLORS[i], name: COLORS_TEXT[i] };
  },
  /**
   *
   * @param {GuildMember} member
   * @param {Guild} guild
   * @param {String} parentChannelId
   * @returns {Promise<TextChannel>}
   */
  async createSelfChannel(member, guild, parentChannelId) {
    return new Promise((resolve, reject) => {
      let channelName = member.user.username.replace(/ /g, "-");
      try {
        const channel = guild.channels.create({
          name: channelName,
          type: ChannelType.GuildText,
          topic: `Salon personnel de ${member.user.username}`,
          parent: parentChannelId,
          permissionOverwrites: [
            {
              id: member.id,
              allow: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
              ],
            },
            {
              id: guild.roles.everyone,
              deny: [
                PermissionFlagsBits.ViewChannel,
                PermissionFlagsBits.SendMessages,
              ],
            },
          ],
        });
        resolve(channel);
      } catch (err) {
        console.error(err);
        reject(err);
      }
    });
  },
  /**
   * Pick a random channel that the user can see and try to take one where nobody is inside, else take a random one
   * @param {Guild} guild
   * @param {Role} member
   * @returns {Promise<VoiceChannel>}
   */
  async pickChannelForMember(guild, role) {
    let channels = guild.channels.cache.filter((channel) => {
      // Check if the user has the permission to see the channel and send messages
      // And if the channel is not the radio channel
      return (
        channel.type === 2 &&
        channel
          .permissionsFor(role)
          .has(PermissionsBitField.Flags.ViewChannel) &&
        channel
          .permissionsFor(role)
          .has(PermissionsBitField.Flags.SendMessages) &&
        channel.id !== radioChannelId
      );
    });
    // Pick one amoung the filtered channels
    let pick = channels.random();
    return pick;
  },
  secondsToReadableTime(seconds) {
    let sec = seconds % 60;
    let min = Math.floor(seconds / 60);
    min = min % 60;
    return `${min} minutes ${sec} secondes`;
  },
};
