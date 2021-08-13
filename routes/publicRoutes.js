const express = require("express");
const publicRouter = express.Router();
const moment = require("moment");
const Tweet = require("../models/Tweet");
const User = require("../models/User");
const checkSession = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
// Rutas del Públicas:
const registroFail = false;

publicRouter.get("/login", (req, res) => {
	res.render("signIn");
});
publicRouter.get("/logout", authController.logout);
publicRouter.get("/signup", (req, res) => {
	res.render("signUp", { registroFail });
});

publicRouter.post("/", checkSession, async (req, res) => {
	const page = req.body.page;
	const totalTweets = await Tweet.find({
		$or: [{ author: { $in: req.body.following } }, { author: req.user.sub }],
	}).countDocuments();
	const totalPages = Math.ceil(totalTweets / 20);
	const tweets = await Tweet.find({
		$or: [{ author: { $in: req.body.following } }, { author: req.user.sub }],
	})
		.populate("author")
		.limit(20 * page)
		.sort({ date: -1 });
	// falta cambiar a tweets de seguidores y limitarlo a 20
	res.json({ tweets, totalPages });
});

publicRouter.get("/index", (req, res) => {
	res.render("index");
});
publicRouter.get("/:username", userController.profile);

module.exports = publicRouter;
