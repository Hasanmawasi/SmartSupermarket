import express, { Router } from "express";
import * as adminController from "../controllers/adminController.js";
import { AdminStrategy } from "../strategy/adminStrategy.js";
import passport from "passport";
import db from "../config/db.js";
import { isloggedIn } from "../middleware/chechAuth.js";
import { uploadProfile } from "../middleware/uploadprofileImage.js";



passport.use(AdminStrategy);

passport.serializeUser((user, done) => {
  console.log(`serlizer ${user.worker_id} ${user.name}`)
	done(null, user.worker_id);
});


  
  passport.deserializeUser(async (id, done) => {
    console.log(`deserlizer ${id}`);
    try {
      const result = await db.query('SELECT * FROM worker WHERE worker_id = $1', [id]);
      if (result.rows.length > 0) {
        done(null, result.rows[0]); // Pass the user object to the session
      } else {
        done(new Error('User not found'), null);
      }
    } catch (err) {
      done(err, null);
    }
  });

  const adminRoute = Router();

adminRoute.post("/admin/login",
  passport.authenticate("local",
    {
      successRedirect:"/admin/home",
      failureRedirect:"/admin/login"
    }));

adminRoute.get("/admin/login", adminController.login);

adminRoute.post("/admin/addworker",adminController.addworkers);

adminRoute.get("/admin/home", adminController.home);

adminRoute.get("/admin/about",adminController.about);

adminRoute.get('/admin/reports', adminController.reports)

adminRoute.get("/admin/dashboard",isloggedIn,adminController.dashboard);

adminRoute.get("/admin/products",adminController.products);

adminRoute.get("/admin/workers",adminController.workers);

adminRoute.get("/admin/profile",adminController.profile);

adminRoute.post("/admin/updateProfile",uploadProfile.single("uploadedPhoto"),adminController.profileUpdate);

adminRoute.get("/admin/products/forms",adminController.forms);

adminRoute.get("/admin/customers",adminController.customers);

adminRoute.get("/admin/orders",adminController.orders);

adminRoute.get("/admin/profit",adminController.profit);

adminRoute.get("/admin/dailylog",adminController.dailyLog);

adminRoute.get("/admin/workers/type",adminController.workerType);

adminRoute.get("/admin/worker/add",adminController.workerEdit);

adminRoute.get("/sidebarPhoto",adminController.sidebarPhoto)

const transactions = [
    { date: '2024-11-01', id: '00001', type: 'Sale', amount: 200.0, method: 'Credit Card', status: 'Completed' },
    { date: '2024-11-02', id: '00002', type: 'Refund', amount: 50.0, method: 'Cash', status: 'Completed' },
    { date: '2024-11-02', id: '00002', type: 'Refund', amount: 50.0, method: 'Cash', status: 'Completed' },
  ];
  
  // API to fetch transactions
  adminRoute.get('/transactions', (req, res) => {
    res.json(transactions);
  });

  
export default adminRoute;