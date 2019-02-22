require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const passport = require("./passport/localStrategy");

const { isRole } = require("./helpers/middlewares");
const { isActive } = require("./helpers/middlewares");

//hbs helpers
// hbs.registerHelper("checkSelected", function(id, childId) {
//   // let found = child.sponsors.find(s => s == id);
//   // console.log(id, child);
//   console.log(id);
//   console.log(child);
//   let found = true;
//   if (!found) return null;
//   return "selected";
// });

mongoose
  .connect(process.env.DB, { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

hbs.registerHelper("ifUndefined", (value, options) => {
  if (arguments.length < 2)
    throw new Error("Handlebars Helper ifUndefined needs 1 parameter");
  if (typeof value !== undefined) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

// default value for title local
app.locals.title = "Casa del Sol";
app.locals.loggedUser = false;
app.locals.isAdmin = false;

// Enable authentication using session + passport
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
app.use(flash());
require("./passport")(app);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//Validate logged user
function isLogged(req, res, next) {
  if (req.isAuthenticated()) {
    app.locals.loggedUser = true;
    next();
  } else {
    app.locals.loggedUser = false;
    next();
  }
}

function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "ADMIN") {
    app.locals.isAdmin = true;
    next();
  } else {
    app.locals.isAdmin = false;
    next();
  }
}

const profile = require("./routes/profile");
const children = require("./routes/children");
const index = require("./routes/index");
const auth = require("./routes/auth");
// poner is active
app.use('/profile', isLogged, isRole('SPONSOR'), isActive('Active'), profile)
app.use("/children", isLogged, isRole('ADMIN'), children);
app.use("/auth", isLogged, auth);
app.use("/", index);

module.exports = app;
