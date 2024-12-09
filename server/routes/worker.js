import express, {Router} from 'express';
import * as workerController from '../controllers/workerController.js';
import { authorizeRoles } from '../middleware/chechAuth.js'
import authRoutes from './authRoutes.js';
import { LoginStrategy } from '../strategy/LoginStrategy.js';
import passport from 'passport';
import { uploadProfile } from '../middleware/uploadprofileImage.js';

passport.use(LoginStrategy);

const workerRoute = Router();

workerRoute.use(authRoutes);


workerRoute.get('/worker/home', authorizeRoles(["Worker"]), workerController.home);

workerRoute.get('/worker/about', workerController.about);

workerRoute.get('/worker/log', workerController.log);

workerRoute.get('/worker/reports', authorizeRoles(["Worker"]), workerController.reports);

workerRoute.get('/worker/profile', workerController.profile);

workerRoute.post('/worker/updateProfileImg',uploadProfile.single("UploadedPhoto"),workerController.ImgprofileUpdate);

workerRoute.post('/worker/updateProfile',workerController.workerProfileUpdate);

workerRoute.post('/worker/sendReport', workerController.sendReport);

workerRoute.get('/profilePhoto',workerController.profile);

export default workerRoute;