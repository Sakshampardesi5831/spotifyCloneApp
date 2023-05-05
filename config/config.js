const mongoose=require("mongoose");
var multer=require("multer");
let crypto=require("crypto");
let path=require("path");
const gridFsStorage=require("multer-gridfs-storage").GridFsStorage;
const mongooseURI="mongodb://localhost/audioStream";
const conn = mongoose.createConnection(mongooseURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
let gfs;
conn.once("open", () => {
  // init stream
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "spotifySongsBucket",
  });
});
const storage = new gridFsStorage({
    url: mongooseURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString("hex") + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: "spotifySongsBucket",
          };
          resolve(fileInfo);
        });
      });
    },
  });
module.exports=multer({storage});