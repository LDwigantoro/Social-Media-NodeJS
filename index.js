// pemanggilan library
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");

// pemanggilan path untuk route
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotenv.config();

// memasang koneksi ke mongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Database MongoDB Terkoneksi"))
  .catch((err) => console.log(err));

// membuat path direktori ke public folder 
app.use("/images", express.static(path.join(__dirname, "public/images")));

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// destinasi dari upload file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

// mekanisme upload file
const upload = multer({storage});
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File Berhasil Diupload");
  } catch (err) {
    console.log(err);
  }
});

// routing
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

// pengecekan koneksi server backend
app.listen(8800, () => {
  console.log("Backend server berjalan di port 8800");
});
