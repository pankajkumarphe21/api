import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import admin from "../config/firebase.js";
import bcrypt from 'bcryptjs';

export const loginByFirebase = async (req, res) => {
    try {
        // idToken needs to be taken from firebase
        const { idToken } = req.body;
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const {email } = decodedToken;
        let user=await userModel.findOne({email});
        if(!user){
            return res.status(400).json({message:"You are not registered with us"})
        }
        const token = jwt.sign({ uid:user._id, email }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.cookie("token",token);
        res.json({
            message: "User authenticated successfully",
            token,
            user: { userId:user._id, email }
        });
    } catch (error) {
        // console.error(error);
        res.status(401).json({ error: "Invalid ID token" });
    }
}

export const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const existingUser=await userModel.findOne({email}).select('+password');
        if(!existingUser){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        const isCorrect =await bcrypt.compare(password,existingUser.password);
        if(!isCorrect){
            return res.status(400).json({message:"Invalid Credentials"});
        }
        return res.status(200).json({user:{email,userId:existingUser._id}});
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error",error});
    }
}

export const registerUser=async(req,res)=>{
    try {
        const {email,firstName,lastName,password}=req.body;
        const existingUser=await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already registered"});
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user=await userModel.create({email,firstName,lastName,password:hash});
        return res.status(200).json({user:{email,userId:user._id}});
    } catch (error) {
        return res.status(500).json({message:"Internal Server Error",error});
    }
}