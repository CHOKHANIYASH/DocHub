const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const isAdmin = (req, res, next) => {
  // if (!req.user.role || req.user.role !== "admin") {
  //   return res.status(403).json({ message: "Forbidden" });
  // }
  console.log("isAdmin middleware");
  next();
};

class AppError extends Error {
  constructor(message, status) {
    super();
    this.name = "AppError";
    this.message = message;
    this.status = status;
  }
}
const handleAsyncError = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => next(err));
};

module.exports = { AppError, handleAsyncError, upload, isAdmin };
