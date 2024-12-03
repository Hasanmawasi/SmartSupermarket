import passport from "passport";
import bcrypt from "bcrypt";
import { Strategy} from "passport-local";
import db from "../config/db.js";


export const AdminStrategy =new Strategy({ usernameField: 'Admin_id', passwordField: 'Admin_password' },async function verfy(AdminId, password, cb) {
  
    try{
        const result = await db.query("SELECT * FROM worker where worker_id = $1 " ,[AdminId]);
    
        if(result.rows.length >0){
            const admin = result.rows[0];
            const storedHashedPassword = admin.password;
            bcrypt.compare(password, storedHashedPassword,(err, vailed)=>{
                if(err){
                    console.error("error comparing password: ",err);
                    return cb(err);
                }else {
  
                    if(vailed){
                        //pass the password check
                        console.log("user founded!!")
                        return cb(null, admin);
                    }else {
                        console.log("wrong password!!")
                        return cb(null, false);
                    }
                }        
            })
        }else{
            return cb("Admin not found")
        }
    }catch (err){
        console.log(err);
    }
  })



export default AdminStrategy;