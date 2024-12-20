const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const {newFolder} = require('../megahandler')

router.post('/', async (req, res) => {
    const{user_name,user_email,user_password} = req.body;
    const saltRounds = 12;
    const hashedPassword =await bcrypt.hash(user_password,12);


    try{
        // Check if username already exists
        const [usernameResult] = await pool.query(
            'SELECT * FROM users WHERE user_name = ?',
            [user_name]
        );

        // Check if email already exists
        const [emailResult] = await pool.query(
            'SELECT * FROM users WHERE user_email = ?',
            [user_email]
        );

        if (usernameResult.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        if (emailResult.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const[result] =await pool.query('insert into users (user_email, user_name, user_password) VALUES (?,?,?)',[user_email,user_name,hashedPassword])
        res.status(201).json({
            user_name,
            user_email,
            hashedPassword
        })

        await newFolder(user_name);
    }
    catch (e){
        console.error(e);
    }
})

module.exports = router;