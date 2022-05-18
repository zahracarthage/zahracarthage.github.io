const http = require("http");
const express = require('express');

const app=express();

const server = http.createServer(app);
const bodyParser = require('body-parser');

//app.use(express.json());
app.use(bodyParser.json());


const userRouter = require('./routes/user');
const ManagerRouter = require('./routes/Manager')
app.use('/user', userRouter);
app.use('/manager',ManagerRouter)


const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

// server listening 
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
