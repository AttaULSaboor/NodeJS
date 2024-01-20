

const express = require('express');
const router = express.Router();
const Users = require('../models/users');

// Route to display the signup form
router.get("/", function(req, res) {
    res.render("signup", {
      error_message: req.session.error_message,
      success_message: req.session.success_message
    });
  
    // Clear the messages after showing them
    req.session.error_message = '';
    req.session.success_message = '';
  
    // Ensure the session is saved before sending the response
    req.session.save(err => {
      if (err) {
        console.error(err);
      }
    });
  });
  
// Route to handle the signup form submission
router.post("/", async function(req, res) {
    const { username, password } = req.body;
  
    if (!username || !password || username.length < 1 || password.length < 1) {
      req.session.error_message = "Username/password cannot be blank!";
      // Redirect with a unique query parameter
      res.redirect("/signup?ts=" + new Date().getTime());
    } else {
      try {
        await Users.createUser(username, password);
        req.session.success_message = "User account created!";
        // Redirect with a unique query parameter
        res.redirect("/signup?ts=" + new Date().getTime());
      } catch (error) {
        console.error(error);
        req.session.error_message = "An error occurred. Please try again.";
        // Redirect with a unique query parameter
        res.redirect("/signup?ts=" + new Date().getTime());
      }
    }
  });  

module.exports = router;
