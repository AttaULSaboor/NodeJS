
var sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");

let db;

async function startup() {
  db = await sqlite.open({
    filename: 'database.db',
    driver: sqlite3.Database
  });
}

startup();

// Return all of the articles
async function getAllArticles() {
  const results = await db.all("SELECT * FROM Articles");
  return results;
}

// Create a new article given a title, content and username
async function createArticle(article, username) {
  const title = article.title;
  const content = article.content;

  // Assuming your Articles table has columns for title, content, and username
  const sql = `INSERT INTO Articles (title, content, username) VALUES (?, ?, ?)`;
  
  try {
    const result = await db.run(sql, [title, content, username]);
    return result.lastID; // Returns the ID of the newly inserted article
  } catch (error) {
    throw error; 
  }
}

module.exports = {
  getAllArticles,
  createArticle
};