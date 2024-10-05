import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import cookieParser from "cookie-parser";
import connectDB from "./database.js";
import { route } from "../routes/route.js";

dotenv.config()

export const app = express();

connectDB()
app.use(express.json())
app.use(cors())
app.use(cookieParser())

app.use(route)