import express from "express";

const categoryRouter = express.Router();

categoryRouter.get("/");
categoryRouter.post("/new");
categoryRouter.put("/:id");
categoryRouter.delete("/:id");

export default categoryRouter;
