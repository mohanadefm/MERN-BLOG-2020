const router     = require("express").Router();
const controller = require("../controllers/comments.controllers");
const middleware = require("../middlewares/authentication");

router.get   ("/"    , middleware.verify_token, controller.findAll);
router.get   ("/:_id", middleware.verify_token, controller.findOne);
router.post  ("/"	 , middleware.verify_token, controller.insert);
router.delete("/:_id", middleware.verify_token, controller.delete);
router.put   ("/:_id", middleware.verify_token, controller.update);

module.exports = router;