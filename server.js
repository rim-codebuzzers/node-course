const express=require('express');
const hbs=require('hbs'); //handlebars
const fs=require('fs');

////////////////////////////////
const router=require('router');
var mysql = require("mysql");
var bodyParser = require('body-parser');
var yyyymmdd = require('yyyy-mm-dd');
var sha1 = require('sha1');
var empty = require('is-empty');
const isset = require('isset');
var http = require('http');
var url = require('url') ;
//////////////////////////////////
const port=process.env.PORT || 3000;

var app=express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine','hbs');
// app.use(express.static(__dirname + '/public'));

///////////////////////////////////////////
//Database connection
app.use(function(req, res, next){
  global.connection = mysql.createConnection({
    // host     : 'localhost',
    host     : 'phpmyadmin.codebuzzers.com',
    user     : 'root',
    password : 'yZb0P4cG19bgBWmqUCvVvVS8rFehvnVQxOLlMKct0plBeUWI1e_zLXQ',
    // password : 'PassWord!@#123',
    database : 'postapp'
  });
  connection.connect();
  next();
});
///////////////////////////////////////////

app.use((req,res,next)=>{
  var now=new Date().toString();
  // console.log(`${now}: ${req.method} ${req.url}`);
  var log=`${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log',log + '\n',(err)=>{
    if(err)
    {
      console.log("Unable to append to Server.log");
    }
  });
  next();
});

// app.use((req,res,next)=>{
//   res.render('maintenance');
// });

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

hbs.registerHelper('getCurrentYear',()=>{
  return new Date().getFullYear();
  // return 'text';
});

hbs.registerHelper('screamIt',(text)=>{
  return text.toUpperCase();
});

app.get('/postapp',(req,res)=>{
  // res.send("<h1>Hello Express!</h1>");
  // res.send({
  //   name:"Rima",
  //   likes:[
  //     'Dancing',
  //     'Coding'
  //   ]
  // });
  res.render('home.hbs',{
    pageTitle:"Home Page",
    // currentYear:new Date().getFullYear(),
    welcomeMessage:"Welcome to the home page..."
  })
});

app.get('/postapp/about',(req,res)=>{
  // res.send("About Page");
  res.render('about.hbs',{
    pageTitle:'About Page',
    // currentYear:new Date().getFullYear(),
    welcomeMessage:"Welcome to the about page..."
  });
});

app.get('/postapp/project',(req,res)=>{
  res.render('project.hbs',{
    paragraph:'Portfolio page is here...',
    pageTitle:"Project Page"
  });
});

app.get('/postapp/bad',(req,res)=>{
  res.send({
    status:'001',
    errorMessage:"Unable to fullfill the request."
  });
});

////////////////////////////////////
// app.use('/api/v1/users',users);
app.get('/postapp/api/v1/offers', function(req, res, next) {
  connection.query('SELECT * from pa_offer', function (error, results, fields) {
    if (error) throw error;
    if(results.length!=0)
	{
    	res.send(JSON.stringify({"status": 1, "message": "Offer List", "offers": results}));
    }
    else
    {
    	res.send(JSON.stringify({"status": 2, "message": "No Offer Available"}));
    }
  });
});
///////////////////////////////////////

app.post('/postapp/api/v1/signup', function(req, res, next) {
	// res.send(JSON.stringify({"status": 200, "error": null, "response": req.body.name}));
	if(empty(req.body.name) || empty(req.body.email) || empty(req.body.password) || empty(req.body.mobile))
	{
		res.send(JSON.stringify({"status": 0, "message": "No Data Found"}));
	}
	else
	{
		var name=req.body.name;
		var email=req.body.email;
		var password=sha1(req.body.password);
		var mobile=req.body.mobile;
		connection.query("SELECT * from pa_user where email='"+email+"'", function (error, results, fields) {
			if (error) throw error;
		    if(results.length!=0)
		    {
		    	res.send(JSON.stringify({"status": 2, "message": "Email Already Exists"}));
		    }
		    else
		    {
		    	connection.query("SELECT * from pa_user where mobile='"+mobile+"'", function (error, result, fields) {
					if (error) throw error;
				    if(result.length!=0)
				    {
				    	res.send(JSON.stringify({"status": 3, "message": "Mobile Already Exists"}));
				    }
				    else
				    {
				    	connection.query("INSERT INTO pa_user (name,email,password,mobile,registration_status,created_date) VALUES ('"+name+"', '"+email+"', '"+password+"', '"+mobile+"','1','"+yyyymmdd.withTime()+"')", function (error, results, fields) {
						    if (error) throw error;
						    res.send(JSON.stringify({"status": 1, "message": "Registration Successful"}));
						});
					}
		    	});
		    }
		});
	}
});

app.post('/postapp/api/v1/signin', function(req, res, next) {
	if(empty(req.body.email) || empty(req.body.password))
	{
		res.send(JSON.stringify({"status": 0, "message": "No Data Found"}));
	}
	else
	{
		var email=req.body.email;
		var password=sha1(req.body.password);
		connection.query("SELECT * from pa_user where email='"+email+"' and password='"+password+"'", function (error, results, fields) {
			if (error) throw error;
		    if(results.length!=0)
		    {
		    	res.send(JSON.stringify({"status": 1, "message": "Login Successful", "info": results}));
		    }
		    else
		    {
		    	res.send(JSON.stringify({"status": 2, "messa1ge": "Invalid Email or Password"}));
			}
		});
	}
});

app.get('/postapp/api/v1/category', function(req, res, next) {
  connection.query("SELECT * from pa_category where status='1'", function (error, results, fields) {
    if (error) throw error;
    if(results.length!=0)
    {
      res.send(JSON.stringify({"status": 1, "message": "Category List", "category": results}));
    }
    else
    {
      res.send(JSON.stringify({"status": 2, "message": "No Category Available"}));
    }
  });
});

app.post('/postapp/api/v1/post', function(req, res, next) {
  if(empty(req.body.category_id))
  {
    res.send(JSON.stringify({"status": 0, "message": "No Data Found"}));
  }
  else
  {
    var category_id=req.body.category_id;
    connection.query("SELECT * from pa_post where category_id='"+category_id+"' ", function (error, results, fields) {
      if (error) throw error;
      if(results.length!=0)
      {
        res.send(JSON.stringify({"status": 1, "message": "Post List", "posts": results}));
      }
      else
      {
        res.send(JSON.stringify({"status": 2, "messa1ge": "No Post Found"}));
      }
    });
  }
});

app.get('/postapp/api/v1/test', function(req, res, next) {
  var hostname = req.headers.host; // hostname = 'localhost:8080'
  var pathname = url.parse(req.url).pathname; // pathname = '/MyApp'
  console.log('http://' + hostname + pathname);
  res.send(JSON.stringify({"status": 2, "messa1ge": "testing","hostname": hostname+pathname, "pathname": pathname}));
});

app.listen(port,()=>{
  console.log(`Server is up on port ${port}`);
});

console.log('working');

