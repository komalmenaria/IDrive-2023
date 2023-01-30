const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const config = require("config");
const bodyParser = require('body-parser')
const fileUpload = require("express-fileupload");
var cors = require('cors')

const authRoutes = require('./routes/auth');
const folderRoutes = require('./routes/folder');
const uplodeFileRoutes = require('./routes/uploadFile');
const createFileRoutes = require('./routes/createFile')
const createBillRoutes = require('./routes/bill')


const app = express();
app.use(express.json());
app.use(cors())
app.use(fileUpload());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api',authRoutes);
app.use('/api',folderRoutes);
app.use('/api',uplodeFileRoutes);
app.use('/api',createFileRoutes);
app.use('/api',createBillRoutes);




// used in production to serve client files
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// connecting to mongoDB and then running server on port 4000
const dbURI = config.get("dbURI");
const port = process.env.PORT || 4000;

mongoose.set('strictQuery', true);
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  console.log(dbURI))
  .then(() => console.log('MongoDB connection established.') ,app.listen(port, () => console.log(`Server running on http://localhost:${port}`)))
.catch((error) => console.error("MongoDB connection failed:", error.message))