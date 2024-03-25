const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");
const isAuthenticated = require("../middlewares/authMiddleware.js");

router.post("/register", authController.userRegistration);
router.post("/login", authController.userLogin);

//Protected routes
router.post("/changePassword", isAuthenticated, authController.changePassword);

module.exports = router;
