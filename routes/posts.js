var express = require('express');
var router = express.Router();

const post_controller = require("../controllers/postController");

/* GET posts listing. */
router.get('/', post_controller.post_list);

router.get("/new", post_controller.post_create_get);

router.post("/new", post_controller.post_create_post);

router.get("/:id/edit", post_controller.post_update_get);

router.put("/:id/edit", post_controller.post_update_post);

router.delete("/:id/delete", post_controller.post_delete_get);

router.delete("/:id/delete", post_controller.post_delete);

module.exports = router;