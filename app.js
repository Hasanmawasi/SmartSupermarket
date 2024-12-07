import express from "express";
import dotenv from "dotenv";
import expressEjsLayouts from "express-ejs-layouts";
import adminRoute from "./server/routes/admin.js";
import workerRoute from "./server/routes/worker.js";
import authRoutes from "./server/routes/authRoutes.js"
import db from "./server/config/db.js";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import flash from "connect-flash";
import { LoginStrategy } from "./server/strategy/LoginStrategy.js";

const app = express();
app.use(express.static("public"));
app.use('/admin/updateProfile', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
passport.use(LoginStrategy);

dotenv.config();

app.use(session({
  secret:"secrets",
  saveUninitialized: false,
  resave: false,
  cookie:{
    maxAge: 60000*60,
  }
}));

app.use(flash());
app.use((req, res, next) => {
  res.locals.successMessage = req.flash('success');
  res.locals.errorMessage = req.flash('error');
  next();
});

app.use(passport.initialize());
app.use(passport.session());

//  ejs layout 
app.use(expressEjsLayouts);
app.set("layout", "./layouts/admin.ejs");
app.set("view engine", "ejs");

// connect to the database
db.connect();
// routes 

app.use("/auth", authRoutes);
app.use(adminRoute);
app.use(workerRoute);




app.listen(3000, () => {
    console.log(`the server is running on 3000`);
  });
  