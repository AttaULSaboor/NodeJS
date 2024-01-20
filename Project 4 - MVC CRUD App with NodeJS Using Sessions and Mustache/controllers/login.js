
const express = require('express');
var router = express.Router();
const Users = require('../models/users');

// Displays the login page
router.get("/", async function(req, res)
{
  // if we had an error during form submit, display it, clear it from session
  req.TPL.login_error = req.session.login_error;
  req.session.login_error = "";

  // render the login page
  res.render("login", req.TPL);
});

// Attempts to login a user
// - The action for the form submit on the login page.
router.post("/attemptlogin", async function(req, res) {
  const { username, password } = req.body;
  try {
    const user = await Users.findByCredentials(username, password);

    if (user) {
      req.session.username = user.username;
      req.session.level = user.level; // Set the user's level in the session

      // Redirect to the correct page based on access level
      if (user.level === 'editor') {
        res.redirect("/editors");
      } else {
        res.redirect("/members");
      }
    } else {
      // if we have an error, reload the login page with an error
      req.session.login_error = "Invalid username and/or password!";
      res.redirect("/login");
    }
  } catch (error) {
    // Log the error and show a generic error message to the user
    console.error(error);
    req.session.login_error = "An error occurred during login. Please try again.";
    res.redirect("/login");
  }
});

// Logout a user
// - Destroys the session key username that is used to determine if a user
// is logged in, re-directs them to the home page.
router.get('/logout', function(req, res) {
  // This will destroy the entire session
  req.session.destroy(function(err) {
    if (err) {
      console.error(err);
    } else {
      res.redirect('/home');
    }
  });
});

module.exports = router;
