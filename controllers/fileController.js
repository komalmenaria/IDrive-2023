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

        let folder = await Folder.findOne({ userId, mongoFolderKey})
        if (!folder) {
            return res.status(400).json({ msg: "folder not exist" });
        }
        
        const params = {
            Bucket: 'inotebook2023',
            Prefix: `${mongoFolderKey}`
          };
          const allFilesUrl = [];
           s3.listObjectsV2(params, async (err, data) => {
            if (err) {
              console.log(err);
            } else {
              const files = data.Contents;
              files.forEach(  file =>{
                const params = {Bucket: 'inotebook2023', Key: file.Key};
                // console.log(file.Key)
                const fileUrl =   s3.getSignedUrl('getObject', params);
                 allFilesUrl.push({
                    key: file.Key,
                    url: fileUrl
                    
                 });
                // console.log(url); 

              });
              return  res.status(200).send(allFilesUrl)
            }
          })

    } catch (error) {

    }
}

module.exports.upload_files = async (req, res) => {
    try {
        let userId = req.params.userId;
        let mongoFolderKey = req.params.mongoFolderKey

        let folder = await Folder.findOne({ userId, mongoFolderKey})
        if (!folder) {
            return res.status(400).json({ msg: "folder not exist" });
        }
        let allfiles = req.files.files;
        
        // console.log(allfiles)
     
        await allfiles.map(async (file)=>{
        let key = file.name
        const uploadParams = {
            Bucket: 'inotebook2023',
            Key: `${mongoFolderKey}/${key}`,
            Body: file.data
        };
        await s3.upload(uploadParams, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`File ${key} uploaded successfully to folder ${mongoFolderKey}`);
            }
        });
       })
        // const newfiles = new File({ folderKey, file, userId });
        // await newfiles.save()
        return res.status(200).send({ msg: "files uploded successfully" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Technical error occured" })
    }
}
