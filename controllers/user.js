const user = require('../models/user');
const {v4: uuidv4} = require('uuid');
const {getUser,setUser} = require('../service/auth')
async function handleUserSignup(req,res){
    const{name,email,password} = req.body;
    await user.create({
        name,
        email,
        password
    });
    return res.redirect("/");
}

async function handleUserLogin(req,res){
    const{email,password} = req.body;
    const User = await user.findOne({email,password});
    console.log("user",User);
    if(!User) return res.render("login", {
        error: "Email or password is incorrect"
    })
    const sessionId = uuidv4();
    setUser(sessionId,User);
    // setting cookie with name uid and value is sessionId
    res.cookie('uid', sessionId); // ab jab bhi hum apne server pe req. krenge ye cookie vha jayegi, ab middleware me is cookie ki value lenge
    return res.redirect("/");
}

module.exports = {
    handleUserSignup,
    handleUserLogin
}