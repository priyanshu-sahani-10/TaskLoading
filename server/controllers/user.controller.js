import express from 'express';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateToken } from '../utils/generateToken.js';
import Issue from '../models/issue.model.js';






export const register= async(req,res) => {

    try {
        
        console.log("Incoming register data:", req.body);

        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"All field are required."
            })
        }

        const existUser = await User.findOne({email});
        if(existUser){
            return res.status(400).json({
                success:false,
                message:"User already exist."
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const newUser = await User.create({
            name,
            email,
            password:hashedPassword
        });

        generateToken(res, newUser, "User registered successfully.");


    } 
    
    catch (error) {
        console.error("Registration error:", error);
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to register the user."
        })        
    }
};






export const login = async (req,res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            })
        }
        const userExist = await User.findOne({email});
        if(!userExist){
            return res.status(400).json({
                success:false,
                message:"Incorrect email or password"
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, userExist.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect email or password"
            });
        }
        generateToken(res, userExist, `Welcome back ${userExist.name}`);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to login"
        })
    }
}




export const getUserProfile = async (req,res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if(!user){
            return res.status(404).json({
                message:"Profile not found",
                success:false
            })
        }
        return res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to load user"
        })
    }
}










export const logout = async (_,res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({
            message:"Logged out successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to logout"
        }) 
    }
}




