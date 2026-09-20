import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { appRouter } from "./src/app.router.js";
import { connectDB } from "./DB/connection.js";
const app = express();
const port = process.env.PORT;

//DB
connectDB();

//Routing
appRouter(app, express);

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
