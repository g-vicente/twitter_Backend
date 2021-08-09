require("dotenv").config();

const express = require("express");
var cors = require("cors");
const app = express();
app.use(cors());
const port = 3001;
const routes = require("./routes/index");
const dbCreate = require("./seeders/index")();

const dbConnection = require("./dbConnection");
const passport = require("./config/passport");
const sessions = require("./config/sessions");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

sessions(app);
passport(app);
dbConnection();

routes(app);

app.listen(port, console.log(`Servidor en puerto ${port}`));
