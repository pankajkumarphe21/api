import mongoose from "mongoose";

export default async function connectDb(){
    await mongoose.connect(process.env.MONGODB_URI).then(()=>{
        console.log('connected');
    }).catch((err)=>{
        console.log('error: ',err);
    })
}