import multer, { diskStorage } from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = diskStorage({
    destination:(req , file, cb)=>{
        const uploadedPath = path.join(__dirname,"../../public/image/profileImg")
        cb(null,uploadedPath);// where the file is saved 
    },
    filename: (req, file, cb)=>{
       
        cb(null,Date.now()+"-"+file.originalname); // add a date to the file name if there is two file in same name
    }
});

const fileFilter = (req, file, cb)=>{
    const filetype= /jpeg|jpg|png|gif/;
    const extname = filetype.test(path.extname(file.originalname).toLocaleLowerCase()); // check the extension if match
    const mimetype = filetype.test(file.mimetype); // test if the type match the allowed one 
    
    if(extname && mimetype){
        cb(null, true); // the file type match
    }else {
        cb(new Error("only images is allowed!!"), false);
    }

};

export  const uploadProfile = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
});

