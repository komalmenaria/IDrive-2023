const Folder = require("../models/Folder");
const User = require("../models/User");
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
        let user = await User.findOne({ _id: userId })
        if (!user) {
            return res.status(400).json({ msg: "User not exist" });
        }
        let fileUrls = []
        if (user.FilesName && user.FilesName.length > 0) {
            await user.FilesName.map(async (file) => {
                // console.log(file)
                const params = {
                    Bucket: 'inotebook2023',
                    Key: `${user.folder}/${file.name}`
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

module.exports.get_images = async (req, res) => {
    try {
        let userId = req.params.userId;


        let user = await User.findOne({ _id: userId })
        if (!user) {
            return res.status(400).json({ msg: "User not exist" });
        }
        let ImagesUrls = []
        if (user.ImagesName && user.ImagesName.length > 0) {
            await user.ImagesName.map(async (file) => {
                // console.log(file)
                const params = {
                    Bucket: 'inotebook2023',
                    Key: `${user.folder}/${file.name}`
                };
                const url = await s3.getSignedUrl('getObject', params);
                await ImagesUrls.push({
                    name: file.name,
                    url: url
                })
                // console.log(fileUrls)
            }
            )
            return res.status(200).send(ImagesUrls)
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
        let user = await User.findOne({ _id: userId })
        if (!user) {
            return res.status(400).json({ msg: "User not exist with this user Id" });
        }
        if (!user.folder) {
            return res.status(400).json({ msg: "folder not exist" });
        }
        if(req.files == null){
            return res.status(400).json({ msg: "Files cant be blank" });
        }
        let allfiles = req.files.files;
        if (!allfiles) {
            return res.status(400).json({ msg: "Files cant be blank" });
        }
        // console.log(allfiles)
        if (Array.isArray(allfiles)) {
            for (let i = 0; i < allfiles.length; i++) {
                let key = allfiles[i].name;
                let fileExtension = key.split('.').pop()

                user.storage += allfiles[i].size
                // console.log(allfiles[i])
                let foundObj1 = await user.FilesName.find(obj => obj.name === key)
                let foundObj2 = await user.ImagesName.find(obj => obj.name === key)
                if (foundObj1 || foundObj2) {

                    // 
                    continue;
                }
                else {
                    if (fileExtension == 'jpg' || fileExtension == 'png' || fileExtension == 'jpeg') {
                        user.ImagesName.push({ name: key });
                    }
                    else if (fileExtension == 'doc' || fileExtension == 'txt' || fileExtension == 'py' || fileExtension == 'pdf') {
                        user.FilesName.push({ name: key });
                    }

                    const uploadParams = {

                        Bucket: 'inotebook2023',
                        Key: `${user.folder}/${key}`,
                        Body: allfiles[i].data
                    };
                    await s3.upload(uploadParams, async (err, data) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(`File ${key} uploaded successfully to folder ${user.folder}`);
                           
                        }
                    });
                }


            }
            await user.save()
            return res.status(200).send({ msg: "files uploded successfully" })

        }
        else {
            let key = allfiles.name;
            let fileExtension = key.split('.').pop()
            user.storage += allfiles.size
            let foundObj1 = await user.FilesName.find(obj => obj.name === key)
            let foundObj2 = await user.ImagesName.find(obj => obj.name === key)

            if (foundObj1 || foundObj2) {
                return res.status(400).send({ msg: "file already exist" })
            }
            if (fileExtension == 'jpg' || fileExtension == 'png' || fileExtension == 'jpeg') {
                user.ImagesName.push({ name: key });
            }
            else if (fileExtension == 'doc' || fileExtension == 'txt' || fileExtension == 'py' || fileExtension == 'pdf') {
                user.FilesName.push({ name: key });
            }
            const params = {
                Bucket: 'inotebook2023',
                Key: `${user.folder}/${key}`,
                Body: allfiles.data
            };

            await s3.upload(params, async function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('File uploaded successfully to ' + params.Bucket + '/' + params.Key);
                    
                }
            });

        }
        await user.save()
        return res.status(200).send({ msg: "files uploded successfully" })
        // return res.status(200).send(folder)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Technical error occured" })
    }
}



module.exports.upload_files_folder = async (req, res) => {
    try {
        let userId = req.params.userId;
        let folderName = req.params.folderName;
        let folder = await Folder.findOne({ userId, folderName })
        let user = await User.findOne({ _id: userId })
        if(req.files == null){
            return res.status(400).json({ msg: "Files cant be blank" });
        }
        let allfiles = req.files.files;
        if (!allfiles) {
            return res.status(400).json({ msg: "Files cant be blank" });
        }
        if (!user) {
            return res.status(400).json({ msg: "User not exist with this user Id" });
        }
        if (!user.folder) {
            return res.status(400).json({ msg: "Parent folder not exist" });
        }
        if (!folder) {
            return res.status(400).json({ msg: " folder not exist" });
        }

        // console.log(allfiles)
        if (Array.isArray(allfiles)) {
            for (let i = 0; i < allfiles.length; i++) {
                let key = allfiles[i].name;
                let fileExtension = key.split('.').pop()

                user.storage += allfiles[i].size
                // console.log(allfiles[i])
                let foundObj1 = await folder.FilesName.find(obj => obj.name === key)
                let foundObj2 = await folder.ImagesName.find(obj => obj.name === key)
                if (foundObj1 || foundObj2) {

                    // 
                    continue;
                }
                else {
                    if (fileExtension == 'jpg' || fileExtension == 'png' || fileExtension == 'jpeg') {
                        folder.ImagesName.push({ name: key });
                    }
                    else if (fileExtension == 'doc' || fileExtension == 'txt' || fileExtension == 'py' || fileExtension == 'pdf') {
                        folder.FilesName.push({ name: key });
                    }
                    const uploadParams = {

                        Bucket: 'inotebook2023',
                        Key: `${user.folder}/${folderName}/${key}`,
                        Body: allfiles[i].data
                    };

                    await s3.upload(uploadParams, async (err, data) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(`File ${key} uploaded successfully`);
                            
                        }
                    });
                }


            }
            await user.save()
            await folder.save()
            return res.status(200).send({ msg: "files uploded successfully" })

        }
        else {
            let key = allfiles.name;
            let fileExtension = key.split('.').pop()

            user.storage += allfiles.size
            // console.log(allfiles[i])
            let foundObj1 = await folder.FilesName.find(obj => obj.name === key)
            let foundObj2 = await folder.ImagesName.find(obj => obj.name === key)

            if (foundObj1 || foundObj2) {
                return res.status(400).send({ msg: "file already exist" })
            }
            if (fileExtension == 'jpg' || fileExtension == 'png' || fileExtension == 'jpeg') {
                folder.ImagesName.push({ name: key });
            }
            else if (fileExtension == 'doc' || fileExtension == 'txt' || fileExtension == 'py' || fileExtension == 'pdf') {
                folder.FilesName.push({ name: key });
            }
            const params = {
                Bucket: 'inotebook2023',
                Key: `${user.folder}/${folderName}/${key}`,
                Body: allfiles.data
            };

            await s3.upload(params, async function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log('File uploaded successfully to ' + params.Key);
                   
                }
            });

        }
        await user.save()
        await folder.save()
        return res.status(200).send({ msg: "files uploded successfully" })
        // return res.status(200).send(folder)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Technical error occured" })
    }
}

