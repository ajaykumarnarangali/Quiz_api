const User=require('../models/userModel');
const {errorHandler}=require('../utils/errorHandler');

const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');

module.exports.SignUp = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return next(errorHandler(400, "enter all the fields"));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        const { password: pass, ...rest } = savedUser._doc;

        res.status(200).json({ message: "user created successfully", user: rest })

    } catch (error) {
        next(error.message);
    }
}

module.exports.SignIn = async (req, res, next) => {
    try {
        const {email,password}=req.body;
        if(!email || !password)
        {
            return next(errorHandler(400,"enter all fields"));
        }

        const user=await User.findOne({email});

        if(!user)
         {
            return next(errorHandler(404,"email doesn't exists"));
         }
         
        const isMatch=await bcrypt.compare(password,user.password);

        if(!isMatch)
        {
            return next(errorHandler(404,"incorrect password"));
        }

        const token=jwt.sign({id:user._id,isAdmin:user.isAdmin},"secret");
        const {password:pass,...rest}=user._doc

        res.cookie("access_token",token).status(200).json({message:'verification successfull',user:rest});

    } catch (error) {
       console.log(error)
       next(error)
    }
}