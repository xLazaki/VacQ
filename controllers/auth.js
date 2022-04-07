const User = require('../models/User');

//@desc Register user
//@route POST /api/v1/auth/register
//@access Public
exports.register = async(req,res,next)=>{
    try{
        console.log(req.body);
        const {name, email,password,role} = req.body;
        //create User
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        //Create token
        // const token = user.getSignedJwtToken();
        // res.status(200).json( {success:true,token});
        sendTokenResponse(user,200,res);
    }catch(err){
        res.status(400).json({success:false});
        console.log(err.stack);
    }
}


//@desc Login User
//@route Post /api/v1/auth/login
//@access Public
exports.login= async (req,res,next)=>{
    const {email,password} = req.body;
    try{
    //validate email & password
    if(!email || !password){
        return res.status(400).json({success:false,msg:'Please provide an email and password'});
    }
    //check for user
    const user = await User.findOne({email}).select('+password');
    const usertest =await User.find({email}).select('name');
    console.log(user);
    console.log(usertest);

    if(!user){
        return res.status(400).json({success:false,msg:'Invalid credentials'});
    }
    //check if password matches
    const isMatch = await user.matchPassword(password);

    if(!isMatch){
        return res.status(401).json({success:false,msg:'password not match'});
    }
    // const token = user.getSignedJwtToken();
    // res.status(200).json({success:true,token});
    sendTokenResponse(user,200,res);
}catch(err){
    res.status(400).json({error:err})
}
}

//Get token from model,create cookie and send response
const sendTokenResponse=(user,statusCode,res)=>{
    //Create Token
    const token=user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
        httpOnly: true
    };

    if(process.env.NODE_ENV==='production'){
        options.secure=true;
    }
    res.status(statusCode).cookie('token',token,options).json({
        success: true,
        token
    });
}

//@desc Get current Logged in user
//@route POSt /api/v1/auth/me
//@access Private

exports.getMe = async (req,res,next) =>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        data:user
    });
}
// @desc Log user out / clear cookie
//@route GET /api/v1/auth/logout
//@access Private
exports.logout=async(req,res,next)=>{
    res.cookie ('token','none',{
       expires: new Date (Date.now ()+ 10*1000),
       httpOnly:true
     });
    res.status (200).json ({
       success:true,
       data:{}
     } );
  };