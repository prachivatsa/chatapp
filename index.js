const express = require("express");
const app = express();
app.use(express.json());
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwtoken = require("jsonwebtoken")
const con = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "root@123",
   database: "nodejs",
 });
 con.connect(function(err) {
   if (err) throw err;
   app.listen(4000,()=>{
       console.log("Server started at 4000 port");
   })
 });




// GET user list


app.get("/users",async (request,response) => {
 //sconsole.log(request)
 const dbQuery = `select * from  users ORDER BY id;`;
  await con.query(dbQuery,(err,data) => {
   if (err) {
     console.log("error",err);
   }
   else {
   response.send(data);}
 });
});


// User  register API
app.post("/register",async (request,response) => {
 const{name,username,password} = request.body;
 const hashpassword = await bcrypt.hash(password,10);
 const checkUser = `SELECT * FROM users where username='${username}'`;
 console.log(checkUser);
 await con.query(checkUser, (err, result) => {
    if (err) {
      console.log('error', err);
    }
    else if ((Object.keys(result).length) === 0) {
      console.log(username);
      response.send("new user can be added");
    };
    {
      response.send("Username already exist");
    }
  });
 });


// Login User API
app.post("/loginuser",async (request,response) => {
  const{username,password} = request.body;
  const hashpassword = await bcrypt.hash(password,10);
  const checkUser = `SELECT * FROM users where username='${username}'`;
  await con.query(checkUser,(err,result,fields) => {
    if (err) throw err;
    console.log(fields);
  });
   
});
//get users chatinformation "ChatRoom"
app.get("/chatroom",async (request,response) => {
  let jwtoken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined){
    jwtoken=authHeader.split(" ")[1];
  }
  if(authHeader === undefined){
    response.status(401);
    response.send("Invalid JWS Token");
  }
  else{
     jwtoken.verify(jwtoken,"sachinsharma",async(error,payload)=>{
      if (error){
        response.send("Invalid Access Token");
      }
      else{
        const dbQuery = `select * from  chatroom ORDER BY id;`;
        await con.query(dbQuery,(err,data) => {
         if (err) {
           console.log("error",err);
         }
         else {
         response.send(data);}
       });
      }
     })
  }
 
});




// Add new Chat "ChatBox"
app.post("/newchat",async (request,response) => {
const{username,chat} = request.body;
 //const hashpassword = await bcrypt.hash(password,10);
const dbQuery = `INSERT INTO chatroom
 (username,chat)
 VALUES ('${username}','${chat}')`;
await con.query(dbQuery,(err,username) => {
   if (err){
     console.log('errr',err);
   }
   else{
     response.send("chat updated");
   }
 });
 });


 //Authentication user API


app.post("/authenticatuser",async (request,response) => {
const{username,password} = request.body;
const hashpassword = await bcrypt.hash(password,10);
const dbQuery = ` SELECT username from users where username='${username}`;
if (dbQuery == true){
  const matchPassword= await bcrypt.compare(password,dbQuery.password);
  if(matchPassword==true){




  }
  else{
    response.send("Invalid Password Try Again");
  }
}
else{
  response.send("User not Found");
}
await con.query(dbQuery,(err,username) => {
   if (err){
     console.log('errr',err);
   }
   else{
     response.send("chat updated");
   }
 });
 });