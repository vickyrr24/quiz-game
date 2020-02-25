var express = require('express');
var app = express();
var fs = require("fs");
const bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://siddhant:siddhant@cluster0-bsv3p.mongodb.net/test?retryWrites=true&w=majority";
var log = '';
app.listen(3000, function() {

    console.log('Hey there from the server')
    
    })
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/landing', function(req, res) {

    res.render("adminquizarea.ejs");
    
})
app.get('/', function(req, res) {
  res.render("loginarea.ejs");
  
})

// Admin Login Command starts here---

app.post('/myadminlogin', function(req, res) {
  var login = req.body.adminname;
  var pass = req.body.psw;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("tryquiz");
    var query = {login_id:login,password:pass};
    dbo.collection("Login_Details").find(query).toArray(function(err, logon) {
      console.log(logon);
      if(logon.length === 0 ){
        res.render("loginarea.ejs");
      }else {
        if (logon[0].login_id === login && logon[0].password === pass) 
        {
          res.render("adminquizarea.ejs");
        }
        console.log(err)
      }
      db.close();
    });
  });
})

//------------

app.post('/myaction', function(req, res) {
  var question=req.body.qname;
  var opt1=req.body.opt1;
  var opt2=req.body.opt2;
  var opt3=req.body.opt3;
  var opt4=req.body.opt4;
  var option=[opt1,opt2,opt3,opt4];
  var answer=req.body.answer;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("tryquiz");
    var myobj = { questions: question, options:option,answer:answer};
    dbo.collection("questions").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      //res.send(`Fully inserted...`);
      db.close();
    });
  });
  res.render("adminquizarea.ejs");
  // res.send(`OUTPUT: ${req.body.qname} ${req.body.opt1} ${req.body.opt2} ${req.body.opt3} ${req.body.opt4} ${req.body.answer}.`);
})

// Admin Login Command ends here--

// User Login Command starts here--

app.post('/userlogin', function(req, res) {
  res.setHeader('Content-Type', 'text/javascript');
  var login = req.body.uname;
  var pass = req.body.psrd;
  let ts = new Date(Date.now()).toLocaleString();
  var info={};
  var count=0;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("User_DB");
    var mdb=db.db("tryquiz");
    var query = {login_id:login,password:pass};
    dbo.collection("User_Login_Details").find(query).toArray(function(err, logins) {
      //console.log(logins);
      if(logins.length === 0 ){
        res.render("loginarea.ejs");
      }else {
        if (logins[0].login_id === login && logins[0].password === pass) 
        {
          count=count+1;
          console.log(ts);
          res.redirect('/userquizarea');
          if(count>0){
            mdb.collection("Login_Date_Time").insertOne(info, function(err, resul) {
            if (err) throw err;
            console.log("1 Login_Date_Time inserted");
            //console.log(err);
            db.close();
          }); 
        }
        }
      }
      db.close();
    });
  });
})

// User Login Command ends here--

// User Signup Command starts here--
app.get('/logdetails',function(req,res){
  res.send(result);
})
app.post('/usersignup', function(req,res){
  var name=req.body.name;
  var email=req.body.email;
  var userid=req.body.userid;
  var pswd=req.body.pswd;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("User_DB");
    var myobj = {name:name, email:email,login_id:userid,password:pswd};
    dbo.collection("User_Login_Details").insertOne(myobj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      res.render("loginarea.ejs")
      db.close();
    });
  });
})

// User Signup Command ends here--

//Trial Database top fetch data--

app.get('/node',function(req,res){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("tryquiz");
            var query = { };
            dbo.collection("questions").find(query).toArray(function(err, data) {
              if (err) throw err;
              res.send(data);
              db.close();
            });
    });
})

// Logout Commands starts here

app.get('/logout', function(req,res){
  console.log("Logged Out Successfully!");
  req.logout();
  res.redirect('/');
  //res.render("loginarea.ejs");
})

// Logout Commands ends here

//User attend Quiz Command area starts here---
app.get('/userquizarea', function(req, res) {

  res.render("userquizarea.ejs");
})
app.get('/quizarea',function(req,res){
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("tryquiz");
      var query = { };
      dbo.collection("questions").find(query).toArray(function(err, data) {
        if (err) throw err;
        res.send(data);
        db.close();
      });
});
})
//User attend Quiz Command area ends here---

// user details area starts here---

app.get('/showuser',function(req,res){
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("User_DB");
      var query = { };
      dbo.collection("User_Login_Details").find(query).toArray(function(err, data) {
        if (err) throw err;
        res.send(data);
        db.close();
      });
});
})

// user details area ends here---