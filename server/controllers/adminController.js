import exp from "constants";
import db from "../config/db.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { log } from "console";

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

export const workerEdit =async (req,res)=>{
    try{ 
    let form= req.query.form;  
    let workerId = req.query.id;
    let worker_id,name,postion,salary,email,profileimg;
    let result = await db.query("SELECT * FROM worker where worker_id = $1", [workerId]);
    if(result.rowCount >0){
     worker_id = result.rows[0].worker_id;
     name = result.rows[0].name;
    postion= result.rows[0].position;
     salary = result.rows[0].salary;
     email = result.rows[0].email;
     profileimg = result.rows[0].image_url;
    }
    res.render("admin/workerEdit",{
        form: form,
        name : name,
        profileimg :profileimg,
        position: postion,
        salary: salary,
        id: worker_id,
        email:email,
        layout:"./layouts/admin"
    })
  }catch(err){
    console.log(err);
  }
};

export const updateWorkerInfo =async (req, res)=>{
    const {workerid, salary, type,email} = req.body;
    let parsedSalary =parseFloat(salary);

    try{
       let result= await db.query("UPDATE worker set  salary=$1, position=$2,email=$3  where worker_id=$4",[parsedSalary,type,email,workerid]);
        if(result){
            res.redirect(`/admin/workers/type?type=${type}`);
        }else{
            console.log("faile to update");
        }
    }catch(err){
        console.log(err);
    }
}

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

export const reports = async (req, res) => {

    try {
        const branch = req.user.branch_id;
        const recipient = `${branch}-admin`;

        const result = await db.query(
            "SELECT report_date, report_title, report_body FROM reports WHERE recipient = $1 ORDER BY report_date    DESC",
            [recipient]
        );
        res.render("admin/reports", {
            reports:  result.rows,
            layout:"./layouts/admin",
        })
    
    } catch (error) {
        console.error('Error retrieving reports:', error);
        res.status(500).send('Failed to load reports.');
    }

}

export const workers = (req, res) => {
    res.render("admin/workers", {
        layout:"./layouts/admin"
    })
}
export const profile =async (req, res) => {
    try{ 
    const workerid = req.user.worker_id;
    let result =  await  db.query("SELECT * from worker where worker_id = $1",[workerid]);
    let name = result.rows[0].name.split(' ');
    if(result.rows.length >0) { 
        res.render("admin/profile", {
            firstName: name[0],
            lastName: name[1],
            phone: result.rows[0].phone_number,
            email:  result.rows[0].email,
            image: result.rows[0].image_url,
            salary: result.rows[0].salary,

        })
     }
    }catch(err){
        console.log(err);
    }
}

export const adminProfileUpdate = async (req, res)=>{
    const id = req.user.worker_id;
    let name =  req.body.fname +" "+req.body.lname;
    // let email  = req.body.email;
    // let phoneNumber = req.body.phoneNumber;
    let {email , phoneNumber } = req.body;
    let result = await db.query("UPDATE worker set name = $1 , email = $2, phone_number = $3 where worker_id = $4",[name,email,phoneNumber,id]);
    if(result){
     await console.log("profile updated");
    res.redirect("/admin/profile");
    }else{
        console.log("failed to update");
    }
}

export const ImgprofileUpdate = async (req, res)=>{
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

export const workerType =async (req, res) => {
    let type = req.query.type;
    const adminBranch = req.user.branch_id;
    let workersData = await db.query("SELECT * from worker where branch_id =$1 ",[adminBranch]);
    let workersInfo;
    if(workersData.rowCount > 0){
         workersInfo = workersData.rows;
        //  console.log(workersInfo);
    }
    res.render("admin/workerType", {
        type: type,
        layout: './layouts/admin',
        workersInfo: workersInfo,
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


export const sendReport = async (req, res) => {
    const workerId =  req.user.worker_id;
    const report_title = req.body.reportTitle;
    const report_content = req.body.reportContent;
    const recipient = "Manager";
    const report_date = new Date().toISOString().slice(0, 10);

    if (!report_title || !report_content) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
       const result = await db.query("INSERT INTO reports(report_date, report_title, report_body, recipient, worker_id) VALUES ($1,$2,$3,$4,$5) RETURNING *", [report_date, report_title, report_content, recipient, workerId]);
       res.status(201).json({ message: "Report added successfully!", report: result.rows[0] });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Database error occurred!" });
    }
}

export const viewReport = async (req, res) => {

}

export default dashboard;