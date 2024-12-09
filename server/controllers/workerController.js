import db from "../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const about = (req, res) => {
    res.render('worker/about', {
        layout:"./layouts/worker"
    })
};

export const home = (req, res) => {
    res.render('worker/home', {
        layout: "./layouts/workerHome"
    })
}

export const log = (req, res) => {
    res.render('worker/daily-log', {
        layout: "./layouts/worker"
    })
}

export const reports = (req, res) => {
    res.render('worker/reports', {
        layout:'./layouts/worker'
    })
}
export const profile = async (req, res) => {
    // res.render('worker/profile', {
    //     layout:'./layouts/worker'
    // })

    try{ 
        const workerid = req.user.worker_id;
        let result =  await  db.query("SELECT * from worker where worker_id = $1",[workerid]);
        let name = result.rows[0].name.split(' ');
        if(result.rows.length >0) { 
            res.render('worker/profile', {
                 layout:'./layouts/worker',
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

export const ImgprofileUpdate = async (req, res)=>{
    try{
    const file = req.file;
        console.log(file);
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
    res.redirect('/worker/profile');
   
    }catch(err){
        console.log(err);
    }
};

export const workerProfileUpdate = async (req, res)=>{
    const id = req.user.worker_id;
    let name =  req.body.fname +" "+req.body.lname;
    // let email  = req.body.email;
    // let phoneNumber = req.body.phoneNumber;
    let {email , phoneNumber } = req.body;
    let result = await db.query("UPDATE worker set name = $1 , email = $2, phone_number = $3 where worker_id = $4",[name,email,phoneNumber,id]);
    if(result){
     await console.log("worker profile updated");
    res.redirect("/worker/profile");
    }else{
        console.log("failed to update");
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
    const branchId = req.user.branch_id;
    const report_title = req.body.reportTitle;
    const report_content = req.body.reportContent;
    const recipient = `${branchId}-admin`;
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