const Folder = require("../models/Folder");
const fs = require('fs');
const User = require("../models/User");
const config = require("config");
const AWS = require('aws-sdk');
const accessKeyId = config.get("accessKeyId");

const secretAccessKey = config.get("secretAccessKey");
const s3 = new AWS.S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey
});







module.exports.create_file_folder = async (req, res) => {
    try {
        let userId = req.params.userId;
        let folderName = req.params.folderName
        let FileName = req.body.fileName;
        let user = await User.findOne({_id: userId })
        if (!user) {
            return res.status(400).send({ msg: "User not found" })
        }
        if (!FileName) {
            return res.status(400).json({ msg: "File name cant be empty" });
        }

        let folder = await Folder.findOne({ userId, folderName })
        if (!folder) {
            return res.status(400).json({ msg: "folder not exist" });
        }
        let foundObj = await folder.FilesName.find(obj => obj.name === FileName)
        if (foundObj) {
            return res.status(400).json({ msg: "File already  exist" });
        }
        else {
            await folder.FilesName.push({ name: FileName });
            await fs.writeFile(FileName, new Buffer.alloc(0), (err) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    console.log(`File ${FileName} created`);
                }
            });
            const createdFile = fs.createReadStream(FileName);
            const uploadParams = {

                Bucket: 'inotebook2023',
                Key: `${user.folder}/${folderName}/${FileName}`,
                Body: createdFile
            };
            await s3.upload(uploadParams, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`File ${FileName} uploaded successfully to folder ${user.folder}/${folderName}`);
                }
            });
            // await fs.unlinkSync(`${FileName}`)
        }

        await folder.save()
        return res.status(200).send({ msg: "files created successfully" })

    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Technical error occured" })
    }
}
module.exports.read_file_folder = async (req, res) => {
    try {
        let userId = req.params.userId;
        let folderName = req.params.folderName
        let user = await User.findOne({_id: userId })
        if (!user) {
            return res.status(400).send({ msg: "User not found" })
        }
        let folder = await Folder.findOne({ userId, folderName })
        if (!folder) {
            return res.status(400).json({ msg: "folder not exist" });
        }
        let fileName = req.params.fileName;
        if (!fileName) {
            return res.status(400).json({ msg: "File name is required" });
        }
        let foundObj = await folder.FilesName.find(obj => obj.name === fileName)
        if (!foundObj) {
            return res.status(400).json({ msg: "File not exist" });
        }
        if (foundObj.name == fileName) {
            // Retrieve file from AWS using key
            await s3.getObject({ Bucket: 'inotebook2023', Key: `${user.folder}/${folderName}/${foundObj.name}` }, (err, data) => {
                if (err) throw err;
                //    return data.Body.toString()
                return res.status(200).send({ fileContent: `${data.Body.toString()}` })
            });

        }


    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Technical error occured" })
    }
}

