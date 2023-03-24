import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()
// const express = require("express"); // "type": "commonjs"
import express from "express"; // "type": "module"
import { MongoClient } from "mongodb";
import cors from "cors"
import usersRouter from './router/user.router.js';
import forgetPasswordRouter from './router/forgetPassword.js';
import { auth } from "./middleware/auth.js";

const app = express();
app.use(cors());
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

app.get("/userurls", async function (request, response) {
  const urls = await client.db("b42wd2").collection('credential').find({}).toArray();
  response.send(urls);
  // console.log(urls)
})

app.put("/user/:email", async function (request, response) {
  const { email } = request.params;
  const data = request.body;
  // console.log(data);
  // console.log(id);

  const result = await client.db("b42wd2").collection("credential").updateOne({ email: email }, { $set: data }); 
  response.send(result);
})



app.use("/user", usersRouter);
app.use("/user", forgetPasswordRouter);

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
