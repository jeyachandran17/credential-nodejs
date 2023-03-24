import { client } from "../index.js";
import express from "express"; // "type": "module"
import nodemailer from "nodemailer"
const router = express.Router();
import jwt from "jsonwebtoken";

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>  Needs to this one >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// create link to send email

router.post("/forgot-password", async function (request, response) {
    const { email } = request.body;
    const olduser = await client.db('b42wd2').collection('credential').findOne({email:email})
    
    try {
        if(!olduser){
            return response.status(401).send({"message": "email not found"})
        }

        // program to generate random strings

        // declare all characters
        const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        function generateString(length) {
            let result = '';
            const charactersLength = characters.length;
            
            for (let i = 0; i < length; i++) {
                result+=characters.charAt(Math.floor(Math.random()*charactersLength));
            }
            return result;
        }
        
        const randomstring = generateString(5)
        const randomstringsend = await client.db('userdata').collection('userdetails').updateOne({email:email},{$set:{random:randomstring}})
        
        const secret = process.env.SECRET_KEY + olduser.password
        console.log("random :", randomstring);
        
        const token = jwt.sign({ email: olduser.email, id: olduser._id }, secret, {
            expiresIn:"5m"
        })

        const links = `http://localhost:5173/users/reset-password?id=${olduser._id}&token=${token}&random=${randomstring}`
        // console.log(links)
        
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "jeyachandran1733@gmail.com", // generated ethereal user
                pass: process.env.GPASS, // generated ethereal password
            },
        });

        var mailoption ={
            from: 'jeyachandran1733@gmail.com', // sender address
            to: "suriya173300@gmail.com", // list of receivers
            subject: "reset password✔", // Subject line
            text: links,
        }
        
        // send mail with defined transport object
        transporter.sendMail(mailoption, function (err,info){
            if(err){
                console.log(err);
            }
            else{
                console.log("email sent",info.response);
            }
        })
        response.send(randomstringsend)
    }
    catch (err) {
        console.log(err);
    }
});

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export default router;

