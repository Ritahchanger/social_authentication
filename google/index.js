const express = require("express");

require("dotenv").config();

const session = require("express-session")

const PORT = process.env.PORT || 5000;

const path = require("path");

const app = express();

const passport = require("./auth");



app.use(
    session({

        secret:process.env.JWT_SECRET,
        resave:false,
        secure:false,
        saveUninitialized:true,
    })
)


app.use(passport.initialize());

app.use(passport.session())



const isAuth = (req,res,next) => {

  if(req.user){

    next();
  
  }else{

    res.redirect('/login');

  }

}

app.get("/", isAuth, (req, res) => {

  res.sendFile(path.join(__dirname, "public", "dashboard.html"));

});


app.get("/login", (req, res) => {

  if(req.user){
    console.log(req.user);
    return res.redirect('/')

  }

  res.sendFile(path.join(__dirname, "public", "login.html"));

});

app.get("/auth/google/failure", (req, res) => {

  res.sendFile(path.join(__dirname, "public", "failure.html"));

});


app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/auth/google/failure",
  })
);


app.listen(PORT, () => {
  console.log(`Started server to demonstrate google authentication: ${PORT}`);
});
