const router = require("express").Router();
const { handleAsyncError, AppError } = require("../middleware/middleware");
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
    const { username, email, firstName, lastName, avatar } = req.body;
    const userId = uuid();
    const { response, status } = await UserControllers.signup(
      userId,
      username,
      email,
      firstName,
      lastName,
      avatar
    );
    res.status(status).send(response);
  })
);

module.exports = router;
