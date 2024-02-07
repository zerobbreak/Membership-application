var express = require('express');
var router = express.Router();
const authController = require("../controllers/authController");

router.get('/sign-up', authController.getSignUp);
router.post('/sign-up', authController.postSignUp);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);

module.exports = router;
