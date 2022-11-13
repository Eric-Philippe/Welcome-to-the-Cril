/** Discord API Import */
const { TextChannel, GuildMember } = require("discord.js");
/** Enum ID Properties */
const { PROPERTIES } = require("./Properties");
/** ================ @Collectors_Imports ================ */
const {
  FILTERS,
  ButtonsCollector,
  MenusCollector,
} = require("../../events/CollectorManager");
/** ================ @Discord_Objects_Creator ================ */
const {
  sendInstructionsEmbed,
  sendFirstLastNameEmbed,
  sendValidationEmbed,
} = require("./embedsManager");
const { createFirstLastNameModal } = require("./modalsManager");
const { createDptMenu } = require("./menusManager");
/** ================ @Utils ================*/
const { pingId } = require("../../utils/utils");
const MessagesBuffer = require("../../MessagesBuffer");
/**
 * Function that follows the process of the informations input for the firstname, lastname and department
 * @param {TextChannel} channel
 * @param {GuildMember} member
 * @param {Number} time
 * @returns {Promise.<Array.<String>>}
 */
module.exports = async function InformationsInput(channel, member, time) {
  // Promise based process
  return new Promise(async (resolve, reject) => {
    // Messages Stockage
    let messagesBuffer = new MessagesBuffer();
    // Balise that will alow us to easily redo the whole process
    let systemDone = false;
    // Send a mention to the user
    messagesBuffer.add(await pingId(channel, member.id));

    do {
      // Send the instructions embed
      messagesBuffer.add(await sendInstructionsEmbed(channel, member));
      // Wait 5secs and send the first and last name embed that introduce the modal

      messagesBuffer.add(await sendFirstLastNameEmbed(channel, member));

      // Create the collector that will load the modal
      const interaction = await ButtonsCollector(
        messagesBuffer.last(),
        FILTERS.BUTTONS.This_Button_And_This_User(
          PROPERTIES.LAUNCH_MODAL_NAME,
          member.user
        ),
        time,
        false
        // On rejected
      ).catch((error) => {
        if (error.message === "time") {
          cleanSystem(messagesBuffer);
          reject(new Error("time"));
          return;
        }
      });
      // Show the modal
      if (!interaction) return;
      await interaction.showModal(await createFirstLastNameModal());
      // Await the modal response
      const submitted = await interaction
        .awaitModalSubmit({
          time: time,
          filter: (i) =>
            i.user.id === interaction.user.id && i.customId === "modal_name",
        })
        .catch((reason) => {
          reject(new Error("time"));
          return null;
        });
      // If the modal is not submitted
      if (!submitted) return;
      let firstname = submitted.fields.getTextInputValue("firstNameInput");
      let lastname = submitted.fields.getTextInputValue("lastNameInput");
      if (!firstname || !lastname) return;
      // Create the select department menu
      if (submitted.replied) return;
      messagesBuffer.add(
        await submitted.channel.send({
          content: "Sélectionner votre Département dans le menu déroulant",
        })
      );
      messagesBuffer.add(
        await submitted.reply({
          components: [createDptMenu()],
        })
      );

      // Wait for the selection
      let departement = await MenusCollector(
        FILTERS.MENUS.Only_User(member.user),
        time
      ).catch((reason) => {
        if (reason === "time") {
          cleanSystem(messagesBuffer);
          reject(new Error("time"));
          return;
        }
      });
      // Ask the user to validate the informations
      messagesBuffer.add(
        await sendValidationEmbed(channel, member, [
          firstname,
          lastname,
          departement,
        ])
      );
      // Ask the user if he wants to redo the process
      const validationInteraction = await ButtonsCollector(
        messagesBuffer.last(),
        FILTERS.BUTTONS.Those_Buttons_And_This_User(
          [PROPERTIES.VALIDATE_NAME, PROPERTIES.REJECT_NAME],
          member.user
        ),
        time,
        true
      ).catch((reason) => {
        if (reason === "time") {
          cleanSystem(messagesBuffer);
          reject(new Error("time"));
          return;
        }
      });
      // If the user doesn't want to redo the process
      if (!validationInteraction) return;
      if (validationInteraction.customId === PROPERTIES.VALIDATE_NAME) {
        // Hard Format the input like so (FirstName, LASTNAME, DPT)
        systemDone = true;
        firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1);
        lastname = lastname.toUpperCase();
        resolve([firstname, lastname, departement]);
      } else {
        messagesBuffer.clear();
      }
    } while (!systemDone);
  });
};
/**
 *
 * @param {MessagesBuffer} messagesBuffer
 */
const cleanSystem = (messagesBuffer) => {
  messagesBuffer.clear();
};
