import { query } from "express";
import db from "../config/db.js";
import bcrypt from "bcrypt";

const saltRounds =10;

export const login = (req,res)=>{
    
    res.render("login",{
        layout: false
    })
};

export const dashboard = (req,res)=>{
    res.render("manager/dashboard",{
        layout:"./layouts/manager",
        enable:"dashboard",
    })
};
export const home = (req,res)=>{

    res.render("manager/home",{
        layout:"./layouts/home",
        
    })
};

export const profile =async (req, res) => {
    try{ 
    const workerid = req.user.worker_id;
    let result =  await  db.query("SELECT * from worker where worker_id = $1",[workerid]);
    let name = result.rows[0].name.split(' ');
    if(result.rows.length >0) { 
        res.render("manager/profile", {
            layout:"./layouts/manager",
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
};
export const ManagerProfileUpdate = async (req, res)=>{
    const id = req.user.worker_id;
    let name =  req.body.fname +" "+req.body.lname;
    // let email  = req.body.email;
    // let phoneNumber = req.body.phoneNumber;
    let {email , phoneNumber } = req.body;
    let result = await db.query("UPDATE worker set name = $1 , email = $2, phone_number = $3 where worker_id = $4",[name,email,phoneNumber,id]);
    if(result){
     await console.log("profile updated");
    res.redirect("/manager/profile");
    }else{
        console.log("failed to update");
    }
};

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

export const workerType =async (req, res) => {
    // let type = req.query.type;
    // const adminBranch = req.user.branch_id;
    let workersData = await db.query("SELECT * from worker where position= 'admin' ");
    let workersInfo;
    if(workersData.rowCount > 0){
         workersInfo = workersData.rows;
        //  console.log(workersInfo);
    }
    res.render("manager/Admins", {
        type: "admin",
        layout: './layouts/manager',
        workersInfo: workersInfo,
        enable:"workers"
    })
};

export const addAdmins = async (req , res)=>{
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
            res.redirect("/login");
        }else{
            bcrypt.hash(workerPass , saltRounds , async(err , hash)=>{
                if(err){
                    console.error("error hashing password: ",err);
                }else{
                    const fullName = workerfname +" "+ workerlname;
                    const InsertData = await db.query("INSERT INTO WORKER(worker_id,name,position,salary,branch_id,password) VALUES($1,$2,$3,$4,$5,$6);",
                        [workerId,fullName, workertype, salary, workerbranch, hash]);

                    const user= InsertData.rows[0];
                    
                    // req.login(user,(err)=>{
                    //     if(err){
                    //         console.log(err);
                    //     }else{
                    //         console.log("success");
                    //         res.redirect("/admin/workers");
                    //     }
                    // })
                    if(InsertData){
                        req.flash('success', `Worker ${fullName} added successfully!`);
                        console.log(`success added ${fullName}`);
                            res.redirect(`/manager/admins`);
                    }else{
                        req.flash('error', 'Failed to add worker.');
                    }
                }
            })
        }
    }catch(err){
        console.log(err);
    }
}

export const AdminEdit =async (req,res)=>{
    try{ 
    let getBranch = await db.query("select branch_id from branch");
    let branches = getBranch.rows;
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
    res.render("manager/adminEdit",{
        branches: branches,
        form: form,
        name : name,
        profileimg :profileimg,
        position: postion,
        salary: salary,
        id: worker_id,
        email:email,
        layout:"./layouts/manager",
        enable:"workers"
    })
  }catch(err){
    console.log(err);
  }
};

export const updateAdminInfo =async (req, res)=>{
    const {workerid, salary, type,email , name} = req.body;
    let parsedSalary =parseFloat(salary);

    try{
       let result= await db.query("UPDATE worker set  salary=$1, position=$2,email=$3  where worker_id=$4 RETURNING *",[parsedSalary,type,email,workerid]);
        if(result){
            req.flash('success', `Worker ${name} Updated successfully!`);
            res.redirect(`/manager/admins`);
        }else{
            req.flash('error', `Worker ${name} failed Updated !`);
            console.log("faile to update");
        }
    }catch(err){
        console.log(err);
    }
}
export const deleteAdmin = async (req, res)=>{
    let {id} = req.params;
    try{
     let type= await db.query("SELECT position, name from worker where worker_id = $1",[id]);
     let result1 = await db.query("DELETE FROM admin WHERE admin_id = $1",[id]);
     let result = await db.query("DELETE FROM worker WHERE worker_id = $1",[id]);
     if(result){
        req.flash('success', `Worker "${type.rows[0].name}" Deleted !`);
        console.log("deleted");
        res.redirect(`/manager/admins`);
     }else{
        console.log(err);;
        req.flash('error', `Worker "${type.rows[0].name}" failed to Delete !`);
     }
    }catch(err){
        console.log(err);
    }
};

export const branch = async (req, res)=>{
    try{
    let result = await db.query("SELECT * FROM branch")
    let branches = result.rows;
    let result1 = await db.query(`select * from product p join branch_storage b
        on p.product_id = b.product_id
        where b.branch_id='default_branch_id'`); 
        
    let productDeletedBranch = result1.rows;      
    res.render("manager/branch",{
        branches: branches,
        product: productDeletedBranch,
        enable:"branch",
        layout:"./layouts/manager",
    });
    } catch(error){
        console.log(error);
    }

};

export const addBranch= async (req, res)=>{
    try {
        const {branchid,branchlocation,contactnumber} = req.body;
        let checkBranch  = await db.query("select branch_id from branch where branch_id = $1",[branchid]);
        if(checkBranch.rowCount > 0){
            req.flash("error", `The Branch ID (${branchid}) is all ready found`);
            res.redirect("/manager/branch")
        }else{
            let branch = await db.query(`INSERT INTO branch(branch_id, location, contact_number)
                                             VALUES($1, $2, $3)`,
                                             [branchid,branchlocation,contactnumber]);
            req.flash("success", `The branch ${branchid} added successfully!`);
            res.redirect("/manager/branch");
        }
    } catch (error) {
        console.log(error);
    }
};

export const branchUpdatepage = async (req, res)=>{
    try {
        const {form, id} = req.query;
        const result = await db.query("SELECT * from branch where branch_id =$1 ",[id]);
        const branch = result.rows[0];
        res.render("manager/branchEdit",{
            layout:"./layouts/manager",
            branch: branch,
            form,
            id,
        })
    } catch (error) {
        console.log(error);
    } 
};

export const deleteBranch = async (req, res)=>{
    const {id} = req.params;
    try {
        let result = await db.query("DELETE FROM branch WHERE branch_id = $1", [id]);
        if(result){ 
        req.flash("success",`Branch ${id} is deleted `);
        }else{
         req.flash("error",`Branch ${id} is failed to delete `)
        }
        res.redirect("/manager/branch");
    } catch (error) {
        console.log(error);
    }
};

export const updateBranch = async (req, res)=>{
    const {id} = req.params;
    const {branchid, branchlocation, contactNumber} = req.body;
    try {
        let result = await db.query(`UPDATE branch 
                                     set branch_id=$1, location=$2, contact_number=$3
                                     WHERE branch_id=$4`,
                                     [branchid,branchlocation,contactNumber,id]);
        if(result){
            req.flash("success", `Branch updated ${id}`)
        }else{
            req.flash("error", `Failed to updated branch ${id}`);
        }
        res.redirect("/manager/branch");
    } catch (error) {
        console.log(error);
    }
};

export const relocateProduct = async (req, res)=>{
    const {branch,id} = req.body;
    try {
        let result = await db.query(`update branch_storage set branch_id=$1 where product_id = $2 and branch_id='default_branch_id'`,
                                    [branch,parseInt(id)]
                                     );
        if(result){
            req.flash("success",`prodict relocated to ${branch}`)
        }else{
            req.flash("error",`prodict failed to relocated to ${branch}`)
        }
        res.redirect("/manager/branch")
    } catch (error) {
        console.log(error);
    }
}