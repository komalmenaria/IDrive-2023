const Folder = require("../models/Folder");
const config = require("config");
const AWS = require('aws-sdk');
const accessKeyId = config.get("accessKeyId");

const secretAccessKey = config.get("secretAccessKey");
const s3 = new AWS.S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
});

module.exports.get_files = async (req, res) => {
    try {
        let userId = req.params.userId;
        let mongoFolderKey = req.params.mongoFolderKey

        let folder = await Folder.findOne({ userId, mongoFolderKey })
        if (!folder) {
            return res.status(400).json({ msg: "folder not exist" });
        }
        let fileUrls = []
        if (folder.FilesName && folder.FilesName.length > 0)
        // return console.log(folder.FilesName)
        {
            await folder.FilesName.map(async (file) => {
                // console.log(file)
                const params = {
                    Bucket: 'inotebook2023',
                    Key: `${mongoFolderKey}/${file.name}`
                };
                const url = await s3.getSignedUrl('getObject', params);
                await fileUrls.push({
                    name: file.name,
                    url: url
                })
                // console.log(fileUrls)
            }
            )
            return res.status(200).send(fileUrls)
        }
        return res.status(200).send({ msg: "No files in the folder" })


    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Technical error occured" })
    }
}

module.exports.upload_files = async (req, res) => {
    try {
        let userId = req.params.userId;
        let mongoFolderKey = req.params.mongoFolderKey

        let folder = await Folder.findOne({ userId, mongoFolderKey })
        if (!folder) {
            return res.status(400).json({ msg: "folder not exist" });
        }
        let allfiles = req.files.files;

        // console.log(allfiles)
        if (Array.isArray(allfiles)) {
            for (let i = 0; i < allfiles.length; i++) {
                let key = allfiles[i].name;
                let foundObj = await folder.FilesName.find(obj => obj.name === key)
                if (foundObj) {
                    res.status(400).json({ msg: "file already exist" })
                    break;
                }
                folder.FilesName.push({ name: key });
                const uploadParams = {

                    Bucket: 'inotebook2023',
                    Key: `${mongoFolderKey}/${key}`,
                    Body: allfiles[i].data
                };
                await s3.upload(uploadParams, (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(`File ${key} uploaded successfully to folder ${mongoFolderKey}`);
                    }
                });
                
              }
            // await allfiles.forEach(async (file) => {
            //     let key = file.name;
            //     let foundObj = await folder.FilesName.find(obj => obj.name === key)
            //     if (foundObj) {
            //         res.status(400).json({ msg: "file already exist" })
                   
            //     }
            //     folder.FilesName.push({ name: key });
            //     const uploadParams = {

            //         Bucket: 'inotebook2023',
            //         Key: `${mongoFolderKey}/${key}`,
            //         Body: file.data
            //     };
            //     await s3.upload(uploadParams, (err, data) => {
            //         if (err) {
            //             console.log(err);
            //         } else {
            //             console.log(`File ${key} uploaded successfully to folder ${mongoFolderKey}`);
            //         }
            //     });
            // })
            folder.save()
            return res.status(200).send({ msg: "files uploded successfully" })

        }
        else {
            let key = allfiles.name;


            let foundObj = await folder.FilesName.find(obj => obj.name === key)
            if (foundObj) {
                return res.status(400).send({ msg: "file already exist" })
            }
            folder.FilesName.push({ name: key });
            const params = {
                Bucket: 'inotebook2023',
                Key: `${mongoFolderKey}/${key}`,
                Body: allfiles.data
            };

            await s3.upload(params, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('File uploaded successfully to ' + params.Bucket + '/' + params.Key);
                }
            });
            folder.save()
            return res.status(200).send({ msg: "files uploded successfully" })
        }

        // return res.status(200).send(folder)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Technical error occured" })
    }
}
