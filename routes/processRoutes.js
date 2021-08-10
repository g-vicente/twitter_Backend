const express = require("express");
const processRouter = express.Router();
const tweetController = require("../controllers/tweetController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const checkSession = require("../middleware/authMiddleware");
const { isAuthor } = require("../middleware/isAuthor");
const { isHimself } = require("../middleware/isHimself");
const { isNotHimself } = require("../middleware/isNotHimself");

// login logout
processRouter.post("/login", authController.login);
//crud de user
processRouter.post("/userCreate", userController.create);

//processRouter.use(checkSession);
processRouter.get("/userDestroy/:id", isHimself, userController.destroy);
processRouter.post("/userUpdate/:id", checkSession, isHimself, userController.update);
processRouter.get(
	"/userUpdate/:id",
	checkSession,
	isHimself,
	userController.updateUserView
);
//processRouter.get("/userUpdate/:id", userController.updateUserView);
processRouter.get("/follow/:id", isNotHimself, userController.follow);
processRouter.get("/unfollow/:id", isNotHimself, userController.unfollow);

//crud de tweet
processRouter.post("/create", tweetController.create); //cambiar url a tweets
processRouter.get("/destroy/:id", isAuthor, tweetController.destroy); //agregar tweet en url
processRouter.get("/like/:id", tweetController.like);
processRouter.get("/unlike/:id", tweetController.unlike);

module.exports = processRouter;
