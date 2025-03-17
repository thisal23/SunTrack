const multer = require("multer");
const path = require("path");

// defining storage location for vehicle documents files ~~ images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // uplaoding each file in uploads folder
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    // unique file name generate
    const extension = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random * 1024
    )}${extension}`; // file name with extension type
    //return 2025/02/28T22:57:00-21450xcsjhdweu342942.pdf

    cb(null, uniqueName);
  },
});

// Filter file types to check image files and pdf only ~~ pdf/jpeg/jpg/png
const fileFilter = (req, file, cb) => {
  const allowedType = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
  ];

  if (allowedType.includes(file.mimetype)) {
    // image/jpg application/pdf
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, and PDF are allowed!"),
      false
    );
  }
};

// npm install multer

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
