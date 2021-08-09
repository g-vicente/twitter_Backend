const session = require("express-session");
module.exports = (app) => {
  app.use(
    session({
      secret: "chayanne",
      resave: false, // Docs: "The default value is true, but using the default has been deprecated".
      saveUninitialized: false, // Docs: "The default value is true, but using the default has been deprecated".
      //Guardar session en BDD-discoduro-u otro (ver librería)
    })
  );
};
