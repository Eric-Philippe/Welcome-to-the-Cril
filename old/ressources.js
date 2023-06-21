const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  /** CONFIG */
  gifAlert: process.env.GIF_ALERT,
  gifChicken: process.env.GIF_CHICKEN,
  whiteLogo: `https://cdn.discordapp.com/attachments/1017375045649190922/1026039964271648849/red_logo.jpg`,
  redLogo: `https://cdn.discordapp.com/attachments/1017375045649190922/1026039997318574142/white_logo.jpg`,
  mailLogo: `https://cdn.discordapp.com/attachments/814908646138970122/1014293274753769632/mail_icone.png`,
  outLogo: `https://media.discordapp.net/attachments/579303130886569984/1032297065755189258/out.png`,
  kickLogo: `https://media.discordapp.net/attachments/579303130886569984/1032297069903368192/kick.png`,
  checkLogo: `https://media.discordapp.net/attachments/579303130886569984/1032297054036312145/check.png`,
  COLORS: [
    "#FF0000",
    "#FF7F00",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#8B00FF",
    "#FF00FF",
    "#FFFFFF",
    "#000000",
  ],
  COLORS_TEXT: [
    "🔴 ROUGE",
    "🟠 ORANGE",
    "🟡 JAUNE",
    "🟢 VERT",
    "🔵 BLEU",
    "🟣 VIOLET",
    "🌸 ROSE",
    "⚪ BLANC",
    "⚫ NOIR",
  ],
  EMOTES_NUMBERS: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"],
};
