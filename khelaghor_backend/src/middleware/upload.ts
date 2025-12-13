import multer from "multer";
import path from "path";
import fs from "fs";

// Create apk directory if it doesn't exist
const apkDir = path.join(process.cwd(), "apk");
if (!fs.existsSync(apkDir)) {
  fs.mkdirSync(apkDir, { recursive: true });
}

// Configure storage for APK files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "apk/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "app-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to accept only APK files
const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === "application/vnd.android.package-archive" ||
    path.extname(file.originalname).toLowerCase() === ".apk"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only APK files are allowed"), false);
  }
};

export const uploadApk = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  },
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage for general uploads (images, etc.)
const generalStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// General upload for images and other files
export const upload = multer({
  storage: generalStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});
