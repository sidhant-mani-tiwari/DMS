const User = require('../models/User');
const jwt = require('jsonwebtoken');
const secretKey = 'sidhant123'; // Match with auth middleware


const register = async( req, res) => {
    const { Name , Email, Phone , Password, Address, UserType, Available, Community , CreationTime } = req.body;
    console.log(Email);
    console.log(Phone)
    const count = await User.countDocuments();
    const UserID = count + 1;
    console.log(UserID);
    
    try {
        const user = await User.create({ UserID ,Name , Email, Phone , Password, Address, UserType, Available, Community , CreationTime});
        console.log(user)
        const payload = {
            UserID : user.UserID,
            Email: user.Email
        };
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h'})
        res.status(201).json({ user , token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// const login = async( req, res) => {
//     const { Email, Password } = req.body;
//     try {
//         const options = { maxTimeMS: 15000 };
//         const user = await User.findOne({ Email } , null , options);
//         if (user && user.Password === Password) {
//             res.status(200).json({ user });
//         } else {
//             res.status(401).json({ error: 'Invalid credentials' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// }

// {
//     "Email":"tahmidulislamomi09@gmail.com",
//     "Password":"HackCSB@1"
// }

const login = async (req, res) => {
    const { Email, Password } = req.body;
    try {
        const user = await User.findOne({ Email });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Compare passwords
        if (Password !== user.Password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const payload = {
            UserID: user.UserID,
            Email: user.Email
        };

        const token = jwt.sign(payload, secretKey, { 
            expiresIn: '1h',
            algorithm: 'HS256'
        });

        res.status(200).json({ 
            user: {
                UserID: user.UserID,
                Name: user.Name,
                Email: user.Email,
                UserType: user.UserType
            },
            token 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    register,
    login
}