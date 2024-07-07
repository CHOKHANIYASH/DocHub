const multer = require("multer");
const jwt = require("jsonwebtoken");
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
const isValidUser = handleAsyncError(async (req, res, next) => {
  const userId = req.params.userId || req.body.userId;
  const access_token = req.headers.access_token;
  if (!access_token) {
    throw new AppError("Unauthorized", 401);
  }
  const decoded = jwt.decode(access_token, { complete: true });
  if (!decoded) throw new AppError("Unauthorized", 401);
  const { sub } = decoded.payload;
  const USERID = sub;
  if (USERID !== userId) {
    throw new AppError("Unauthorized", 401);
  }
  next();
});

module.exports = { AppError, handleAsyncError, upload, isAdmin, isValidUser };
