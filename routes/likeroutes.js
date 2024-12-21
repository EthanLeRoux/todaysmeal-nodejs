const express = require('express');
const router = express.Router();
const pool = require('../db');
const {writeFile, writeFileToDir} = require("../megahandler");
const multer = require("multer");
const upload = multer();

router.post('/', async (req, res) => {
    try {
        const {post_id } = req.body;

        if (!post_id) {
            return res.status(400).json({ message: 'userId and postId are required' });
        }

        const [rows] = await pool.query(`SELECT * FROM posts WHERE post_id = ?`,post_id);

        if(rows.length===0){
            return res.status(404).send('Post not found.')
        }
        const likecount = rows[0].likes;

        const [affectedRows] = await pool.query('UPDATE posts SET likes = ? WHERE post_id = ?',[likecount +1,post_id]);

        if(affectedRows.affectedRows.length===0){
            return res.status(404).send('Could not like post.')
        }

        const [updatedrows] = await pool.query(`SELECT * FROM posts WHERE post_id = ?`,post_id);

        if(updatedrows.length===0){
            return res.status(404).send('updated post not found.')
        }

        res.status(201).json({
            message:"post liked successfully",
            likes:updatedrows[0].likes
        })

    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading file');
    }
});

module.exports = router