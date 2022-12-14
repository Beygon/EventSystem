const path = require("path");
const express = require("express");
const exphbs = require("express-handlebars");
const dotenv = require("dotenv");
const dbConnect = require("./config/dbConnect");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

//Load config
dotenv.config({ path: "./config/config.env" });
const app = express();

//passport config
require("./config/passport")(passport);
//dbConnection
dbConnect();

//Handlebars
app.engine(".hbs", exphbs.engine({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

//Body parser
app.use(express.urlencoded({ extended: false }));

//Middleware express session
app.use(
  session({
    secret: "mysecret",
    resave: true,
    saveUninitialized: true,
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
const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log("Server has started"));
