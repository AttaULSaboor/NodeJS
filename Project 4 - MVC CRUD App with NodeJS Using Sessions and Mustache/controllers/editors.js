
const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose(); 
const db = new sqlite3.Database("database.db");

// Display the editors page with user and article data
router.get("/", async function(req, res) {
  db.all("SELECT * FROM Users", [], (err, users) => {
    if (err) {
      console.error(err);
      return res.render("editors", { error: "An error occurred while fetching users." });
    }
    db.all("SELECT * FROM Articles", [], (err, articles) => {
      if (err) {
        console.error(err);
        return res.render("editors", { error: "An error occurred while fetching articles." });
      }
      res.render("editors", { users: users, articles: articles });
    });
  });
});

// Delete a user and their articles
router.get("/deleteuser/:username", async function(req, res) {
  const username = req.params.username;
  db.serialize(() => {
    db.run("DELETE FROM Articles WHERE username = ?", [username]);
    db.run("DELETE FROM Users WHERE username = ?", [username], (err) => {
      if (err) {
        console.error(err);
        return res.redirect("/editors");
      }
      res.redirect("/editors");
    });
  });
});

// Delete an article
router.get("/deletearticle/:title", async function(req, res) {
  const title = req.params.title;
  db.run("DELETE FROM Articles WHERE title = ?", [title], (err) => {
    if (err) {
      console.error(err);
      return res.redirect("/editors");
    }
    res.redirect("/editors");
  });
});

module.exports = router;
