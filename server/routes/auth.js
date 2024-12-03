import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy} from "passport-local";
import db from "../config/db.js";
import express, {Router} from "express";

const auth = Router();



