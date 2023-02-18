const express =require("express");
const router=express.Router();
const User=require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET ="Rohitisvery$Rich";

//ROUTE 1 : Create a User using:POST "/api/auth/createUser" . No login required
router.post('/createUser',[
    body('name','Enter a Valid Name').isLength({ min: 3 }),
    body('email','Enter a valid email').isEmail(),
    body('password','Pasaword must be atleast 5 characters').isLength({ min: 5 })

],async (req,res)=>{
    let success=false;
    //If there are errors, return Bad request and the Errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
    }
    let user=await User.findOne({email: req.body.email});
    try{
        //Check whether the user with this email exists already
    if(user){
    return res.status(400).json({success, error:"Sorry ,A user with this email already exists"})
    }
    const salt =await bcrypt.genSalt(10);
    secPass=await bcrypt.hash(req.body.password,salt); 
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password:secPass ,
    })

    const data={
        user:{
            id: user.id
        }
    }
    const authtoken=jwt.sign(data,JWT_SECRET);
    
    //res.json(user)
    success=true;
    res.json({success,authtoken})
    }
    catch(error){
        //console.error(error.message);
        res.status(500).send("Some Error ocurred");
    }
})


//ROUTE 2 : Authenticate  a User using:POST "/api/auth/login" . No login required
router.post('/login',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password can not be Blank').exists()
],async (req,res)=>{
    let success=false;
    //If there are errors, return Bad request and the Errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    }

    const {email,password}= req.body;
    try {
        let user=await User.findOne({ email});
        if(!user){
            success=false;
            return res.status(400).json({success, errors:"Please Try to Login with correct credentials"});
        }

        const passwordCompare=await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            success=false;
            return res.status(400).json({success,errors:"Please Try to Login with correct credentials"});
        }

        const data={
            user:{
                id: user.id
            }
        }
        const authtoken=jwt.sign(data,JWT_SECRET);
        success=true;
        res.json({success,authtoken})

    } catch(error){
        //console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});



//ROUTE 3 : Get logged in User deatails using:POST "/api/auth/getuser" . Login required
router.post('/getuser', fetchuser , async (req,res)=>{
try {
    userId=req.user.id;
    const user= await User.findById(userId).select("-password");
    res.send(user);
} catch(error){
    //console.error(error.message);
    res.status(500).send("Internal Server Error");
}
})
module.exports = router;