import db from "../config/db.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const saltRounds =10;

export const login = (req,res)=>{
    
    res.render("login",{
        layout: false
    })
}

export const dashboard = (req,res)=>{
        res.render("admin/dashboard",{
            layout:"./layouts/admin"
        })
};
export const home = (req,res)=>{
    
        res.render("admin/home",{
            layout:"./layouts/home"
        })
};

export const products = (req,res)=>{
    
    res.render("admin/products",{
        layout:"./layouts/admin"
    })
};

export const forms = (req,res)=>{
    let form= req.query.form;
    res.render("admin/forms",{
        form: form,
        layout:"./layouts/admin"
    })
};

export const workerEdit = (req,res)=>{
    let form= req.query.form;
    res.render("admin/workerEdit",{
        form: form,
        layout:"./layouts/admin"
    })
};

export const customers = (req, res)=>{
    res.render("admin/customers",{
        layout:"./layouts/admin"
    })
};

export const orders = (req, res)=>{
    res.render("admin/orders",{
        layout:"./layouts/admin"
    })
};

export const profit = (req, res)=>{
    res.render("admin/profit",{
        layout:"./layouts/admin"
    })
};

export const about = (req, res) => {

    res.render("admin/about", {
        layout:"./layouts/admin"
    })
}

export const reports = (req, res) => {
    res.render("admin/reports", {
        layout:"./layouts/admin"
    })
}

export const workers = (req, res) => {
    res.render("admin/workers", {
        layout:"./layouts/admin"
    })
}
export const profile =async (req, res) => {
    const workerid = req.user.worker_id;
    let result =  await  db.query("SELECT * from worker where worker_id = $1",[workerid]);
    let name = result.rows[0].name.split(' ');
    if(result.rows.length >0) { 
    res.render("admin/profile", {
        firstName: name[0],
        lastName: name[1],
        phone: result.rows[0].phone_number,
        email:  result.rows[0].email,
        image: result.rows[0].image_url


    })
}
}

export const profileUpdate = async (req, res)=>{
    try{
    const file = req.file;
        
    if(!file){
        return res.status(400).send("no image Uploaded");
    }
    const photoURL = `/image/profileImg/${file.filename}`;
    const id = req.user.worker_id;

    const oldphoto = await db.query("select image_url from worker where worker_id = $1",[id]);
    const oldphotoUrl = oldphoto.rows[0].image_url;

    await db.query("UPDATE worker set image_url = $1 where worker_id=$2",[photoURL,id]);
    console.log(`image uploaded ${photoURL}`);


    console.log(oldphoto.rows[0].image_url);
    if(oldphoto){
        if(oldphotoUrl === "/image/logo.png"){
            return;
        }else{
        fs.unlink(__dirname+"../../../public"+oldphotoUrl,err=>{
            if(err){
                console.log(`error deleting old photo ${err}`);
            }else{
                console.log(`old photo deleted ${oldphotoUrl}`);
            }
        })
        }
    }
 
   
    }catch(err){
        console.log(err);
    }
};

export const dailyLog = (req, res) => {
    res.render("admin/dailylog", {
        
    })
}

export const workerType = (req, res) => {
    let type = req.query.type;
    res.render("admin/workerType", {
        type: type,
        layout: './layouts/admin'
    })
};

export const addworkers = async (req , res)=>{
    const workerId = req.body.workerID;
    const workerPass = req.body.workerPassword;
    const workerbranch = req.body.workerBranch;
    const workerfname = req.body.firstName;
    const workerlname= req.body.lastName;
    const workertype = req.body.workerType;
    const salary = req.body.salary;
    try{
        const checkResult = await db.query("SELECT * FROM  worker WHERE worker_id= $1",[workerId,]);

        if(checkResult.rows.length >0 ){
            res.redirect("/admin/login");
        }else{
            bcrypt.hash(workerPass , saltRounds , async(err , hash)=>{
                if(err){
                    console.error("error hashing password: ",err);
                }else{
                    const fullName = workerfname +" "+ workerlname;
                    const InsertData = await db.query("INSERT INTO WORKER(worker_id,name,position,salary,branch_id,password) VALUES($1,$2,$3,$4,$5,$6);",
                        [workerId,fullName, workertype, salary, workerbranch, hash]);

                    const user= InsertData.rows[0];
                    
                    req.login(user,(err)=>{
                        if(err){
                            console.log(err);
                        }else{
                            console.log("success");
                            res.redirect("/admin/home");
                        }
                    })
                }
            })
        }
    }catch(err){
        console.log(err);
    }
}

export const sidebarPhoto =async (req, res)=>{

    const id = req.user.worker_id;

    const profileP = await db.query("select image_url from worker where worker_id = $1",[id]);
    const photo = profileP.rows[0].image_url;

    res.json(photo);
}
export default dashboard;