import express, { Router } from "express";
import * as adminController from "../controllers/adminController.js";
import { LoginStrategy } from "../strategy/LoginStrategy.js";
import passport from "passport";
import db from "../config/db.js";
import { authorizeRoles } from "../middleware/chechAuth.js";
import { uplaodProductImg, uploadProfile } from "../middleware/uploadprofileImage.js";
import authRoutes from "./authRoutes.js";

passport.use(LoginStrategy);

const adminRoute = Router();

adminRoute.use(authRoutes);

adminRoute.get("/login", adminController.login);

adminRoute.post("/admin/addworker",adminController.addworkers);

adminRoute.get("/admin/home", adminController.home);

adminRoute.get("/admin/about",adminController.about);

adminRoute.get('/admin/reports', adminController.reports)

adminRoute.get("/admin/dashboard",authorizeRoles(["Admin"]),adminController.dashboard);

adminRoute.get("/admin/products",adminController.products);

adminRoute.get("/admin/workers",adminController.workers);

adminRoute.get("/admin/profile",adminController.profile);

adminRoute.post("/admin/updateProfileImg",uploadProfile.single("uploadedPhoto"),adminController.ImgprofileUpdate);

adminRoute.post("/admin/updateProfile",adminController.adminProfileUpdate);

adminRoute.get("/admin/products/forms",adminController.forms);

adminRoute.get("/admin/customers",adminController.customers);

adminRoute.get("/admin/orders",adminController.orders);

adminRoute.get("/admin/profit",adminController.profit);


adminRoute.post("/admin/profitData",adminController.profitData);


adminRoute.get("/admin/dailylog",adminController.dailyLog);

adminRoute.get("/admin/workers/type",adminController.workerType);

adminRoute.post("/admin/updateWorkerInfo",adminController.updateWorkerInfo);

adminRoute.get("/admin/worker/add",adminController.workerEdit);

adminRoute.post("/admin/worker/sendReport" ,adminController.sendReport);

adminRoute.post("/admin/delete/:id",adminController.deleteWorker);

adminRoute.get("/sidebarPhoto",adminController.sidebarPhoto);

adminRoute.get("/admin/products/type", adminController.productDivisions);

adminRoute.post("/admin/products/addDivision", adminController.addDivision);

adminRoute.get("/admin/products/viewProducts", adminController.viewProducts);

adminRoute.post("/admin/products/addProduct",uplaodProductImg.single("productImage"), adminController.addProduct);

adminRoute.post("/admin/products/editProduct/:id", adminController.editProduct);

adminRoute.post("/admin/products/updateImage/:productId",uplaodProductImg.single("productImage"),adminController.updateProductImg)

adminRoute.post("/admin/products/deleteProduct/:id", adminController.deleteProduct);


adminRoute.post("/accept/:id",adminController.acceptArrivalWorker);

adminRoute.post("/reject/:id",adminController.RejectArrivalWorker);

adminRoute.post("/departure/accept/:id",adminController.acceptDepartureWorker);

adminRoute.get("/admin/schedules/:category",adminController.scheduleType);

adminRoute.post("/admin/schedules/:category/save",adminController.saveSchedule);

adminRoute.get("/admin/schedules",adminController.schedule);

adminRoute.post("/departure/reject/:id",adminController.rejectDepartureWorker);

adminRoute.get("/admin/predictPage",adminController.predictPage);

adminRoute.get("/admin/salesPage",adminController.salesPage);

adminRoute.post("/admin/addSale/:id",adminController.addSale);

adminRoute.get("/admin/deleteSale/:id",adminController.deleteSale);

adminRoute.get("/admin/search",adminController.saleSearch);

adminRoute.get("/logout",adminController.logout);

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