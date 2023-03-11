import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
// const express = require("express"); // "type": "commonjs"
import express from "express"; // "type": "module"
import { MongoClient } from "mongodb";
import cors from "cors"
import usersRouter from './router/user.router.js';
import { auth } from "./middleware/auth.js";

const app = express();

const PORT = process.env.PORT;

const MONGO_URL = process.env.MONGO_URL;
export const client = new MongoClient(MONGO_URL); // dial
// Top level await
await client.connect(); // call
console.log("Mongo is connected !!!  ");

app.use(express.json());

app.get("/", function (request, response) {
  response.send("🙋‍♂️, 🌏Users crendetials 🎊✨🤩");
});



app.use(cors());
app.use("/user", usersRouter);

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
