import pkg from 'jsonwebtoken'
import {config} from 'dotenv'
const {verify}=pkg
config()

export const verifyToken=(req,res,next)=>{

    let token=req.cookies.token
    console.log(req.cookies)
    if(!token){
        res.status(401).json({success:false,message:"Unauthorized access"})
    }else{
        try{
       let decodedUserObj= verify(token,process.env.SECRET_KEY)
       req.user=decodedUserObj;
       next()}
       catch(err){
        res.json({success:false,message:"Session expired. Relogin to continue"})
       }
    }
}