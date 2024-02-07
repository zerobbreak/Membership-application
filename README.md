# Exclusive Clubhouse

Welcome to the Exclusive Clubhouse project! In this project, you'll be building a private clubhouse where members can write anonymous posts. Inside the clubhouse, members can see the author of a post, but outside viewers can only see the story itself, leaving them to wonder who wrote it.

## Assignment Overview

1. **Database Models**: Set up database models for users and messages, including fields for full names, usernames, passwords, membership status, message titles, timestamps, and text.

2. **Database Setup**: Configure your database on MongoDB and generate the project skeleton, including the necessary models.

3. **Sign-up Form**: Create a sign-up form for users to register. Sanitize and validate form fields and secure passwords with bcrypt. Implement a custom validator to confirm passwords.

4. **Club Membership**: Implement a page where members can join the club by entering a secret passcode. Update their membership status upon successful entry.

5. **Login Form**: Create a login form using passport.js for user authentication.

6. **New Message Form**: Allow logged-in users to create new messages and display them on the home page.

7. **Privacy Settings**: Display all member messages on the home page but only show the author and date to other club members. Add an optional admin field to the user model to enable message deletion.

## Deployment

Once you're satisfied with your work, deploy your project on your chosen Platform as a Service (PaaS) service and share the link below!

Happy coding!