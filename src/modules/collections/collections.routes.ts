import express from "express";
import {
  getAllCollections,
  getCollectionById,
  createCollection,
  deleteCollection,
} from "./collections.controller";
import { requireAuth } from "../../api/middleware/auth.middleware";

export const collectionsRouter = express.Router();

collectionsRouter.get("/", requireAuth,getAllCollections);
collectionsRouter.get("/:id", getCollectionById);
collectionsRouter.post("/",requireAuth, createCollection);
collectionsRouter.delete("/:id", deleteCollection);
