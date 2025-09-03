//here we start k hmary server pr file rakhe hui h multerf k through abhe agy ka kam krna h 
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


    // Configuration
    cloudinary.config({ 
        cloud_name:  process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET 
    });
     // Upload an image
     const uplaodOnCloudinary = async(localFilePath)=>{
        try{
            if(!localFilePath)return null
        //uploead the file
          const response=await  cloudinary.uploader
       .upload(localFilePath
           , {
               resource_type:"auto"
           }
       )

       console.log( response.url,"file is uploaded on cloudinary");
       return response;
        }
     //file has uploeded successfullly
     
       catch(error) {
        fs.unlinkSync(localFilePath)//remove the locally save temporary file as the upload operator gone failed

           console.log(error,"file upload error");
       }}
    
    export {uplaodOnCloudinary};
    