module.exports.get_files_folder = async (req, res) => {
    try {
        let userId = req.params.userId;
        let folderName = req.params.folderName;
        let folder = await Folder.findOne({ userId, folderName })
        let user = await User.findOne({ _id: userId })
        if (!user) {
            return res.status(400).json({ msg: "User not exist with this user Id" });
        }
        if (!user.folder) {
            return res.status(400).json({ msg: "Parent folder not exist" });
        }
        if (!folder) {
            return res.status(400).json({ msg: " folder not exist" });
        }
        let fileUrls = []
        if (folder.FilesName && folder.FilesName.length > 0) {
            await folder.FilesName.map(async (file) => {
                // console.log(file)
                const params = {
                    Bucket: 'inotebook2023',
                    Key: `${user.folder}/${folderName}/${file.name}`
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

module.exports.get_images_folder = async (req, res) => {
    try {
        let userId = req.params.userId;
        let folderName = req.params.folderName;
        let folder = await Folder.findOne({ userId, folderName })
        let user = await User.findOne({ _id: userId })
        if (!user) {
            return res.status(400).json({ msg: "User not exist with this user Id" });
        }
        if (!user.folder) {
            return res.status(400).json({ msg: "Parent folder not exist" });
        }
        if (!folder) {
            return res.status(400).json({ msg: " folder not exist" });
        }
        let fileUrls = []
        if (folder.ImagesName && folder.ImagesName.length > 0) {
            await folder.ImagesName.map(async (file) => {
                // console.log(file)
                const params = {
                    Bucket: 'inotebook2023',
                    Key: `${user.folder}/${folderName}/${file.name}`
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



