
const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");

let db;

async function startup() {
  db = await sqlite.open({
    filename: 'database.db',
    driver: sqlite3.Database
  });
}

startup();

const Users = {
  async findByCredentials(username, password) {

    const user = await db.get('SELECT username, password, level FROM Users WHERE username = ? AND password = ?', [username, password]);
    return user; // This will now include the user's level
  },

  async createUser(username, password) {
    // The 'level' is hardcoded to 'member' by default here, since you don't have a sign-up process for editors
    try {
      const result = await db.run('INSERT INTO Users (username, password, level) VALUES (?, ?, ?)', [username, password, 'member']);
      return result.lastID;
    } catch (error) {
      throw error;
    }
  },

};

module.exports = Users;
