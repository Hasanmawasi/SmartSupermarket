import express from "express";
import dotenv from "dotenv";
import expressEjsLayouts from "express-ejs-layouts";
import adminRoute from "./server/routes/admin.js";
import workerRoute from "./server/routes/worker.js";
import authRoutes from "./server/routes/authRoutes.js";
import managerRoute from "./server/routes/manager.js";
import db from "./server/config/db.js";
import bodyParser from "body-parser";
import passport from "passport";
import session from "express-session";
import flash from "connect-flash";
import { LoginStrategy } from "./server/strategy/LoginStrategy.js";
import connectPgSimple from "connect-pg-simple";
import http from 'http';
import {Server} from "socket.io";



const PgSession = connectPgSimple(session);

const app = express();

const server = http.createServer(app);
export const io = new Server(server);

app.use(express.static("public"));
app.use('/admin/updateProfile', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
passport.use(LoginStrategy);

dotenv.config();

app.use(
  session({
    store: new PgSession({
      pool: db, 
      tableName: 'session',
    }),
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, 
      maxAge: 1000 * 60 * 60 * 24 * 7, 
    },
  })
);


app.use(flash());
app.use((req, res, next) => {
  res.locals.successMessage = req.flash('success');
  res.locals.errorMessage = req.flash('error');
  res.locals.warningMessage = req.flash('warning');
  next();
});

app.use(passport.initialize());
app.use(passport.session());

 
app.use(expressEjsLayouts);
app.set("layout", "./layouts/admin.ejs");
app.set("view engine", "ejs");

db.connect();

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});




app.use("/auth", authRoutes);
app.use(adminRoute);
app.use(workerRoute);
app.use(managerRoute);



app.get("*",(req,res)=>{
  res.render("404",{
    layout:false,
  })
})
server.listen(3000, () => {
    console.log(`the server is running on 3000`);
  });
  