const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/images', express.static(__dirname + 'public/images'));
app.use('/js', express.static(__dirname + 'public/js'));

mongoose.connect("mongodb://localhost:27017/MovieSign",{useNewUrlParser : true});

// let enteredEmail = "";
// let enteredPass = "";
let enteredName;

let mobiles = ['Iphone 14','Iphone 13']

const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    pass: String
});

const User = mongoose.model("User",userSchema); //created collection

const user = new User({
    name : "",
    email : "",
    pass: ""
});

User.find(function(err,users){
    if (err) {
        console.log(err);
    }else{
        console.log(users);
    }
    
});


app.listen("3000",(req,res) => {
    console.log("Listening on port 3000");
});

app.get("/",(req,res) => {
    res.render("home",);
});
app.get("/LogIn",(req,res) => {
    res.render("LogIn",);
});
app.get("/register",(req,res) => {
    res.render("register",);
});
app.get("/main", (req,res) => {
    res.render("main",{enteredName:enteredName});
});
app.get("/audio", (req,res) => {
    res.render("audio",);
});
app.get("/laptop", (req,res) => {
    res.render("laptop",);
});
app.get("/keyboard", (req,res) => {
    res.render("keyboard",);
});
app.get("/mobile",(req,res) => {
    res.render("mobile",{
        mobile1 : mobiles[0],
        mobile2 : mobiles[1],
    });
});

app.post("/LogIn",async (req,res)=>{

    let enteredEmail = req.body.emailLog;
    let enteredPass = req.body.passLog;
    const useremail = await User.findOne({email:enteredEmail});
    enteredName = useremail.name;
    if (useremail.pass === enteredPass) {
        res.redirect("/main");
    }else {
        res.send("Invalid details !");
    }
    
});
app.post("/register",async (req,res)=>{

    enteredName = req.body.regName;
    let enteredEmail = req.body.regEmail;
    let enteredPass = req.body.regPass;

    const useremail = await User.findOne({email:enteredEmail});
    if (useremail === enteredEmail) {
        res.send("Already Registered");
        enteredEmail = "";
        enteredName = "";
        enteredPass = "";
    }else{
        user.name = enteredName;
        user.email = enteredEmail;
        user.pass = enteredPass;
        user.save();
        enteredName = "";
        enteredEmail = "";
        enteredPass = "";
        res.redirect("/main");    
    }
});

app.post("/main",(req,res)=>{
    let searched = req.body.searchMain;
    console.log(searched);
    if (searched === "mobile" || searched === "oneplus" || searched === "iphone" || searched === "samsung") {
        res.redirect("/mobile");
    }else if (searched === "buds" || searched === "airpods" || searched === "headphone" || searched === "headset") {
        res.redirect("/audio");
    }else if (searched === "laptop" || searched === "hp" || searched === "acer" || searched === "dell" || searched === "macbook") {
        res.redirect("/laptop");
    }else if (searched === "keyboard" || searched === "logitech" || searched === "reddragon" || searched === "hyperx") {
        res.redirect("/keyboard");
    }
    else{
        res.send("Unavailable !!");
    }
})