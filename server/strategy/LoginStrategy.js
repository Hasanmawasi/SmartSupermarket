import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy} from "passport-local";
import db from "../config/db.js";


export const LoginStrategy = new Strategy(
  { usernameField: "id", passwordField: "password" },
  async function verify(id, password, cb) {
    try {
      let role;
      if (id.startsWith("Admin")) role = "Admin";
      else if (id.startsWith("WRK")) role = "Worker";
      else if (id.startsWith("Manager")) role = "Manager";
      else {
        console.log("Invalid ID format");
        return cb(null, false);
      }
      const userQuery = await db.query("SELECT * FROM worker WHERE worker_id = $1", [id]);
      
      if (userQuery.rows.length === 0) {
        console.log("User not found");
        return cb(null, false);
      }
      
      const user = userQuery.rows[0];
      const storedHashedPassword = user.password;
      
      bcrypt.compare(password, storedHashedPassword, (err, isValid) => {
        if (err) {
          console.error("Error comparing password:", err);
          return cb(err);
        }
        
        if (isValid) {
          console.log("User found!");
          user.role = role;
          return cb(null, user);
        } else {
          console.log("Wrong password!");
          return cb(null, false);
        }
      });
    } catch (err) {
      console.error("Error during authentication:", err);
      return cb(err);
    }
  }
);

passport.serializeUser((user, done) => {
  console.log("Serialized User:", { id: user.worker_id, role: user.role });
  done(null, user);
});


passport.deserializeUser((user, done) => {
  done(null, user);
});

