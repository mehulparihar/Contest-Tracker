import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const generateTokens = (userId) => {
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn : "15m",
    })
    const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn : "7d",
    })
    return {accessToken, refreshToken};
}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly : true, // prevent XSS attacks, cross site scripting attack
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict", // prevent CSRF attack, cross site request forgery
        maxAge : 15 * 60 * 1000, // 15 minutes 
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly : true, // prevent XSS attacks, cross site scripting attack
        secure:process.env.NODE_ENV === "production",
        sameSite:"strict", // prevent CSRF attack, cross site request forgery
        maxAge : 7 * 24 * 60 * 60 * 1000, // 7 days 
    })
}
export const getProfile = async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({message : "Server error", error : error.message});
    }
} 

export const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(500).json({ message: "user already exist" });
        }
        const user = await User.create({ name, email, password });

        //authenticate
        const {accessToken, refreshToken} = generateTokens(user._id);

        setCookies(res, accessToken, refreshToken);

        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
        });
    } catch (error) {
        res.status(500).json({message : error.message});
    }
};

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.json({message : "Logged out successfully"});
    } catch (error) {
        res.status(500).json({message : "Server error", error : error.message});
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email});
        
        if(user && (await user.comparePassword(password))){
            const {accessToken, refreshToken} = generateTokens(user._id);

            setCookies(res, accessToken, refreshToken);

            res.json({
                _id : user._id,
                name : user.name,
                email : user.email,
                role : user.role,
            })
        }
        else {
            res.status(500).json({message : "Invalid email or password"});
        }
    } catch (error) {
        res.status(500).json({ message : error.message})
    }   
};


// this will refresh the access token
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(401).json({message : "No refresh token provided"});
        }
        
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        if(storedToken !== refreshToken){
            return res.status(401).json({message : "Invalid refresh token"});
        }
        
        const accessToken = jwt.sign({userId : decoded.userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn : "15m"});

        res.cookie("accessToken", accessToken, {
            httpOnly : true, // prevent XSS attacks, cross site scripting attack
            secure:process.env.NODE_ENV === "production",
            sameSite:"strict", // prevent CSRF attack, cross site request forgery
            maxAge : 15 * 60 * 1000, // 15 minutes 
        })

        res.json({message : "Token refreshed succesfully"});
    } catch (error) {
        res.status(500).json({message : "Server error", error : error.message});
    }
}