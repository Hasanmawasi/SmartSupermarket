import exp from "constants";
import db from "../config/db.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { io } from "../../app.js";

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

export const forms = async (req,res)=>{
    let form= req.query.form;
    try{
        let result = await db.query("SELECT type, category_id FROM category");
        let type = result.rows;
        res.render("admin/forms",{
            form: form,
            category: type,
            layout:"./layouts/admin"
        })
    }catch(err){
        console.log(err);
    }
};


  

// export const addProduct =async (req, res)=>{
//     const file =req.file;
//     console.log(file.filename);
//     const adminBranch = req.user.branch_id;
//     const {productName,category,productPrice,basePrice,expideDate,description,barcode,quantity}= req.body;
//     if(!file){
//         res.send("image not uploaded")
//     }
//     let imageUrl = `/image/productPhoto/${file.filename}`;
//     let result = await db.query(`INSERT INTO product(description,expire_date,image_url,base_price,selling_price,bar_code,product_name,category_id)
//          VALUES($1,$2,$3,$4,$5,$6,$7,$8)
//           RETURNING *`,
//         [description,expideDate,imageUrl,basePrice,productPrice,barcode,productName,category]
//     );
//     let productId = result.rows[0].product_id;

//     let result2 = await db.query(`INSERT INTO branch_storage(branch_id,product_id,quantity)
//          VALUES($1,$2,$3)`,
//          [adminBranch,productId,quantity]
//         );

//     if(result && result2){
//         req.flash('success',`the product: ${productName} added successfuly ${quantity} items to ${adminBranch}!`);
//         res.redirect("/admin/products/forms?form=add")
//     }else{
//         res.status(404).send("error adding pruduct");
//     }
// }

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

export const deleteWorker = async (req, res)=>{
    let {id} = req.params;
    try{
     let type= await db.query("SELECT position, name from worker where worker_id = $1",[id]);
     let result = await db.query("DELETE FROM worker WHERE worker_id = $1",[id]);
     if(result){
        req.flash('success', `Worker "${type.rows[0].name}" Deleted !`);
        console.log("deleted");
        res.redirect(`/admin/workers/type?type=${type.rows[0].position}`);
     }else{
        console.log(err);;
        req.flash('error', `Worker "${type.rows[0].name}" failed to Delete !`);
     }
    }catch(err){
        console.log(err);
    }
}

export const updateWorkerInfo =async (req, res)=>{
    const {workerid, salary, type,email , name} = req.body;
    let parsedSalary =parseFloat(salary);

    try{
       let result= await db.query("UPDATE worker set  salary=$1, position=$2,email=$3  where worker_id=$4 RETURNING *",[parsedSalary,type,email,workerid]);
        if(result){
            req.flash('success', `Worker ${name} Updated successfully!`);
            res.redirect(`/admin/workers/type?type=${type}`);
        }else{
            req.flash('error', `Worker ${name} failed Updated !`);
            console.log("faile to update");
        }
    }catch(err){
        console.log(err);
    }
}

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
            `SELECT report_date, report_title, report_body FROM reports WHERE recipient = $1 ORDER BY report_date    DESC`,
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

export const dailyLog = async (req, res) => {
    try {
        let branch = req.user.branch_id;
        let logStatus= "pending";
        let rejectStatus = "rejected";
        let result = await db.query(`SELECT * FROM dailylog
                                    inner join  worker on worker.worker_id= dailylog.worker_id and worker.branch_id=$1
                                     where 
                                     dailylog.branch_id=$1 and dailylog.log_status = $2 
                                     `,
                                    [branch, logStatus]);
        let result2 = await db.query(`SELECT * FROM dailylog
            inner join  worker on worker.worker_id= dailylog.worker_id and worker.branch_id=$1
             where 
             dailylog.branch_id=$1 and dailylog.departure_time= $2 
             `,
            [branch, logStatus]);
        let result3 = await db.query(`SELECT * FROM dailylog
            inner join  worker on worker.worker_id= dailylog.worker_id and worker.branch_id=$1
                where 
                dailylog.branch_id=$1 and dailylog.departure_time= $2 OR dailylog.log_status = $2 
                `,
            [branch, rejectStatus]); 
        let result4 = await db.query(`SELECT * FROM dailylog
            inner join  worker on worker.worker_id= dailylog.worker_id and worker.branch_id=$1
                where 
                dailylog.branch_id=$1 and  (dailylog.departure_time IS NULL OR dailylog.departure_time != $2) AND dailylog.log_status =$3  
                `,
            [branch,"accepted","accepted"]);
        let pendingWorker = result.rows; 
        let departureWorker = result2.rows;
        let rejectedWorkers= result3.rows; 
        let inWork = result4.rows;   
        res.render("admin/dailylog", {
        pendingWorker: pendingWorker,
        departureWorker: departureWorker,
        rejectedWorkers: rejectedWorkers,
        inWork: inWork,
        });
    } catch (error) {
        console.log(error)
    }
    
}

