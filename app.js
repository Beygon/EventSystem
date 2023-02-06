const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const dotenv = require("dotenv");
const dbConnect = require("./config/dbConnect");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");

//Load config
dotenv.config({ path: "./config/config.env" });
const app = express();

//passport config
require("./config/passport")(passport);
//dbConnection
dbConnect();

//EXPHBS
const { formatDate, select } = require("./utils/helpers");

//Handlebars
app.engine(
  ".hbs",
  exphbs.engine({
    helpers: { formatDate, select },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

//Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Method overide
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);
//Middleware express session
app.use(
  session({
    secret: "mysecret",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");

  next();
});

//Static folder
app.use(express.static(path.join(__dirname, "public")));

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/dash", require("./routes/index"));
app.use("/events", require("./routes/events"));
app.use("/admin", require("./routes/admin"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log("Server has started"));
