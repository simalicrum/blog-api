var express = require('express');
var router = express.Router();

const comment_controller = require("../controllers/commentController");

/* GET comments listing. */
router.get('/', comment_controller.comment_list);

router.get("/new", comment_controller.comment_create_get);

router.post("/new", comment_controller.comment_create_post);

router.get("/:commentId", comment_controller.comment_detail);

router.get("/:commentId/edit", comment_controller.comment_update_get);

router.put("/:commentId/edit", comment_controller.comment_update_put);

router.get("/:commentId/delete", comment_controller.comment_delete_get);

router.delete("/:commentId/delete", comment_controller.comment_delete);

module.exports = router;