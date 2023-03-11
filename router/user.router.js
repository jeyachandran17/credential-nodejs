import express from "express"; 
const router = express.Router();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getUserByName,createUser } from "../service/user.service.js";

async function generateHashedPassword(password) {
  const NO_OF_ROUNDS = 10;
  const salt = await bcrypt.genSalt(NO_OF_ROUNDS);
  const hashedPassword = await bcrypt.hash(password,salt);
  // console.log(salt);
  // console.log(hashedPassword);
  return hashedPassword; 
}

// signup - message  - signup successfully | Username already exists

router.post("/signup",async function (request, response) {
  const { username, email, password } = request.body;

  const userFromDB = await getUserByName(email);
  console.log(userFromDB);

  if (userFromDB) {
    response.status(400).send({ message: "User is already exists" });
  }
  else if(username.length < 3) {
    response.status(401).send({ message: "Username must be at least 3 characters" });
  }
  else if(password.length < 6) {
    response.status(401).send({ message: "Password must be at least 6 characters" });
  }
  else {
    const hashedPassword = await generateHashedPassword(password); // call the generateHashedPassword
    const result = await createUser({
        username: username,
        email : email,
        password: hashedPassword
    });
    response.send(result);
  }
})


// login - message  - login successfully | Invalid credentials

router.post("/login",async function (request, response) {
  const { email, password } = request.body;

  const userFromDB = await getUserByName(email);
  console.log(userFromDB);

  if (!userFromDB) {
    response.status(401).send({ message: "Invalid credentials" });
  }
  else {
    const storedDBPassword = userFromDB.password;
    const isPasswordCheck = await bcrypt.compare(password, storedDBPassword);
    console.log(isPasswordCheck);
    if (isPasswordCheck) {
      const token = jwt.sign({ id: userFromDB._id }, process.env.SECRET_KEY);
      response.send({ message: "Successfully login",token:token });
    }
    else {
      response.status(401).send({ message: "Invalid credentials" });
    }
  }
})

export default router;