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
        let parentFolder = req.params.parentFolder;

        if (!folderName) {
            return res.status(400).json({ msg: "Folder name can't be empty" });
        }
        else if (!userId) {
            return res.status(400).json({ msg: "User ID cant be null" });
        }
        let user = await User.findOne({ _id: userId })
        if (!user) {
            return res.status(400).json({ msg: "User not exist with this user Id" });
        }

        let folder = await Folder.findOne({ folderName, userId })
        if (folder) return res.status(400).json({ msg: "Folder already exists" });

        const folderKey = `${parentFolder}/${folderName}/`;
        const mongoFolderKey = `${folderName}`;
        console.log(folderKey)
        const folderParams = {
            Bucket: "inotebook2023",
            Key: folderKey
        };
        await s3.putObject(folderParams, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`${folderName} created successfully `)
            }
        });
        const newFolder = new Folder({ folderName, userId, mongoFolderKey });
        await newFolder.save()
        res.status(200).send({ msg: `${folderName} created successfully` })

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

module.exports.delete_folder = async (req, res) => {
    try {
        const userId = req.params.id;
        let folderName = req.params.folderName;
        // let mongoFolderKey = req.params.mongoFolderKey;

        let folder = await Folder.find({ userId, folderName });
        let user = await User.findOne({ _id: userId })
        if (!user) {
            return res.status(400).send({ msg: "User not found" })
        }
        if (!folder) {
            return res.status(400).send({ msg: "Folder not exist" })
        }
        // console.log(user)
        let parentFolder = user.folder;
        // console.log(parentFolder)
        if (!parentFolder) {
            return res.status(400).send({ msg: "Parent Folder not found" })
        }
        else {
            let params = {
                Bucket: "inotebook2023",
                Prefix: `${parentFolder}/${folderName}/`
            };

            let deleteonaws = await s3.listObjectsV2(params, async function (err, data) {
                if (err) console.log(err, err.stack);
                else {
                    let folderSize = 0;
                    data.Contents.forEach((object) => {
                        folderSize += object.Size;
                    });
                    user.storage -= folderSize;
                    user.save()
            
            var objects = data.Contents.map(function (object) {
                return { Key: object.Key };
            });

            params = {
                Bucket: "inotebook2023",
                Delete: { Objects: objects }
            };
            await s3.deleteObjects(params, function (err, data) {
                if (err) console.log(err, err.stack);
                else return (data);
            });
        }
    });

    await Folder.deleteOne({ _id: folder[0]._id });
    return res.status(200).json({ msg: "folder deleted successfully" })
}

    } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: "Technical error occured" })
}
}