export const acceptArrivalWorker= async (req, res)=>{
    try {
        const acceptedWorker = req.params.id;
        let message= 'accepted'
        let result = await db.query(`UPDATE dailylog set log_status='accepted'
                                        where 
                                        log_date=CURRENT_DATE and worker_id =$1`,[acceptedWorker]);
        if(result)
        console.log("accepted!");   
       //sending data
        io.emit('accepted-login',message);
        res.redirect("/admin/dailylog");                          
    } catch (error) {
        console.log(error)
    }
}
export const RejectArrivalWorker= async (req, res)=>{
    try {
        const rejectedWorker = req.params.id;
        let message= 'rejected'
        let result = await db.query(`UPDATE dailylog set log_status='rejected'
                                        where 
                                        log_date=CURRENT_DATE and worker_id =$1`,[rejectedWorker]);
        if(result)
        console.log("worker rejcted");   
       
        io.emit('accepted-login',message);
        res.redirect("/admin/dailylog");                          
    } catch (error) {
        console.log(error)
    }
}

export const acceptDepartureWorker =async (req, res)=>{
    try {
        let message= 'accepted';
        const acceptedWorker = req.params.id;
        let result = await db.query(`UPDATE dailylog set departure_time='accepted'
                                        where 
                                        log_date=CURRENT_DATE and worker_id =$1`,[acceptedWorker]);
        if(result)
        console.log("accepted departure");  
        io.emit('accepted-departure',message); 
        res.redirect("/admin/dailylog");                          
    } catch (error) {
        console.log(error);
    }
}

