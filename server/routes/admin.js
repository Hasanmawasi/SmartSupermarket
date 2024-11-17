import express, { Router } from "express";
import * as adminController from "../controllers/adminController.js";

const adminRoute = Router();


adminRoute.get("/admin/home", adminController.home);

adminRoute.get("/admin/about",adminController.about);

adminRoute.get('/admin/reports', adminController.reports)

adminRoute.get("/admin/dashboard",adminController.dashboard);

adminRoute.get("/admin/products",adminController.products);

adminRoute.get("/admin/workers",adminController.workers);

adminRoute.get("/admin/profile",adminController.profile);

adminRoute.get("/admin/products/forms",adminController.forms);

adminRoute.get("/admin/customers",adminController.customers);

adminRoute.get("/admin/orders",adminController.orders);

adminRoute.get("/admin/profit",adminController.profit);

adminRoute.get("/admin/dailylog",adminController.dailyLog);

adminRoute.get("/admin/workers/type",adminController.workerType);


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