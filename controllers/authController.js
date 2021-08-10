// Ruta login POST
const passport = require("passport");

module.exports = {
  login: passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  }),
  // Ruta inicio de sesion POST
  logout: (req, res) => {
    req.logout();
    res.json(req.user);
  },
};
