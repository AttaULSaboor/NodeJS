
const express = require('express');
var router = express.Router()
const ArticlesModel = require('../models/articles.js')

// Display the articles page
router.get("/", async function(req, res)
{
  // Retrieve all of the articles using the model method, display the page
  req.TPL.articles = await ArticlesModel.getAllArticles();
  res.render("articles", req.TPL);

});

// Route to handle article submission from a form
router.post("/submitarticle", async function(req, res) {
  // Ensure the user is logged in
  if (!req.session.username) {
    // Redirect to login page or show an error
    res.redirect('/login');
    return;
  }

  try {
    // Create the article using the model
    await ArticlesModel.createArticle(req.body, req.session.username);

    // Redirect to a confirmation page, the article list, or wherever is appropriate
    res.redirect('/articles');
  } catch (error) {
    // Log the error and render an error message
    
    res.render('error', { message: 'There was an error submitting your article.' });
  }
});

module.exports = router;
