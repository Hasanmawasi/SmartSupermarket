import express, { Router } from "express";
import * as adminController from "../controllers/adminController.js";

const adminRoute = Router();


adminRoute.get("/admin/home", adminController.home);

adminRoute.get("/admin/about",adminController.about);

adminRoute.get('/admin/reports', adminController.reports)

adminRoute.get("/admin/dashboard",adminController.dashboard);

adminRoute.get("/admin/products",adminController.products);

export default adminRoute;