const {getUser} = require('../service/auth');

async function restrictToLoggedInUserOnly(req,res,next){
  console.log(req);
  const userUid = req?.cookies?.uid;
  if(!userUid) return res.redirect('/login');
  const user = await getUser(userUid);
  if(!user) return res.redirect('/login');

  req.user = user;
  next();
}

// here we are just only checking is authenticated or not, not redirecting again forcefully
async function checkAuth(req,res,next) {
    const userUid = req?.cookies?.uid;
   
    const user = await getUser(userUid);
   
  
    req.user = user;
    next();

}

module.exports = {
  restrictToLoggedInUserOnly,
  checkAuth,
};