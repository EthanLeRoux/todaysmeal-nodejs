const express = require('express');
const router = express.Router();
const pool = require('../db');
const {writeFile, writeFileToDir} = require("../megahandler");
const multer = require("multer");
const upload = multer();

router.get('/', async (req,res) =>{
    try{
        const[rows] = await pool.query('SELECT * FROM posts');

        if(rows.length === 0){
            res.status(404).json({message:'No posts were found.'})
        }

        res.json(rows);
    }
    catch(err){
        console.err(err);
        res.status(404).json({error:'Something went wrong while fetching the posts.'});
    }
})

router.get('/:id',async (req,res)=>{
    try{
        const postId = req.params.id;

        if (isNaN(postId)) {
            return res.status(400).json({ error: 'Invalid blog ID' });
        }

        const [rows] = await pool.query(`SELECT * FROM posts WHERE post_id = ?`,postId);

        if(rows.length===0){
            return res.status(404).send('Post not found.')
        }

        const post = rows[0];

        const [imageRows] = await pool.query(`SELECT * FROM images WHERE image_id = ?`,post.image_id);

        if(imageRows.length===0){
            return res.status(404).send('Post image not found.')
        }

        res.json({
            postid: rows[0].post_id,
            userid: rows[0].user_id,
            caption: rows[0].caption,
            image: imageRows[0].file_path,
            likes: rows[0].likes,
        })
    }
    catch(err){
        console.error(err);
    }
})

router.post('/upload', upload.single('image'), async (req, res) => {
    //const{user_id, caption} = req.body;

    try {
        const{metadata} = req.body;
        const parsedMetadata = JSON.parse(metadata);
        const dirname = parsedMetadata.user_name;

        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        // Check if originalname exists and if it's valid
        const imageName = req.file.originalname || 'default_image_name.png';
        console.log('Uploading file:', imageName);

        // Call writeFile with the uploaded image buffer
        const fileLink = await writeFileToDir(req.file.buffer, imageName, dirname);

        console.log("file link is: "+fileLink)

        //res.status(200).send('File uploaded successfully');

        const[imageResult] = await pool.query('INSERT INTO  images (file_path)VALUES (?)',fileLink);
        //
         const imageId = imageResult.insertId;
        //
         const[postResult] = await pool.query('INSERT INTO posts (user_id,caption,image_id,likes) VALUES (?,?,?,?)',[parsedMetadata.user_id,parsedMetadata.caption,imageId,0]);
        //
         res.status(201).json({
             message:"post created successfully",
             postId:postResult.insertId,
             caption: parsedMetadata.caption,
             imagelink: fileLink
         })

    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading file');
    }
});

router.delete('/:id',async (req,res)=>{
    try{
        const {user_id} = req.body;

        const postId = req.params.id;

        if (isNaN(postId)) {
            return res.status(400).json({ error: 'Invalid blog ID' });
        }

        const [testrows] = await pool.query(`SELECT * FROM posts WHERE post_id = ?`,postId);

        if (testrows.affectedRows === 0) {
            return res.status(404).json({error: 'post not found'});
        }

        if(testrows[0].user_id === user_id){
            const [rows] = await pool.query(`DELETE FROM posts WHERE post_id = ?`,postId);

            if (rows.affectedRows === 0) {
                return res.status(404).json({error: 'post not found'});
            }

            res.status(200).json({
                message:'Post deleted successfully.'
            })
        }

        res.status(401).json({
            message:'You cannot delete this post.'
        })
    }
    catch(err){
        console.error(err);
    }
})

module.exports = router