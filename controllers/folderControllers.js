const User = require("../models/User");
const Folder = require("../models/Folder");
const config = require("config");
const AWS = require('aws-sdk');
const accessKeyId = config.get("accessKeyId");
const secretAccessKey = config.get("secretAccessKey");
const s3 = new AWS.S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
});

module.exports.create_folder = async (req, res) => {
    try {
        let folderName = req.body.folderName;
        let userId = req.params.id;

        if (!folderName) {
            res.status(400).json({ msg: "Folder name can't be empty" });
        }
        else if (!userId) {
            res.status(400).json({ msg: "User not exist" });
        }
        let folder = await Folder.findOne({ folderName, userId })
        if (folder) return res.status(400).json({ msg: "Folder already exists" });

        const folderKey = `${folderName}_${userId}/`;
        const mongoFolderKey = `${folderName}_${userId}`
        console.log(folderKey)
        const folderParams = {
            Bucket: "inotebook2023",
            Key: folderKey
        };
        await s3.putObject(folderParams, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`Folder ${folderName} created successfully `)
            }
        });
        const newFolder = new Folder({ folderName, userId, mongoFolderKey });
        await newFolder.save()
        res.status(200).send({ msg: `Folder ${folderName} created successfully` })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Technical error occured" })
    }
}

module.exports.get_folders = async (req, res) => {
    try {
        const userId = req.params.id;
        Folder.find({ userId }).sort({ date: -1 }).then(folders => res.json(folders));

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Technical error occured" })
    }
}