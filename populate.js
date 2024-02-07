#! /usr/bin/env node

console.log('This script populates the database with sample data. Specify the database connection string as an argument.');

// Get the database connection string from command line arguments
const userArgs = process.argv.slice(2);
if (!userArgs[0]) {
    console.error('Please provide the MongoDB connection string as an argument.');
    process.exit();
}

const mongoose = require('mongoose');
const Comment = require('./models/comment');
const AnonymousPost = require("./models/post");
const User = require('./models/user');

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
    console.log('Debug: Connecting to the database');
    await mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Debug: Connected to the database');

    // Delete existing data before populating
    await clearData();

    await createUsers();
    await createAnonymousPosts();
    await createComments();

    console.log('Debug: Closing mongoose connection');
    mongoose.connection.close();
}

async function clearData() {
    console.log('Debug: Clearing existing data');

    // Delete all documents from each collection
    await Promise.all([
        Comment.deleteMany({}),
        AnonymousPost.deleteMany({}),
        User.deleteMany({}),
    ]);

    console.log('Debug: Cleared existing data');
}

async function userCreate(fullName, username, email, password, memberShipStatus) {
    const user = new User({ fullName, username, email, password, memberShipStatus });
    await user.save();
    console.log(`Added user: ${username}`);
    return user;
}

async function anonymousPostCreate(content, authorId, visibility) {
    const anonymousPost = new AnonymousPost({ content, authorId, visibility });
    await anonymousPost.save();
    console.log(`Added anonymous post`);
    return anonymousPost;
}

async function commentCreate(postId, authorId, commentContent) {
    const comment = new Comment({ postId, authorId, commentContent });
    await comment.save();
    console.log(`Added comment to post: ${postId}`);
    return comment;
}

async function createUsers() {
    const userData = [
        { fullName: 'John Doe', username: 'john_doe', email: 'john@example.com', password: 'password123', memberShipStatus: true },
        { fullName: 'Jane Smith', username: 'jane_smith', email: 'jane@example.com', password: 'password456', memberShipStatus: false },
        { fullName: 'Alice Johnson', username: 'alice_johnson', email: 'alice@example.com', password: 'password789', memberShipStatus: true }
    ];

    console.log('Adding users');
    await Promise.all(userData.map(user => userCreate(user.fullName, user.username, user.email, user.password, user.memberShipStatus)));
}

async function createAnonymousPosts() {
    const postContent = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", 
        "Hello World", 
        "Creation World",
        "Designing new worlds"
    ];

    console.log('Adding anonymous posts');
    const users = await User.find();
    const authorIds = users.map(user => user._id);
    await Promise.all(postContent.map(content => {
        const authorId = authorIds[Math.floor(Math.random() * authorIds.length)];
        return anonymousPostCreate(content, authorId, true);
    }));
}

async function createComments() {
    console.log('Adding comments');
    const anonymousPosts = await AnonymousPost.find();
    const users = await User.find();
    const postIds = anonymousPosts.map(post => post._id);
    const authorIds = users.map(user => user._id);
    await Promise.all(postIds.map(postId => {
        const authorId = authorIds[Math.floor(Math.random() * authorIds.length)];
        const commentContent = "This is a comment for the post.";
        return commentCreate(postId, authorId, commentContent);
    }));
}

