const router     = require("express").Router();
const controller = require("../controllers/posts.controllers");
const middleware = require("../middlewares/authentication");

router.get   ("/"	 , 						    controller.getAllPosts);
router.get   ("/user", middleware.verify_token, controller.getUserPosts);
router.get   ("/:_id", middleware.verify_token, controller.getPostsForAdmin);
router.post  ("/"	 , middleware.verify_token, controller.insert);
router.delete("/:_id", middleware.verify_token, controller.delete);
router.put   ("/:_id", middleware.verify_token, controller.update);
// router.get("/:_id/comments",controller.publicFindAllComment);
// router.get("/:_id",middleware.verify_token,controller.findOne);

module.exports = router;