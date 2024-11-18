import express, {Router} from 'express';
import * as workerController from '../controllers/workerController.js';

const workerRoute = Router();

workerRoute.get('/worker/home', workerController.home);

workerRoute.get('/worker/about', workerController.about);

workerRoute.get('/worker/log', workerController.log);

workerRoute.get('/worker/reports', workerController.reports);

workerRoute.get('/worker/profile', workerController.profile);


export default workerRoute;