var express = require('express');
var router = express.Router();
const User = require("../models/user");
const AnonymousPost = require("../models/post");
const Comment = require("../models/comment");
const { body, validationResult } = require("express-validator");

/* GET home page. */

router.get('/', async function (req, res, next) {
  try {
    if (req.isAuthenticated()) {
      // User is logged in, access user details
      const user = req.user;

      // Fetch user's posts
      const userPosts = await AnonymousPost.find({ authorId: user._id });

      // Fetch other posts
      const otherPosts = await AnonymousPost.find({ authorId: { $ne: user._id } }).populate("authorId");

      // Fetch comments
      const comments = await Comment.find({});

      res.render('index', {
        user: user,
        userPosts: userPosts,
        otherPosts: otherPosts,
        comments: comments
      });
    } else {
      res.redirect("/users/login")
    }
  } catch (error) {
    next(error); // Pass errors to the error handler middleware
  }
});


router.get("/profile", async function (req, res, next) {
  if (req.isAuthenticated()) {
    // User is logged in, access user details
    try {
      // Fetch user details
      const user = await User.findById(req.user._id);

      // Fetch user's posts
      const posts = await AnonymousPost.find({ authorId: req.user._id });

      // Fetch user's comments
      const comments = await Comment.find({ authorId: req.user._id });

      res.render("profile", { user, posts, comments });
    } catch (error) {
      next(error);
    }
  } else {
    res.redirect("/users/login");
  }
});

router.get("/create", function (req, res, next) {
  //Check if the user is authenticated
  if (req.isAuthenticated()) {
    res.render("create-post", { user: req.user });
  } else {
    res.redirect("/users/login");
  }
});

router.post("/create", [
  body("content").trim().escape().isLength({ min: 1 }).withMessage("Content must not be empty"),
], function (req, res, next) {
  //Check if the user is authenticated
  if (req.isAuthenticated()) {
    //Extract the content from the request body
    const { content } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("create-post", { user: req.user, errors: errors.array() });
    }

    const newPost = {
      content: content,
      authorId: req.user._id
    };

    //Save the new post to the database
    AnonymousPost.create(newPost)
      .then(() => {
        res.redirect("/");
      })
      .catch((err) => {
        console.error("Error creating post", err);

        res.render("error", { message: "Error creating post. Please try again later" });
      })
  } else {
    res.redirect("/users/login");
  }
})

// // Route handler for joining the club
// router.get("/join", async (req, res) => {
//   try {
//     if (req.isAuthenticated()) {
//       // Assuming you have authentication middleware to get the user from the request
//       const user = req.user;

//       // Update the membership status of the user to true
//       user.memberShipStatus = true;
//       await user.save();

//       // Fetch the relevant data to display on the dashboard after joining
//       const userPosts = await AnonymousPost.find({ authorId: user._id });

//       // Update otherPosts to include all posts now since the user has joined
//       const otherPosts = await AnonymousPost.find({})
//         .populate("authorId");

//       // Fetch user's comments
//       const comments = await Comment.find({ authorId: user._id });

//       // Render the dashboard with updated data
//       res.render('index', { user, userPosts, otherPosts, comments });
//     } else {
//       // Handle case where user is not authenticated
//       res.redirect("/users/login");
//     }
//   } catch (error) {
//     console.error('Error joining the club:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

router.get("/join", async (req, res, next) => {
  try {
    const user = req.user;

    // Fetch all posts and populate the authorId field with user data
    const otherPosts = await AnonymousPost.find({}).populate("authorId");

    // Fetch user's posts
    const userPosts = await AnonymousPost.find({ authorId: req.user._id });

    // Fetch comments
    const comments = await Comment.find({});
    console.log(comments);

    res.render("joinClub", { user, otherPosts, userPosts, comments });
  } catch (error) {
    console.error("Error fetching posts and comments", error);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/join", async (req, res, next) => {
  const { password } = req.body;

  // Check if the password matches the expected value
  if (password === "Messi") {
    try {
      // Update the membership status of the user to true
      const user = req.user;
      user.memberShipStatus = true;
      await user.save();

      res.redirect("/");
    } catch (error) {
      console.error("Error updating membership status:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    // Password incorrect, render the join club page again with an error message
    try {
      const user = req.user;
      // Fetch all posts and populate the authorId field with user data
      const otherPosts = await AnonymousPost.find({}).populate("authorId");

      // Fetch user's posts
      const userPosts = await AnonymousPost.find({ authorId: req.user._id });

      // Fetch comments
      const comments = await Comment.find({});

      res.render("joinClub", {
        user,
        otherPosts,
        userPosts,
        comments,
        error: "Incorrect password. Please try again.",
      });
    } catch (error) {
      console.error("Error fetching posts and comments:", error);
      res.status(500).send("Internal Server Error");
    }
  }
});
module.exports = router;
