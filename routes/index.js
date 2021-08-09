const publicRoutes = require("./publicRoutes");
const processRoutes = require("./processRoutes");

module.exports = (app) => {
  app.use(function makeUserAvailableInViews(req, res, next) {
    res.locals.loggedUser = req.user;
    next();
  });
  app.use(publicRoutes);
  app.use(processRoutes);
};
