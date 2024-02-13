import User from '../models/User.js'
import Admin from '../models/Admin.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import {LocalStorage} from "node-localstorage" ;
const localStorage = new LocalStorage('./scratch');

export const signup= async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exist" })
        }
        user = await User.findOne({username: req.body.username});
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this username already exist" })
        }
        const hashedPassword= await bcrypt.hash(req.body.password, 12);
        user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        })
        const data = {
            user: {
                id: user.id,
                username: user.username
            }
        }
        const authtoken = jwt.sign(data, process.env.JWT_SECRET);
        localStorage.setItem('token', authtoken);
        localStorage.setItem('username', req.body.username);
        res.status(200).json({ 'success': authtoken, 'username': req.body.username,'date':user.date, 'userType': "user"});
    }catch(e){
        console.error(e.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let admin = await Admin.findOne({ email });
        if (!admin) {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: "Please Enter Correct login Credentials" });
            }
            const checkPassword = await bcrypt.compare(password, user.password);
            if (!checkPassword) {
                return res.status(400).json({ error: "enter Correct Password" });
            }
            const data = {
                user: {
                    id: user.id,
                    username: user.username
                }
            }
            const authToken = jwt.sign(data, process.env.JWT_SECRET);
            localStorage.setItem('token', authToken);
            localStorage.setItem('username', user.username);
            localStorage.setItem('since', user.date);
            req.body.authtoken = authToken;
            return res.status(200).json({ 'success': req.body.authtoken, 'username': user.username, "userType": "user", "date":user.date });
        }
        const adminPassword = await bcrypt.compare(password, admin.password);
        if (!adminPassword) {
            return res.status(400).json({ error: "enter Correct Password" });
        }
        const admindata = {
            user: {
                id: admin.id,
                username: admin.username
            }
        }
        const authToken = jwt.sign(admindata, JWT_SECRET);
        localStorage.setItem('token', authToken);
        localStorage.setItem('username', admin.username);
        req.body.authtoken = authToken;
        return res.status(200).json({ 'success': req.body.authtoken, 'username': admin.username, "userType" : "admin"});
    }catch (e) {
        console.error(e.message);
        res.status(500).json({ error: "Internal server error" });
    }
}