module.exports.update_file_folder = async (req, res) => {
    try {
        let userId = req.params.userId;
        let folderName = req.params.folderName
        let user = await User.findOne({_id: userId })
        if (!user) {
            return res.status(400).send({ msg: "User not found" })
        }
        let folder = await Folder.findOne({ userId, folderName })
        if (!folder) {
            return res.status(400).json({ msg: "folder not exist" });
        }
        let fileName = req.params.fileName;
        if (!fileName) {
            return res.status(400).json({ msg: "File name is required" });
        }
        let foundObj = await folder.FilesName.find(obj => obj.name === fileName)
        if (!foundObj) {
            return res.status(400).json({ msg: "File not exist" });
        }
        let key = foundObj.name
        // Download the file from S3
        s3.getObject({
            Bucket: 'inotebook2023',
            Key: `${user.folder}/${folderName}/${key}`,
        }, (err, data) => {
            if (err) throw err;

            // Update the file content
            let fileContent = data.Body.toString();
            fileContent = fileContent.replace(fileContent, req.body.contentFile);

            // Write the updated content to a local file
            fs.writeFileSync(key, fileContent);

            // Upload the updated file to S3
            fs.readFile(key, (err, data) => {
                if (err) throw err;

                s3.putObject({
                    Bucket: 'inotebook2023',
                    Key: `${user.folder}/${folderName}/${key}`,
                    Body: data
                }, (err) => {
                    if (err) throw err;
                    return res.status(200).json({msg:'File updated successfully!'})
                });
            });
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Technical error occured" })
    }
}

module.exports.delete_file_folder = async (req, res) => {
    try {
        let userId = req.params.userId;
        let folderName = req.params.folderName
        let user = await User.findOne({_id: userId })
        if (!user) {
            return res.status(400).send({ msg: "User not found" })
        }
        let folder = await Folder.findOne({ userId, folderName })
        if (!folder) {
            return res.status(400).json({ msg: "folder not exist" });
        }
        let fileName = req.params.fileName;
        if (!fileName) {
            return res.status(400).json({ msg: "File name is required" });
        }
        let foundObj = await folder.FilesName.find(obj => obj.name === fileName)
        if (!foundObj) {
            return res.status(400).json({ msg: "File not exist" });
        }
        await s3.deleteObject({ Bucket: 'inotebook2023', Key: `${user.folder}/${folderName}/${foundObj.name}` }, (err, data) => {
            if (err) {
                console.log(err);
                
                return;
            }
            console.log(`Successfully deleted file ${foundObj.name} from folder ${user.folder}/${folderName}`);

        });
        await Folder.findOneAndUpdate({ $pull: { "FilesName": { name: fileName } } })
        return res.status(200).send({ msg: "File deleted Successfully" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Technical error occured" })
    }
}



module.exports.create_file = async (req, res) => {
    try {
        let userId = req.params.userId;
        let FileName = req.body.fileName;
        let user = await User.findOne({_id: userId })
        if (!user) {
            return res.status(400).send({ msg: "User not found" })
        }
        if (!FileName) {
            return res.status(400).json({ msg: "File name cant be empty" });
        }

        let foundObj = await user.FilesName.find(obj => obj.name === FileName)
        if (foundObj) {
            return res.status(400).json({ msg: "File already  exist" });
        }
        else {
            await user.FilesName.push({ name: FileName });
            await fs.writeFile(FileName, new Buffer.alloc(0), (err) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    console.log(`File ${FileName} created`);
                }
            });
            const createdFile = fs.createReadStream(FileName);
            const uploadParams = {

                Bucket: 'inotebook2023',
                Key: `${user.folder}/${FileName}`,
                Body: createdFile
            };
            await s3.upload(uploadParams, (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`File ${FileName} uploaded successfully to folder ${user.folder}`);
                }
            });
            // await fs.unlinkSync(`${FileName}`)
        }

        await user.save()
        return res.status(200).send({ msg: "files created successfully" })

    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Technical error occured" })
    }
}
module.exports.read_file = async (req, res) => {
    try {
        let userId = req.params.userId;
        let FileName = req.params.fileName;
        let user = await User.findOne({_id: userId })
        if (!user) {
            return res.status(400).send({ msg: "User not found" })
        }
        if (!FileName) {
            return res.status(400).json({ msg: "File name cant be empty" });
        }
        let foundObj = await user.FilesName.find(obj => obj.name === FileName)
        if (!foundObj) {
            return res.status(400).json({ msg: "File not exist" });
        }
        if (foundObj.name == FileName) {
            // Retrieve file from AWS using key
            await s3.getObject({ Bucket: 'inotebook2023', Key: `${user.folder}/${foundObj.name}` }, (err, data) => {
                if (err) throw err;
                //    return data.Body.toString()
                return res.status(200).send({ fileContent: `${data.Body.toString()}` })
            });

        }


    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Technical error occured" })
    }
}

module.exports.update_file = async (req, res) => {
    try {
        let userId = req.params.userId;
        let FileName = req.params.fileName;
        let user = await User.findOne({_id: userId })
        if (!user) {
            return res.status(400).send({ msg: "User not found" })
        }
        if (!FileName) {
            return res.status(400).json({ msg: "File name cant be empty" });
        }
        let foundObj = await user.FilesName.find(obj => obj.name === FileName)
        if (!foundObj) {
            return res.status(400).json({ msg: "File not exist" });
        }
        let key = foundObj.name
        // Download the file from S3
        s3.getObject({
            Bucket: 'inotebook2023',
            Key: `${user.folder}/${key}`,
        }, (err, data) => {
            if (err) throw err;

            // Update the file content
            let fileContent = data.Body.toString();
            fileContent = fileContent.replace(fileContent, req.body.contentFile);

            // Write the updated content to a local file
            fs.writeFileSync(key, fileContent);

            // Upload the updated file to S3
            fs.readFile(key, (err, data) => {
                if (err) throw err;

                s3.putObject({
                    Bucket: 'inotebook2023',
                    Key: `${user.folder}/${key}`,
                    Body: data
                }, (err) => {
                    if (err) throw err;
                    return res.status(200).json({msg:'File updated successfully!'})
                });
            });
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Technical error occured" })
    }
}

module.exports.delete_file = async (req, res) => {
    try {
        let userId = req.params.userId;
        let FileName = req.params.fileName;
        let user = await User.findOne({_id: userId })
        if (!user) {
            return res.status(400).send({ msg: "User not found" })
        }
        if (!FileName) {
            return res.status(400).json({ msg: "File name cant be empty" });
        }
        let foundObj = await user.FilesName.find(obj => obj.name === FileName)
        if (!foundObj) {
            return res.status(400).json({ msg: "File not exist" });
        }
        await s3.deleteObject({ Bucket: 'inotebook2023', Key: `${user.folder}/${foundObj.name}` }, (err, data) => {
            if (err) {
                console.log(err);
                
                return;
            }
            console.log(`Successfully deleted file ${foundObj.name} from folder ${user.folder}`);

        });
        await User.findOneAndUpdate({ $pull: { "FilesName": { name: FileName } } })
        return res.status(200).send({ msg: "File deleted Successfully" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Technical error occured" })
    }
}


