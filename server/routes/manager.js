import express, { Router } from "express";
import * as managerController from '../controllers/managerController.js';
import { LoginStrategy } from "../strategy/LoginStrategy.js";
import passport from "passport";
import db from "../config/db.js";
import { authorizeRoles } from "../middleware/chechAuth.js";
import { uplaodProductImg, uploadProfile } from "../middleware/uploadprofileImage.js";
import authRoutes from "./authRoutes.js";

passport.use(LoginStrategy);

const managerRoute = Router();

managerRoute.use(authRoutes);

managerRoute.get("/login",managerController.login);

managerRoute.get("/manager/dashboard",managerController.dashboard);

managerRoute.get("/manager/home",managerController.home);

managerRoute.get("/manager/profile",managerController.profile);

managerRoute.post("/manager/updateProfileImg",uploadProfile.single("uploadedPhoto"),managerController.ImgprofileUpdate);

managerRoute.post("/manager/updateProfile",managerController.ManagerProfileUpdate);

managerRoute.get("/manager/admins",managerController.workerType);

managerRoute.post("/manager/addAdmins",managerController.addAdmins)

managerRoute.get("/manager/Admin/add",managerController.AdminEdit);

managerRoute.post("/manager/updateAdminInfo",managerController.updateAdminInfo);

managerRoute.post("/manager/delete/:id",managerController.deleteAdmin);

managerRoute.get("/manager/branch",managerController.branch);

managerRoute.post("/manager/addBranch",managerController.addBranch);

managerRoute.get("/manager/branch/update",managerController.branchUpdatepage);

managerRoute.post("/manager/updateBranch/:id",managerController.updateBranch);

managerRoute.post("/manager/deleteBranch/:id",managerController.deleteBranch);

managerRoute.post("/manager/relocateProduct",managerController.relocateProduct);

export default managerRoute;