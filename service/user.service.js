import { client } from '../index.js';


export async function createUser(data) {
  return await client.db("b42wd2").collection("credential").insertOne(data); 
}

export async function getUserByName(email) {
  return await client.db("b42wd2").collection("credential").findOne({ email : email });
}

export async function updatePassword(email, data) {
  return await client.db("b42wd2").collection("credential").updateOne({ email: email}, { $set: data });
}