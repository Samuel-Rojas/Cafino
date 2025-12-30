import express from "express"
import dotenv from 'dotenv';
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

connectDB();

app.get("/", (req, res) => {
    res.send('get endpoint works');
})

app.listen(port, () => {
    console.log(`Server has started on port: ${port}`);
})