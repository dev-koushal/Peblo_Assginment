import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const createToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export const signup = async (req,res)=>{
    try {
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({message:"Please fill all the fields"});
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        const user = await User.create({name,email,password});
        const userObj = user.toObject();
        delete userObj.password;
        return res.status(201).json({user: userObj, message:"User created successfully"});
      
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error"});
    }
}

export const login = async (req,res) =>{
    try {
        const { email, password } = req.body;
        if(!email || !password) return res.status(400).json({message: 'Please provide email and password'});

        const user = await User.findOne({ email }).select('+password');
        if(!user) return res.status(400).json({message: 'Invalid credentials'});

        const isMatch = await user.comparePassword(password);
        if(!isMatch) return res.status(400).json({message: 'Invalid credentials'});

        const token = createToken(user._id);
        const userObj = user.toObject();
        delete userObj.password;

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ user: userObj });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Internal server error'});
    }
}

export const logout = async (req,res) =>{
    res.cookie('token','',{
        httpOnly: true,
        expires: new Date(0),
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production'
    });
    return res.json({ message: 'Logged out' });
}

export const getCurrentUser = async (req,res) =>{
    try {
        // `req.user` will be populated by auth middleware
        if(!req.user) return res.status(401).json({message: 'Not authenticated'});
        return res.json({ user: req.user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: 'Internal server error'});
    }
}