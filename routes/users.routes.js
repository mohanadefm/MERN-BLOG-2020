const router     = require("express").Router();
const controller = require("../controllers/users.controllers");
const middleware = require("../middlewares/authentication");

router.post  ("/register"	   , 						  controller.register);
router.post  ("/login"		   ,      					  controller.login);
router.get   ("/getusers"	   , middleware.verify_token, controller.getAllUsers);
router.put   ("/updateusername", middleware.verify_token, controller.updateUsername);
router.put   ("/updatepassword", middleware.verify_token, controller.updatePassword);
router.delete("/delete/:_id"   , middleware.verify_token, controller.deleteUser);
//router.post("/veriy_token",controller.verify_token);

module.exports = router;

// does uppercase affect route ('/Register')? Yes it affects.