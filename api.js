
var express = require("express");
let passport=require("passport");
let jwt = require("jsonwebtoken")
let JWTStrategy = require("passport-jwt").Strategy;
let ExractJWT=require("passport-jwt").ExtractJwt;
const app=express();
app.use(express.json());
app.use(function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"); 

  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  next();
});
var users=[
    {empCode:1451,name:"Jack",department:"Finance",designation:"Manager",salary:52500,gender:"Male"},
    {empCode:1029,name:"Steve",department:"Technology",designation:"Manager",salary:71000,gender:"Male"},
    {empCode:1891,name:"Anna",department:"HR",designation:"Manager",salary:55100,gender:"Female"},
    {empCode:1322,name:"Kathy",department:"Operations",designation:"Manager",salary:49200,gender:"Female"},
    {empCode:1367,name:"Bob",department:"Marketing",designation:"Manager",salary:39000,gender:"Male"},
    {empCode:1561,name:"George",department:"Finance",designation:"Trainee",salary:22500,gender:"Male"},
    {empCode:1777,name:"Harry",department:"Technology",designation:"Trainee",salary:31000,gender:"Male"},
    {empCode:1606,name:"Julia",department:"HR",designation:"Manager",Trainee:25100,gender:"Female"},
    {empCode:1509,name:"Kristina",department:"Operations",designation:"Trainee",salary:19200,gender:"Female"},
    {empCode:1533,name:"William",department:"Marketing",designation:"Trainee",salary:16200,gender:"Male"},
    {empCode:1161,name:"Stephen",department:"Finance",designation:"VP",salary:82500,gender:"Male"},
    {empCode:1377,name:"Winston",department:"Technology",designation:"VP",salary:91000,gender:"Male"},
    {empCode:1206,name:"Victoria",department:"HR",designation:"Manager",VP:65100,gender:"Female"},
    {empCode:1809,name:"Pamela",department:"Operations",designation:"VP",salary:78600,gender:"Female"},
    {empCode:1033,name:"Tim",department:"Marketing",designation:"VP",salary:66800,gender:"Male"},
    {empCode:1787,name:"Peter",department:"Technology",designation:"Manager",salary:47400,gender:"Male"},
    {empCode:1276,name:"Barbara",department:"Technology",designation:"Trainee",salary:21800,gender:"Female"},
    {empCode:1859,name:"Donna",department:"Operations",designation:"Trainee",salary:21900,gender:"Female"},
    {empCode:1874,name:"Igor",department:"Operations",designation:"Manager",salary:48300,gender:"Male"},
    ]
    app.use(passport.initialize());
    const port = 2410;
    app.listen(port,()=>console.log(`server started on ${port}!`));
    
    const param={
        jwtFromRequest:ExractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: "jwtsecret23647832",
    };
    const jwtExpirySeconds=300;
    
    let StrategyAll=new JWTStrategy(param,
        function(token,done){
        console.log("In JWTStrategy-all",token);
        let user1=users.find(u=>u.empCode===token.empCode)
        console.log("user",user1);
        if(!user1)
        return done(null,false,{message:"Incorrect name or empCode"});
      else return done(null,user1);
    });
    passport.use("roleAll",StrategyAll);

    app.post("/login", function(req,res){
        let {name,empCode}=req.body;
        let user=users.find((u)=>u.name==name && u.empCode==empCode);
        if(user){
          let payload={empCode:user.empCode};
          let token=jwt.sign(payload,param.secretOrKey,{
            algorithm:"HS256",
            expiresIn:jwtExpirySeconds,
          });
          res.send( token);
         //res.send({token : "bearer " + token});
        }
        else res.sendStatus(401);
      });
      
      app.get("/mydetails", passport.authenticate("roleAll",{session:false}),
      function(req,res){
          console.log("In GET /mydetails",req.user)
          res.send(req.user);
        });

      app.get("/company",passport.authenticate("roleAll",{session:false}),
      function(req,res){
      if(req.user){
              res.send("Welcome to the Employee Portal of XYZ Company");
      }
      }) 

      app.get("/myJuniors",passport.authenticate("roleAll",{session:false}),
      function(req,res){
        console.log("req.user",req.user)
   
        data=[]
    
    if(req.user.designation=="VP"){
data=users.filter((u)=>u.designation.includes("Manager") || u.designation.includes("Trainee"));
res.send(data);
    }
    else if(req.user.designation=="Manager"){
        data=users.filter((u)=>u.designation=="Trainee");
        res.send(data);
    }
    else if(req.user.designation=="Trainee"){
      data=[]
      res.send(data);
    }
  
    })



   /*
    app.get("/tracker", function(req,res){
        let tracker=req.signedCookies.tracker;
        console.log(tracker,"tracker1")
       if(tracker){
            res.send(tracker)
       }
       else{
       
        res.cookie(
            "tracker",
            {users:"Guest",url:req.url,date: new Date()},
            {signed:true}
        )
        res.send({users:"Guest",url:req.url,date: new Date()})
       }
    })
    
     
*/