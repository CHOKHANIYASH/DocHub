const router = require("express").Router();
const {
  handleAsyncError,
  AppError,
  upload,
} = require("../middleware/middleware");
const DocumentControllers = require("../controllers/documentControllers");
const { v4: uuid } = require("uuid");
router.get("/", (req, res) => {
  res.send("Welcome to Documents Routes");
});
router.get(
  "/user/:userId",
  handleAsyncError(async (req, res) => {
    const userId = req.params.userId;
    const { status, response } = await DocumentControllers.getAllDocuments({
      authorId: userId,
    });
    res.status(status).send(response);
  })
);
router.post(
  "/user/:userId/create",
  handleAsyncError(async (req, res) => {
    const userId = req.params.userId;
    const docId = uuid();
    const { status, response } = await DocumentControllers.create({
      authorId: userId,
      docId,
    });
    res.status(status).send(response);
  })
);
router.get(
  "/:docId",
  handleAsyncError(async (req, res) => {
    const docId = req.params.docId;
    // const allowedUser = await DocumentControllers.allowedUser({ userId });
    // if (!allowedUser)
    //   throw new AppError("You are not allowed to change this document", 403);
    const { status, response } = await DocumentControllers.getDoument({
      docId,
    });
    res.status(status).send(response);
  })
);
router.post(
  "/:docId/json",
  handleAsyncError(async (req, res) => {
    const docId = req.params.docId;
    const json = req.body.json;
    const userId = req.body.userId;
    // const allowedUser = await DocumentControllers.allowedUser({ userId });
    // if (!allowedUser)
    //   throw new AppError("You are not allowed to change this document", 403);
    const { status, response } = await DocumentControllers.updateDocumentJson({
      docId,
      json,
    });
    res.status(status).send(response);
  })
);
router.post(
  "/:docId/update",
  handleAsyncError(async (req, res) => {
    const docId = req.params.docId;
    const data = req.body.data;
    const userId = req.body.userId;
    // const allowedUser = await DocumentControllers.allowedUser({ userId });
    // if (!allowedUser)
    //   throw new AppError("You are not allowed to change this document", 403);
    const { status, response } = await DocumentControllers.updateDocument({
      docId,
      data,
    });
    res.status(status).send(response);
  })
);
module.exports = router;
