import express from "express";
import passport from "passport";

const authRoutes = express.Router();

authRoutes.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
  (req, res) => {
    console.log("Authenticated User:", req.user);
    const { role } = req.user;

    if (role === "Admin") {
      res.redirect("/admin/home");
    } else if (role === "Worker") {
      res.redirect("/worker/home");
    } else if (role === "Manager") {
      res.redirect("/manager/home");
    } else {
      res.redirect("/login");
    }
  }
);
export default authRoutes;
