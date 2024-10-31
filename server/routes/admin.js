import express, { Router } from "express";
import * as adminController from "../controllers/adminController.js";

const adminRoute = Router();

adminRoute.get("/admin/dashboard",adminController.dashboard);

adminRoute.get("/admin/home", adminController.home)


export default adminRoute;