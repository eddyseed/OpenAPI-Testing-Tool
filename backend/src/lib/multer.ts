import multer from "multer";

const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/json" ||
      file.mimetype === "application/x-yaml" ||
      file.mimetype === "text/yaml" ||
      file.originalname.match(/\.(json|yml|yaml)$/i)
    ) {
      cb(null, true);
    } else {
      cb(new Error("Please upload a JSON or YAML file."));
    }
  },
});
