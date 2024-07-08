const router = require("express").Router();
const {
  handleAsyncError,
  AppError,
  isValidUser,
} = require("../middleware/middleware");
const UserControllers = require("../controllers/userController");
const { v4: uuid } = require("uuid");

router.get("/", (req, res) => {
  try {
    res.status(200).send("Hello from User routes");
  } catch (err) {
    throw err;
  }
});

router.get("/allusers", async (req, res) => {
  const { status, response } = await UserControllers.allUsers();
  res.status(status).send(response);
});

router.post(
  "/signup",
  handleAsyncError(async (req, res) => {
    const { username, email, firstName, lastName, avatar, userId } = req.body;
    if (!username) throw new AppError("Username is required", 400);
    if (!email) throw new AppError("Email is required", 400);
    if (!userId) throw new AppError("userId is required", 400);
    const { response, status } = await UserControllers.signup({
      userId,
      username,
      email,
      firstName,
      lastName,
      avatar,
    });
    res.status(status).send(response);
  })
);
router.post(
  "/update/:userId",
  isValidUser,
  handleAsyncError(async (req, res) => {
    const userId = req.params.userId;
    const user = req.body.user;
    const { response, status } = await UserControllers.updateUser({
      userId,
      user,
    });
    res.status(status).send(response);
  })
);
router.post(
  "/delete/:userId",
  isValidUser,
  handleAsyncError(async (req, res) => {
    const userId = req.params.userId;
    const { response, status } = await UserControllers.deleteUser({
      userId,
    });
    res.status(status).send(response);
  })
);

module.exports = router;
