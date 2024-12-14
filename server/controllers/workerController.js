import db from "../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { io } from "../../app.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const about = (req, res) => {
  res.render("worker/about", {
    layout: "./layouts/worker",
  });
};

export const home = (req, res) => {
  res.render("worker/home", {
    layout: "./layouts/workerHome",
  });
};

export const log = async (req, res) => {
  const workerId = req.user.worker_id;

  try {
        const { rows } = await db.query(`
      SELECT ws.day_of_week, st.start_time, st.end_time, st.status
      FROM worker_schedule ws
      JOIN schedule_templates st ON ws.schedule_id = st.id
      WHERE ws.worker_id = $1
      ORDER BY 
        CASE ws.day_of_week
          WHEN 'Monday' THEN 1
          WHEN 'Tuesday' THEN 2
          WHEN 'Wednesday' THEN 3
          WHEN 'Thursday' THEN 4
          WHEN 'Friday' THEN 5
          WHEN 'Saturday' THEN 6
          WHEN 'Sunday' THEN 7
        END;`, 
      [workerId]
    );

    const formattedSchedule = rows.map(row => ({
      ...row,
      start_time: formatToAmPm(row.start_time),
      end_time: formatToAmPm(row.end_time)
    }));

    res.render("worker/daily-log", {
      layout: "./layouts/worker",
      schedule: formattedSchedule,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
function formatToAmPm(time24) {
  if (!time24) return '-'; // Handle NULL or empty time
  const [hours, minutes] = time24.split(':');
  let hoursNum = parseInt(hours, 10); // Convert to integer
  const period = hoursNum >= 12 ? 'PM' : 'AM';
  hoursNum = hoursNum % 12 || 12; // Convert 0, 12, 13, 14, etc., to 12-hour format
  return `${hoursNum}:${minutes} ${period}`;
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
        }}

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
        }
export const sendReport = async (req, res) => {
  const workerId = req.user.worker_id;
  const branchId = req.user.branch_id;
  const report_title = req.body.reportTitle;
  const report_content = req.body.reportContent;
  const recipient = `${branchId}-admin`;
  const report_date = new Date().toISOString().slice(0, 10);

  if (!report_title || !report_content) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const result = await db.query(
      "INSERT INTO reports(report_date, report_title, report_body, recipient, worker_id) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [report_date, report_title, report_content, recipient, workerId]
    );
    res
      .status(201)
      .json({ message: "Report added successfully!", report: result.rows[0] });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Database error occurred!" });
  }
};

export const submitArrival = async (req, res) => {
  const { type } = req.body;
  const workerId = req.user.worker_id;
  const branch = req.user.branch_id;
  const status = 'pending';
  let arrivalStatus;

  try {
    const currentTimestamp = new Date();
    const currentTime = currentTimestamp.toTimeString().split(' ')[0];
    const logDate = currentTimestamp.toISOString().split("T")[0];
    if (type === "arrival") {
     await db.query(
        `INSERT INTO dailylog (log_date, log_status, arrival_time, worker_id, branch_id) VALUES ($1, $2, $3, $4, $5) ;`,
        [logDate, status, currentTime, workerId, branch]
      );
     
      let log =  await db.query(`SELECT dailylog.arrival_time, worker.name, worker.image_url, worker.worker_id
                                FROM dailylog
                                JOIN worker ON dailylog.worker_id =worker.worker_id
                                WHERE dailylog.worker_id = $1 AND log_status=$2;`,
       [workerId,status]);
      //  console.log(log);
      io.emit('new-log', log.rows[0]);
      const result = await db.query('SELECT log_status FROM dailylog WHERE log_date = $1 AND worker_id = $2', [logDate, workerId]);
      arrivalStatus = result.rows[0].log_status;
      console.log(arrivalStatus);
    }
 
    res.render('worker/daily-log', {
        layout: "./layouts/worker",
        a_status: arrivalStatus,
        message: `Arrival log is ${arrivalStatus}`
    });
  } catch (error) {
    console.error("Error logging time:", error);
    res.render("worker/daily-log", {
      layout: "./layouts/worker",
      message: "An internal error occurred. Please try again.",
    });
  }
};

export const submitDeparture= async (req, res) => {
  const { type } = req.body;
  const workerId = req.user.worker_id;
  const branch = req.user.branch_id;
  const status = 'pending';
  let arrivalStatus;
  let departureStatus;


  try {
    const currentTimestamp = new Date();
    const currentTime = currentTimestamp.toTimeString().split(' ')[0];
    const logDate = currentTimestamp.toISOString().split("T")[0];

    const result = await db.query('SELECT log_status FROM dailylog WHERE log_date = $1 AND worker_id = $2', [logDate, workerId]);
    arrivalStatus = result.rows[0].log_status;
    console.log(arrivalStatus);
    
    if (type === "departure") {
      if(arrivalStatus == 'accepted'){
        const result = await db.query(
          `UPDATE dailylog
          SET leaving_time = $1, departure_time = $2
          WHERE log_date = $3 AND worker_id = $4 AND log_status = 'accepted'`,
          [currentTime, status, logDate, workerId]
        );
        let departure =  await db.query(`SELECT dailylog.leaving_time, worker.name, worker.image_url, worker.worker_id
          FROM dailylog
          JOIN worker ON dailylog.worker_id =worker.worker_id
          WHERE dailylog.worker_id = $1 AND departure_time=$2;`,
          [workerId,status]);
        console.log(departure);
        io.emit('new-departure', departure.rows[0]);
        const result2 = await db.query('SELECT departure_time FROM dailylog WHERE log_date = $1 AND worker_id = $2', [logDate, workerId]);
        departureStatus = result2.rows[0].departure_time;
        // console.log(result2.rows[0]);
        console.log(departureStatus);
        res.render('worker/daily-log', {
          layout: "./layouts/worker",
          d_status: departureStatus,
          message: `Departure log ${departureStatus}`,
        });
      } else {
      res.json(`Your arrival log should been accepted before loging your departure! current status: ${arrivalStatus}`)
      }}
  } catch (error) {
    console.error("Error logging time:", error);
    res.render('worker/daily-log', {
      layout: "./layouts/worker",
      message: "An internal error occurred. Please try again.",
    });
  }
};

export const logout = (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error logging out' });
        }
        // Redirect to the login page
        res.redirect('/login');
    });
};