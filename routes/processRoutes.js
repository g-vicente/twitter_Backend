const express = require("express");
const processRouter = express.Router();
const tweetController = require("../controllers/tweetController");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const checkSession = require("../middleware/authMiddleware");
const { isAuthor } = require("../middleware/isAuthor");
const { isHimself } = require("../middleware/isHimself");
const { isNotHimself } = require("../middleware/isNotHimself");
const checkJwt = require("express-jwt");

const token = checkJwt({
  secret: process.env.TOKEN_KEY,
  algorithms: ["HS256"],
});

// login logout
processRouter.post("/login", authController.login);
//crud de user
processRouter.post("/user", userController.create);
processRouter.delete("/user", isHimself, userController.destroy);
processRouter.post("/users", token, userController.update);
processRouter.patch("/follow/:id", token, isNotHimself, userController.follow);

//crud de tweet
processRouter.post("/tweet", token, tweetController.create);
processRouter.delete("/tweet", token, isAuthor, tweetController.destroy);
processRouter.patch("/tweet/:id", token, tweetController.like);

module.exports = processRouter;
