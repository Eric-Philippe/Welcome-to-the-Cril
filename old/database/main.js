const fs = require("file-system");

const DB_FILE_NAME = "./ActivitiesUsers.json";
const DB_FILE = require(DB_FILE_NAME);

const CODES_FILE_NAME = "./Codes.json";
const CODES_FILE = require(CODES_FILE_NAME);

module.exports = {
  /**
   * Getter for the PendingUsers
   * @returns {Array} The array of pending users
   */
  getPendingUsers: () => {
    return DB_FILE.PendingUser;
  },
  /**
   * Getter for the ActivitiesUsers
   * @returns {Array} - The array of the activities users
   */
  getActivitiesUsers: () => {
    return DB_FILE.ActivitiesUsers;
  },
  /**
   * Getter for the Codes
   * @returns {Array} - The array of the codes
   */
  getCodes: () => {
    return CODES_FILE.Codes;
  },
  /**
   * Add the user id given in the Pending Users Array
   * @param {String} userId User Id
   * @returns {Number} -1 if the user is not in the array | PendingUser.length if the user is in the array
   */
  async addPendingUser(userId) {
    let i = DB_FILE.PendingUser.findIndex((e) => e === userId);
    if (i != -1) return i;
    DB_FILE.PendingUser.push(userId);
    await updateFile();
    return DB_FILE.PendingUser.length;
  },
  /**
   * Remove the user id given in the Pending Users Array
   * @param {String} userId User Id
   * @returns {Number} -1 if the user is not in the array | PendingUser.length if the user is in the array
   */
  async removePendingUser(userId) {
    let i = DB_FILE.PendingUser.findIndex((e) => e === userId);
    if (i == -1) return i;
    DB_FILE.PendingUser.splice(i, 1);
    await updateFile();
    return DB_FILE.PendingUser.length;
  },
  /**
   * Add the user id given in the Activity Finished Users Array
   * @param {String} userId User Id
   * @returns {Number} -1 if the user is not in the array | PendingUser.length if the user is in the array
   */
  async addFinishedUser(userId) {
    let i = DB_FILE.FinishedUser.findIndex((e) => e === userId);
    if (i != -1) return i;
    DB_FILE.FinishedUser.push(userId);
    await updateFile();
    return DB_FILE.FinishedUser.length;
  },
  /**
   * Remove the user id given in the Activity Finished Users Array
   * @param {String} userId User Id
   * @returns {Number} -1 if the user is not in the array | PendingUser.length if the user is in the array
   */
  async removeFinishedUser(userId) {
    let i = DB_FILE.FinishedUser.findIndex((e) => e === userId);
    if (i == -1) return i;
    DB_FILE.FinishedUser.splice(i, 1);
    await updateFile();
    return DB_FILE.FinishedUser.length;
  },
  /**
   * Add a code to the codes array in the database
   * @param {String} code Code to add
   * @returns {Number} -1 if the code is already in the array | Codes.length if the code is not in the array
   */
  async addCode(code) {
    let i = CODES_FILE.Codes.findIndex((e) => e === code);
    if (i != -1) return i;
    CODES_FILE.Codes.push(code);
    await updateFile();
    return CODES_FILE.Codes.length;
  },
  /**
   * Remove a code from the codes array in the database
   * @param {String} code Code to remove
   * @returns {Number} -1 if the code is not in the array | Codes.length if the code is in the array
   */
  async removeCode(code) {
    let i = CODES_FILE.Codes.findIndex((e) => e === code);
    if (i == -1) return i;
    CODES_FILE.Codes.splice(i, 1);
    await updateFile();
    return CODES_FILE.Codes.length;
  },
};
/**
 * Update the file with the new data
 * @returns {Promise<Number>} -1 if the file is not updated | 0 if the file is updated correctly
 */
const updateFile = async () => {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      "./database/" + DB_FILE_NAME,
      JSON.stringify(DB_FILE),
      (err) => {
        if (err) {
          console.log(err);
          reject(new Error("DB_ERROR"));
        }
      }
    );
    resolve(0);
  });
};
