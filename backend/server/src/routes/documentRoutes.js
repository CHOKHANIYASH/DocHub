const router = require("express").Router();
const {
  handleAsyncError,
  isValidUser,
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
  isValidUser,
  handleAsyncError(async (req, res) => {
    const userId = req.params.userId;
    const { status, response } = await DocumentControllers.create({
      authorId: userId,
    });
    res.status(status).send(response);
  })
);
router.get(
  "/:docId",
  handleAsyncError(async (req, res) => {
    const docId = req.params.docId;
    const userId = req.query.userId;
    const email = req.query.email;
    const accessToken = req.headers.access_token;
    const authorized = await DocumentControllers.isAuthorizedToView({
      docId,
      userId,
      email,
      accessToken,
    });
    if (!authorized)
      throw new AppError("You are not allowed to view this document", 403);
    const { status, response } = await DocumentControllers.getDoument({
      docId,
    });
    res.status(status).send(response);
  })
);
router.post(
  "/:docId/update",
  handleAsyncError(async (req, res) => {
    const docId = req.params.docId;
    const document = req.body.document;
    const userId = req.body.userId;
    const email = req.body.email;
    const accessToken = req.headers.access_token;
    if (document.accessType || document.allowedUsers) {
      throw new AppError(
        "You cannot update the accessList of the document in this route",
        400
      );
    }
    const authorized = await DocumentControllers.isAuthorizedToUpdate({
      docId,
      userId,
      email,
      accessToken,
    });
    if (!authorized)
      throw new AppError(
        "You have no permissions to make changes to this document",
        401
      );
    const { status, response } = await DocumentControllers.updateDocument({
      docId,
      document,
    });
    res.status(status).send(response);
  })
);
router.post(
  "/:docId/update/accesslist",
  isValidUser,
  handleAsyncError(async (req, res) => {
    const docId = req.params.docId;
    const accessType = req.body.accessType;
    const allowedUsers = req.body.allowedUsers;
    const { status, response } = await DocumentControllers.updateAccessList({
      docId,
      accessType,
      allowedUsers,
    });
    res.status(status).send(response);
  })
);
router.post(
  "/:docId/delete",
  isValidUser,
  handleAsyncError(async (req, res) => {
    const docId = req.params.docId;
    const { status, response } = await DocumentControllers.deleteDocument({
      docId,
    });
    res.status(status).send(response);
  })
);

module.exports = router;
