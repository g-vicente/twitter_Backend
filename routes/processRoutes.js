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
processRouter.post("/usercreate", userController.create);

//processRouter.use(checkSession);
processRouter.get("/userDestroy/:id", isHimself, userController.destroy);

processRouter.post(
  "/userupdate",
  token,
  /* checkSession,
  isHimself, */
  userController.update
);

//processRouter.get("/userUpdate/:id", userController.updateUserView);
processRouter.post("/follow/:id", token, isNotHimself, userController.follow);
processRouter.post("/unfollow/:id", token, isNotHimself, userController.unfollow);

//crud de tweet
processRouter.post("/tweet", token, tweetController.create); //cambiar url a tweets
processRouter.delete("/tweet", checkSession, isAuthor, tweetController.destroy); //agregar tweet en url
processRouter.post("/like/:id", tweetController.like);
processRouter.post("/unlike/:id", tweetController.unlike);

module.exports = processRouter;
