const express = require('express');
const router = express.Router();
const {writeFile,readFile} = require("../megahandler");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const storage = multer.memoryStorage();
const upload = multer();

router.get('/', async (req, res) => {
    await readFile();
});

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        // Check if originalname exists and if it's valid
        const imageName = req.file.originalname || 'default_image_name.png';
        console.log('Uploading file:', imageName);

        // Call writeFile with the uploaded image buffer
        await writeFile(req.file.buffer, imageName);

        res.status(200).send('File uploaded successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading file');
    }
});

module.exports = router