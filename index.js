const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const passport = require("passport")
const session = require("express-session")
const request = require("request")

require('dotenv').config();

let apiKey = "1f7d4b0bda85fdf5fdea1a967358faac"


var mysql = require("mysql2")

const port = 8000

app.set("view-engine", "ejs")

app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: false}))

const initializePassport = require("./passport-config.js")
initializePassport(passport)

app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

const db = mysql.createConnection ({
    host: "localhost",
    user: "usala001",
    password: "#london16",
    database: "weatherapp"
})

db.connect((err) => {
    if (err) {
        throw err
    }
    console.log('Connected to database')
})
global.db = db

app.use("/usr/198/api", require("./routes/api"))

app.get("/usr/198//about", loggedIn,  (req, res) => {
    res.render("about.ejs")
})

app.get("/usr/198/", (req, res) => {
    res.render("welcome.ejs")
})

app.get("/usr/198//weather", loggedIn, (req, res) => { 
    const city = req.query.cityname
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    request(url, function (err, response, body) {
        if(err){
            next(err)
            console.log("err")
        }else{
            var weather = JSON.parse(body)
            var found = false
            var message = " "
            if(weather.cod == 200){
                found = true
                var desc = weather.weather[0].description
                var temp = weather.main.temp
                var humidity = weather.main.humidity
                var timezone = weather.timezone
            }else if (weather.cod == 400){
                
            }else{
                message = "City not found, Try again"
                console.log(weather.cod)
            } 
        }
        res.render("weather.ejs", {city, temp, humidity, timezone, message, desc, found})
      });
})


app.get("/usr/198/home", loggedIn, (req, res) => {
    res.render("home.ejs")
})

app.get("usr/198//login", loggedOut, (req, res) => {
    res.render("login.ejs")
})

app.post("usr/198//login", loggedOut, passport.authenticate('local', {
    successRedirect: "/home",
    failureRedirect: "/login"
    
}))

app.get("usr/198//register", loggedOut, (req, res) => {
    res.render("register.ejs")
})

app.post("usr/198//registered", (req, res, next) => {
    const saltRounds = 10
    const plainPassword = req.body.password
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        let sqlquery = "INSERT INTO users (username, hashedpassword) VALUES (?,?)"
        let newuser = [req.body.username, hashedPassword]
        db.query(sqlquery, newuser, (err, result) => {
            if (err) {
               next(err)
            }
            else
                res.redirect("/login")
        })
      })

      
})


app.post("usr/198//logout", function(req, res, next) {
    req.logout(function(err) {
      if (err) { 
        return next(err); 
    }
      res.redirect('/login');
    });
  });


function loggedIn(req, res, next){
    if(req.isAuthenticated()) {
        return next()
    }else{
        res.redirect("/login")
    }
}

function loggedOut(req, res, next){
    if(req.isAuthenticated()){
        res.redirect("/home")
    }else{
        return next()
    }
}

app.listen(port, () => console.log(`Node app listening on port ${port}!`));
 


