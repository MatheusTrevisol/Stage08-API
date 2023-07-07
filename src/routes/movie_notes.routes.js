const { Router } = require("express");
const MovieNotesController = require("../controllers/MovieNotesController")

const movieNotesRouter = Router();

const movieNotesController = new MovieNotesController();

movieNotesRouter.get("/", movieNotesController.index);
movieNotesRouter.get("/:id", movieNotesController.show);
movieNotesRouter.post("/:user_id", movieNotesController.create);
movieNotesRouter.put("/:id", movieNotesController.update);
movieNotesRouter.delete("/:id", movieNotesController.delete);

module.exports = movieNotesRouter;