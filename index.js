import express from "express";
import cors from 'cors';
import connectDb from "./db/db.js";
import dotenv from "dotenv";
import morgan from "morgan";
import userRoutes from './routes/user.route.js';

const app=express();

dotenv.config();

connectDb();

app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(morgan('dev'));

app.use('/auth',userRoutes);

app.listen(8800);