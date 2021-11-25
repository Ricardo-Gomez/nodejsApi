var express = require("express");
var router = express.Router();
const UserController = require("../../controllers/users");
const {
  createUserValidationMiddleware,
} = require("../../middlewares/createUserValidationMiddleware");
const {
  idsValidationMiddleware,
} = require("../../middlewares/idsValidationMiddleware");
const {
  idValidationMiddleware,
} = require("../../middlewares/idValidationMiddleware");

router.get("/:ids", idsValidationMiddleware, UserController.getUser);
router.post("/", createUserValidationMiddleware, UserController.upsertUser);
router.put(
  "/:id",
  idValidationMiddleware,
  createUserValidationMiddleware,
  UserController.upsertUser
);
router.delete("/:id", idValidationMiddleware, UserController.deleteUser);

module.exports = router;