export const rejectDepartureWorker =async (req, res)=>{
    try {
        let message= 'rejected';
        const rejectedWorker = req.params.id;
        let result = await db.query(`UPDATE dailylog set departure_time='rejected'
                                        where 
                                        log_date=CURRENT_DATE and worker_id =$1`,[rejectedWorker]);
        if(result)
        console.log("rejected departure");  
        io.emit('accepted-departure',message);                       
        res.redirect("/admin/dailylog");    
    } catch (error) {
        console.log(error);
    }
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
                            res.redirect(`/admin/workers/type?type=${workertype}`);
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



export const productDivisions =async (req, res) => {
    let type = req.query.type;
    
    try {
        const categoryResult = await db.query('SELECT category_id FROM category WHERE LOWER(type) = $1', [type.toLowerCase()]);

        if (categoryResult.rows.length === 0) {
            return res.status(404).send('Category not found');
        }

        const categoryId = categoryResult.rows[0].category_id;

        // console.log(categoryId)

        const divisionsResult = await db.query('SELECT * FROM division WHERE category_id = $1', [categoryId]);

        res.render("admin/divisions", {
            results: divisionsResult.rows,
            categoryType: type,
            category_id: categoryId,
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

export const addDivision = async (req, res) => {
    const { divisionName, categoryId } = req.body; 
    console.log('Division Name:', divisionName); 
    console.log('Category ID:', categoryId); 
    try {
        await db.query("INSERT INTO division (name, category_id) VALUES ($1, $2)", [divisionName, categoryId]);

        const category = await db.query("SELECT type FROM category WHERE category_id = $1", [categoryId]);
        const categoryType = category.rows[0].type.toLowerCase();
        console.log(categoryType);
        req.flash('success', `${divisionName} added Successfully!`)
        res.redirect(`/admin/products/type?type=${categoryType}`);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}


export const viewProducts = async (req, res) => {
    const branch = req.user.branch_id;
    const { id } = req.query    ;
    console.log(id);
    try {

        const results = await db.query(`SELECT 
            p.product_id,
            p.product_name,
            p.description,
            p.expire_date,
            p.base_price,
            p.selling_price,
            p.image_url,
            bs.quantity
            FROM 
            branch_storage bs
            JOIN 
            product p
            ON 
            bs.product_id = p.product_id
            WHERE 
            bs.branch_id = $1
            AND p.division_id = $2
            ORDER BY p.product_id DESC;`,[branch, id]);
        

            console.log(results.rows)
        res.render("admin/viewProducts", {
         products: results.rows,
         div_id: id
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
    
}

export const addProduct = async (req, res) => {
    const branchId = req.user.branch_id;
    const { productName, basePrice, sellingPrice, quantity, productDescription,expireDate, divId} = req.body;
    try {
        let file = req.file;
        let imageUrl= `/image/poductImg/${file.filename}`;

        const productResult = await db.query('INSERT INTO product (description, expire_date, base_price, selling_price, product_name, division_id,image_url) VALUES ($1, $2, $3, $4, $5, $6,$7) RETURNING *',[productDescription, expireDate, basePrice, sellingPrice, productName, divId,imageUrl]);

        const productId = productResult.rows[0].product_id;
        const product_Name = productResult.rows[0].product_name;
        console.log(productId);

        await db.query(
            'INSERT INTO branch_storage (product_id, branch_id, quantity) VALUES ($1, $2, $3)', 
            [productId, branchId, quantity]
        );
        req.flash('success', `${product_Name} added Successfully!`)
        res.redirect(`/admin/products/viewProducts?id=${divId}`);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

export const editProduct = async (req, res) => {
    const productId = req.params.id;
    const branch = req.user.branch_id
    console.log("this is the product id from the edit form " + productId)
    const { productName, basePrice, sellingPrice, quantity, productDescription } = req.body;

    try {
        
        const update = await db.query('UPDATE product SET product_name = $1, base_price = $2, selling_price = $3, description = $4 WHERE product_id = $5 RETURNING division_id', [productName,
            basePrice,
            sellingPrice,
            productDescription,
            productId]);

        const division_id = update.rows[0].division_id;
        
        await db.query('UPDATE branch_storage SET quantity = $1 WHERE product_id = $2 AND branch_id = $3', [quantity, productId, branch]);

        req.flash('success', `${productName} updated Successfully!`)
        res.redirect(`/admin/products/viewProducts?id=${division_id}`);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}

export const updateProductImg = async (req, res)=>{
    try{
        const file = req.file;
            
        if(!file){
            return res.status(400).send("no image Uploaded");
        }
        const photoURL = `/image/productImg/${file.filename}`;
        const id = req.params.productId;
    
        const oldphoto = await db.query("SELECT image_url, product_name, division_id FROM product WHERE product_id = $1",[id]);
        const oldphotoUrl = oldphoto.rows[0].image_url;
        let productName = oldphoto.rows[0].product_name;
        let divisionId=oldphoto.rows[0].division_id;
        await db.query("UPDATE product set image_url = $1 where product_id=$2",[photoURL,id]);
        console.log(`image uploaded ${photoURL}`);
    
    
        console.log(oldphoto.rows[0].image_url);
        if(oldphoto){
            fs.unlink(__dirname+"../../../public"+oldphotoUrl,err=>{
                if(err){
                    console.log(`error deleting old photo ${err}`);
                }else{
                    console.log(`old photo deleted ${oldphotoUrl}`);
                }
            })
        }
       req.flash('success',`${productName}'s image Updated successfully! `)
       res.redirect(`/admin/products/viewProducts?id=${divisionId}`);  
        }catch(err){
            console.log(err);
        }
}

export const deleteProduct = async (req, res) => {
    const branch = req.user.branch_id;
    const productId = req.params.id;

    try {
        const product = await db.query('SELECT * FROM product WHERE product_id = $1', [productId]);
        const productName = product.rows[0].product_name;
        const division_id = product.rows[0].division_id;
        const remove = await db.query('DELETE FROM branch_storage WHERE product_id = $1 AND branch_id = $2 ', [productId, branch]);

        await db.query('DELETE FROM product WHERE product_id = $1', [productId]);

        req.flash('success', `${productName} deleted Successfully!`)
        res.redirect(`/admin/products/viewProducts?id=${division_id}`);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}


export const scheduleType = async (req, res) => {
    const category = req.params.category;
    const branch = req.user.branch_id;

    try {
      const scheduleQuery = `
        SELECT 
          w.name, 
          w.position, 
          ws.day_of_week, 
          st.shift_name
        FROM 
          worker AS w
        LEFT JOIN 
          worker_schedule AS ws ON w.worker_id = ws.worker_id
        LEFT JOIN 
          schedule_templates AS st ON ws.schedule_id = st.id
        WHERE 
          w.position = $1
          AND w.branch_id = $2
        ORDER BY 
          w.name,
          CASE 
            WHEN ws.day_of_week = 'Monday' THEN 1
            WHEN ws.day_of_week = 'Tuesday' THEN 2
            WHEN ws.day_of_week = 'Wednesday' THEN 3
            WHEN ws.day_of_week = 'Thursday' THEN 4
            WHEN ws.day_of_week = 'Friday' THEN 5
            WHEN ws.day_of_week = 'Saturday' THEN 6
            WHEN ws.day_of_week = 'Sunday' THEN 7
          END;
      `;

      const shiftNamesQuery = `SELECT shift_name FROM schedule_templates ORDER BY shift_name;`;

      const scheduleResults = await db.query(scheduleQuery, [category, branch]);
      const shiftNamesResults = await db.query(shiftNamesQuery);

      const scheduleData = {};
      scheduleResults.rows.forEach(row => {
        if (!scheduleData[row.name]) {
          scheduleData[row.name] = { schedule: {} };
        }
        scheduleData[row.name].schedule[row.day_of_week || ''] = row.shift_name || 'Off';
      });

      const shiftNames = shiftNamesResults.rows.map(row => row.shift_name);

      res.render('admin/schedule', { category, scheduleData, shiftNames });
    } catch (err) {
      console.error("Database query error:", err);
      res.status(500).send("Internal Server Error");
    }
};

export const schedule = (req, res) => {
    res.redirect('/admin/schedules/cashier');
}


export const saveSchedule = async (req, res) => {
    console.log("Incoming schedule data:", req.body);
    const category = req.params.category;
    const branch = req.user.branch_id;
    const scheduleData = req.body.schedule;
    
    try {
      for (const workerName in scheduleData) {
        const workerSchedule = scheduleData[workerName];
  
        // Get worker ID from the worker table
        const workerQuery = `SELECT worker_id FROM worker WHERE name = $1 AND position = $2 AND branch_id = $3 LIMIT 1`;
        const workerResult = await db.query(workerQuery, [workerName, category, branch]);
  
        if (workerResult.rows.length > 0) {
          const workerId = workerResult.rows[0].worker_id;
  
          // Loop through each day of the week for the current worker
          for (const day in workerSchedule) {
            const shiftName = workerSchedule[day] || 'Off';
  
            // Get schedule template ID for the shift name
            const scheduleTemplateQuery = `SELECT id FROM schedule_templates WHERE shift_name = $1 LIMIT 1`;
            const scheduleTemplateResult = await db.query(scheduleTemplateQuery, [shiftName]);
            
            const scheduleId = scheduleTemplateResult.rows.length > 0 ? scheduleTemplateResult.rows[0].id : null;
  
            // Check if a schedule already exists for this worker on this day
            const checkScheduleQuery = `
              SELECT id FROM worker_schedule 
              WHERE worker_id = $1 AND day_of_week = $2
            `;
            const existingScheduleResult = await db.query(checkScheduleQuery, [workerId, day]);
  
            if (existingScheduleResult.rows.length > 0) {
              // Update existing schedule
              const updateScheduleQuery = `
                UPDATE worker_schedule 
                SET schedule_id = $1 
                WHERE worker_id = $2 AND day_of_week = $3
              `;
              await db.query(updateScheduleQuery, [scheduleId, workerId, day]);
            } else {
              // Insert a new schedule
              const insertScheduleQuery = `
                INSERT INTO worker_schedule (worker_id, day_of_week, schedule_id) 
                VALUES ($1, $2, $3)
              `;
              await db.query(insertScheduleQuery, [workerId, day, scheduleId]);
            }
          }
        } else {
          console.warn(`Worker not found: ${workerName} in category: ${category}`);
        }
      }
  
      res.redirect(`/admin/schedules/${category}`);
    } catch (err) {
      console.error("Error saving schedule:", err);
      res.status(500).send("Internal Server Error");
    }
  };
  


  export const customers = async (req, res) => {
    try {
        // Get all the customer reviews with individual ratings
        const result = await db.query(`
            SELECT 
              c.name, 
              r.review_text, 
              r.review_date, 
              r.rating 
            FROM 
              customers c 
            JOIN 
              reviews r ON c.customer_id = r.customer_id
        `);

        const averageResult = await db.query(`
            SELECT AVG(r.rating) as overall_rating 
            FROM reviews r
        `);

        const overallRating = parseFloat(averageResult.rows[0].overall_rating).toFixed(1); // Round to 1 decimal place

        res.render("admin/customers", {
            reviews: result.rows,
            overallRating: overallRating,
            layout: "./layouts/admin"
        });
    } catch (err) {
        console.error("Error fetching customer reviews:", err);
        res.status(500).send("Internal Server Error");
    }
};

export const logout= (req, res) => {
    // Destroy the session or logout the user
    req.logout((err) => {
      if (err) {
        console.error('Error during signout:', err);
        return res.status(500).send('An error occurred during signout.');
      }
      req.session.destroy((sessionErr) => {
        if (sessionErr) {
          console.error('Error destroying session:', sessionErr);
          return res.status(500).send('An error occurred during session destruction.');
        }
        // Redirect to login or homepage
        res.clearCookie('connect.sid'); // Clear the session cookie
        res.redirect('/login'); // Replace with your login route
      });
    });
  };


export default dashboard;