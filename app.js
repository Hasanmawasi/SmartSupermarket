import express from "express";
import dotenv from "dotenv";
dotenv.config();
import expressEjsLayouts from "express-ejs-layouts";
import adminRoute from "./server/routes/admin.js";

const app = express();
app.use(express.static("public"));


//  ejs layout 
app.use(expressEjsLayouts);
app.set("layout", "./layouts/admin.ejs");
app.set("view engine", "ejs");


// routes 
app.use(adminRoute);



app.listen(3000, () => {
    console.log(`the server is running on 3000`);
  });
  