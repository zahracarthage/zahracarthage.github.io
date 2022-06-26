const Manager = require("../model/Manager");
require("dotenv").config();
require("../config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const Token = require("../model/token.model");
const crypto = require("crypto");
const router = express.Router(); 

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
      const manager = await Manager.findOne({ email });
  
      if (manager && (await bcrypt.compare(password, manager.password))) {
        // Create token
        const token = jwt.sign(
          { manager_id: manager._id, email },
          process.env.TOKEN_KEY,
          {
            expiresIn: "2h",
          }
        );
  
        // save user token
        manager.token = token;
        console.log(token);
  
        // user
        res.status(200).json({manager,accessToken: token});
      }
      else  res.status(400).send("Invalid Credentials");
  
    } catch (err) {
      console.log(err);
    }
  });

  router.post("/register", async (req, res) => {
    // Our register logic starts here
    try {

      const { username, password, email, managerAt} = req.body;
  
      if (!(username && password && email)) {
        res.status(400).send("All input is required");
      }
      const oldUser = await Manager.findOne({ email });
  
      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }
  
      encryptedPassword = await bcrypt.hash(password, 10);
  
      const manager = await Manager.create({
        username,
        
        email: email.toLowerCase(), 

        password: encryptedPassword,
        managerAt
      });
  
      //Create token
      const token = jwt.sign(
        { manager_id: manager._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
      
      // save user token
      Manager.token = token;
      //user.user_id = id;
  
      // return new user
      res.status(201).json({manager,accessToken: token});
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });
  

  router.post("/getManagerDetails/", async(req,res)=> {
    try {

      // Get user input
      const email = req.body.email;
      const FoundUser = await Manager.findOne({ email });
      res.status(201).json({FoundUser});

    } catch (err) {
      console.log(err);
    }
     
  })

module.exports = router;
 
