const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

//GET /users/signup - Render sign-up form
exports.getSignUp = (req, res, next) => {
    res.render("signup");
}

//POST /users/signup - Handle sign-up form submission
exports.postSignUp = [
    //Sanitize and validate form fields
    body("fullname").trim().isLength({ min: 1 }).escape(),
    body("username").trim().isLength({ min: 1 }).escape(),
    body("email").trim().isEmail().normalizeEmail(),
    body("password").trim().escape(),

    //Process request after validation and sanitization
    async (req, res, next) => {
        try {
            //Extract validation errors
            const errors = validationResult(req);

            //If there are validation errors, render the form again with sanitized values and errors messages
            if (!errors.isEmpty()) {
                return res.render("signup", { errors: errors.array() });
            }

            //Check if the username already exists
            const existingUser = await User.findOne({ username: req.body.username });
            const existingEmail = await User.findOne({ email: req.body.email });

            if (existingUser) {
                return res.render("signup", { error: "Username already in use" });
            }

            if (existingEmail) {
                return res.render("signup", { error: "Email is already in use" });
            }

            //Hash the password
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            //Create a new user with the hashed password
            const user = new User({
                fullName: req.body.fullname,
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
            });

            await user.save();
            res.redirect("/users/login");
        } catch (error) {
            return next(error);
        }
    }]

//GET /users/login - Render login form
exports.getLogin = (req, res, next) => {
    res.render("login", { user: req.user })
};

//POST /users/login - Handle login form submission
exports.postLogin = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/sign-up"
});

//GET /users/logout - Logout user
exports.logout = (req, res, next) => {
    req.logOut((error) => {
        if (error) {
            return next(error);
        }
        res.redirect("/users/login");
    })
}