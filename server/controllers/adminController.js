import db from "../config/db.js";
import bcrypt from "bcrypt";
import session from "express-session";
const saltRounds =10;

export const login = (req,res)=>{
    
    res.render("login",{
        layout:"./layouts/admin"
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
export const profile = (req, res) => {
    res.render("admin/profile", {
        
    })
}
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


export default dashboard;