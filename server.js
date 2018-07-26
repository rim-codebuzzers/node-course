const express=require('express');
const hbs=require('hbs'); //handlebars
const fs=require('fs');

var app=express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine','hbs');
// app.use(express.static(__dirname + '/public'));

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

hbs.registerHelper('getCurrentYear',()=>{
  return new Date().getFullYear();
  // return 'text';
});

hbs.registerHelper('screamIt',(text)=>{
  return text.toUpperCase();
});

app.get('/',(req,res)=>{
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

app.get('/about',(req,res)=>{
  // res.send("About Page");
  res.render('about.hbs',{
    pageTitle:'About Page',
    // currentYear:new Date().getFullYear(),
    welcomeMessage:"Welcome to the about page..."
  });
});

app.get('/bad',(req,res)=>{
  res.send({
    status:'001',
    errorMessage:"Unable to fullfill the request."
  });
});

app.listen(3000,()=>{
  console.log("Server is up on port 3000");
});
