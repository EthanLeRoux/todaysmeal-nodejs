const { Storage } = require('megajs')
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const test = require("node:test");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Node doesn't support top-level await when using CJS
const writeFile = async function (imageBuffer, imageName) {
    try {
        // Check if imageName is valid
        if (!imageName || imageName.trim() === '') {
            throw new Error('File name is required');
        }

        // Initialize Mega storage
        const storage = await new Storage({
            email: `${process.env.MEGA_USERNAME}`,
            password: `${process.env.MEGA_PASSWORD}`,
        }).ready;

        console.log('Looking for folder...');
        const folder = storage.root.children.find(function (child) {
            return child.name === 'testmega';
        });

        if (!folder) {
            throw new Error('Folder "testmega" not found');
        }

        // Upload image to the folder on Mega
        const file = await folder.upload( imageName, imageBuffer).complete;

        console.log('The file was uploaded!', file);

        const fileUrl = await file.link();

        // console.log("The file that was uploaded's link is :" + fileUrl);

        return fileUrl;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

const writeFileToDir = async function (imageBuffer, imageName, dirName) {
    try {
        console.log(dirName);
        // Check if imageName is valid
        if (!imageName || imageName.trim() === '') {
            throw new Error('File name is required');
        }

        // Initialize Mega storage
        const storage = await new Storage({
            email: `${process.env.MEGA_USERNAME}`,
            password: `${process.env.MEGA_PASSWORD}`,
        }).ready;

        console.log('Looking for folder...');

        const megafolder = storage.root.children.find(function (child) {
            return child.name === 'testmega';
        });


        if (!megafolder) {
            throw new Error('testmega folder not found in the root');
        }

        console.log('megafolder children:', megafolder.children.map(child => child.name));

        const folder = megafolder.children.find(function(child){
            return child.name === dirName;
        });

        if (!folder) {
            throw new Error('Folder is not found');
        }

        // Upload image to the folder on Mega
        const file = await folder.upload( imageName, imageBuffer).complete;

        console.log('The file was uploaded!', file);

        const fileUrl = await file.link();

        // console.log("The file that was uploaded's link is :" + fileUrl);

        return fileUrl;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};


const  readFile = async function () {
    try{
        const storage = await new Storage({
            email: `${process.env.MEGA_USERNAME}`,
            password: `${process.env.MEGA_PASSWORD}`
        }).ready

        const fileUrl = 'https://mega.nz/file/aJQnGJBR#uCY0s74qD_uT5a4K4M1seol4LLU7aVGxd0UskgjjjkA';
        const file = await storage.find('testmega').find('hello-world.txt');
        //await file.loadAttributes()
        console.log(file.name)
        console.log(file.size) // file size in bytes

        const data = await file.downloadBuffer()
        console.log(data.toString()) // file contents
    }
    catch(error) {
        console.error(error)
        process.exit(1)
    }
};

const newFolder = async function (username){
    try{
        const storage = await new Storage({
            email: `${process.env.MEGA_USERNAME}`,
            password: `${process.env.MEGA_PASSWORD}`
        }).ready;
        const testfolder = await storage.find('testmega');
        const folder = await testfolder.mkdir(username);
        console.log('Created new folder for user: {' + username + '}')

    }
    catch(err){
        console.error(err);
    }
}



module.exports = {writeFile, readFile, newFolder,writeFileToDir}