const express = require("express")
const userController = require("../controller/userController.js")
const router = express.Router();

router.post("/register", userController.Register)
router.post("/login", userController.Login)
router.put("/profile-image", userController.UpdateProfileImage)

module.exports = router;