const express = require("express");
const publicRouter = express.Router();
const moment = require("moment");
const Tweet = require("../models/Tweet");
// const User = require("../models/User");
const checkSession = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
// const authController = require("../controllers/authController");
// Rutas del Públicas:
// const registroFail = false;

const checkJwt = require("express-jwt");
const token = checkJwt({
	secret: process.env.TOKEN_KEY,
	algorithms: ["HS256"],
});

// publicRouter.get("/login", (req, res) => {
// 	res.render("signIn");
// });
// publicRouter.get("/logout", authController.logout);
// publicRouter.get("/signup", (req, res) => {
// 	res.render("signUp", { registroFail });
// });
// publicRouter.get("/index", (req, res) => {
// 	res.render("index");
// });

publicRouter.post("/", token, async (req, res) => {
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
	res.json({ tweets, totalPages });
});

publicRouter.get("/:username", userController.profile);

module.exports = publicRouter;
