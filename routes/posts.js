var express = require('express');
var router = express.Router();

const post_controller = require("../controllers/postController");
const comment_controller = require("../controllers/commentController");

/* GET posts listing. */
router.get('/', post_controller.post_list);

router.get("/new", post_controller.post_create_get);

router.post("/new", post_controller.post_create_post);

router.get("/:postId", post_controller.post_detail);

router.get("/:postId/edit", post_controller.post_update_get);

router.put("/:postId/edit", post_controller.post_update_post);

router.get("/:postId/delete", post_controller.post_delete_get);

router.post("/:postId/delete", post_controller.post_delete);

//Post comment routes
router.get('/:postId/comments', comment_controller.comment_list);

router.get("/:postId/comments/new", comment_controller.comment_create_get);

router.post("/:postId/comments/new", comment_controller.comment_create_post);

router.get("/:postId/comments/:commentId", comment_controller.comment_detail);

router.get("/:postId/comments/:commentId/edit", comment_controller.comment_update_get);

router.put("/:postId/comments/:commentId/edit", comment_controller.comment_update_put);

router.get("/:postId/comments/:commentId/delete", comment_controller.comment_delete_get);

router.post("/:postId/comments/:commentId/delete", comment_controller.comment_delete);

module.exports = router;