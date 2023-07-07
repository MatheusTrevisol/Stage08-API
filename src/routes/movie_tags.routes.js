const { Router } = require("express");
const MovieTagsController = require("../controllers/MovieTagsController")

const movieTagsRouter = Router();

const movieTagsController = new MovieTagsController();

movieTagsRouter.get("/", movieTagsController.index);
movieTagsRouter.get("/:user_id", movieTagsController.show);
movieTagsRouter.put("/:id", movieTagsController.update);
movieTagsRouter.delete("/:id", movieTagsController.delete);

module.exports = movieTagsRouter;