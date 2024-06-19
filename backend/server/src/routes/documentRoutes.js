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
router.post(
  "/:userId/create",
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
    const json = req.body;
    const { status, response } = await DocumentControllers.updateDocumentJson({
      docId,
      json,
    });
    res.status(status).send(response);
  })
);
module.exports = router;
