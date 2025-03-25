require("dotenv").config(); 

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const path = require("path");
const GitHubStrategy = require("passport-github").Strategy;

const app = express();
const PORT = process.env.PORT || 3000;


app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
    }
}));


app.use(passport.initialize());
app.use(passport.session());


passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    (accessToken, refreshToken, profile, cb) => {
      cb(null, profile);
    }
  )
);


passport.serializeUser((user, done) => done(null, user));


passport.deserializeUser((user, done) => done(null, user));


const isAuth = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
};


app.get("/", isAuth, (req, res) => {
    console.log(req.user);
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

app.get("/login", (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/auth/github", passport.authenticate("github"));

app.get('/logout', (req, res) => {
    
    req.logout(function(err){

        if(err){

            return next(err);

        }

        res.redirect('/login')

    })

});

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
