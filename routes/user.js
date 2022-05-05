const User = require("../model/user");
require("dotenv").config();
require("../config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const sendEmail = require("../utils/email/sendEmail");
const Token = require("../model/token.model");
const crypto = require("crypto");
const router = express.Router(); 
const multer = require('multer');


const storage = multer.diskStorage({
  destination: function(req,file,cb) {
      cb(null,'./images/');

  },
  filename: function(req,file,cb){
      console.log(file.originalname);
          cb(null,file.originalname);

  },
})
const upload = multer({storage:storage}).single('image');




router.post("/getUserDetails/", async(req,res)=> {
  try {
    // Get user input
    const email = req.body.email;

    const FoundUser = await User.findOne({ email });

    res.status(201).json({FoundUser});
  } catch (err) {
    console.log(err);
  }
   
})

router.get("/getAllUsers", async(req,res) => {
    try{
        const Users = await User.find(); 
        res.json(Users); 
    }
    catch(err)
    {
        res.json({message: err});
    }

}
)

router.post("/Login", async (req, res) => {

  // Our login logic starts here
  try {
    // Get user input
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;
      console.log(token);

      // user
      res.status(200).json({user,accessToken: token});
    }
    else  res.status(400).send("Invalid Credentials");

  } catch (err) {
    console.log(err);
  }
});

router.post("/register", async (req, res) => {
    // Our register logic starts here
    try {
      const { username, password, email, followers, following, posts} = req.body;
     // const picture = req.file.path;

      // Validate user input
      if (!(username && password && email)) {
        res.status(400).send("All input is required");
      }
  

      const oldUser = await User.findOne({ email });
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }
  
      encryptedPassword = await bcrypt.hash(password, 10);
  
      const user = await User.create({
        username,
        followers,
        following,
        posts,
        phoneNumber,
        email: email.toLowerCase(), 

        password: encryptedPassword,
      });
  
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      // save user token
      user.token = token;
      user.user_id = id;
  
      // return new user
      res.status(201).json({user,accessToken: token});
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });

  router.put("/update/:email", async(req,res) => 
  {

  User.findOneAndUpdate(req.params.email, {
      username: req.body.username,

      phoneNumber: req.body.phoneNumber
  }, {new: true})
  .then(User => {
      if(!User) {
          return res.status(404).send({
              message: "Note not found with email " + req.params.email
          });
      }
      res.send(User);
  }).catch(err => {
      if(err.kind === 'email') {
          return res.status(404).send({
              message: "Note not found with email " + req.params.email
          });                
      }
      return res.status(500).send({
          message: "Error updating note with email " + req.params.email
      });
  });
});
  


  router.post("/requestRestPassword", async (req, res) => {
    try {
        const schema = Joi.object({ email: Joi.string().email().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send("user with given email doesn't exist");
        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }
        //const text = `Iyum://reset-password/${user._id}/${token.token}`;
        const text = `https://zahracarthage.github.io/${user._id}/${token.token}`
        await sendEmail(user.email, "Password reset", text);
        res.send("password reset link sent to your email account");

    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
});

router.post("/:userId/:token", async (req, res) => {
    try {
        const schema = Joi.object({ password: Joi.string().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send("invalid link or expired");

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link or expired");  console.log("Invalid link")

        user.password = await bcrypt.hash(req.body.password, 10);

        await user.save();
        await token.delete();

        res.send("password reset sucessfully.");
        console.log("password resent successfully")
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
});
  module.exports = router;
