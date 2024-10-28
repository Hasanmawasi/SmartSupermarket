import express, { Router } from "express";
import * as mainController from "../controllers/adminController.js";

const adminRoute = Router();

adminRoute.get("/admin",mainController.dashboard);




export default adminRoute;