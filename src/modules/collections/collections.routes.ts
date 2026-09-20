import express from "express";
import {
  getAllCollections,
  getCollectionById,
  createCollection,
  deleteCollection,
  updateCollection
} from "./collections.controller";
import { requireAuth } from "@/middleware/auth.middleware";

export const collectionsRouter = express.Router();

collectionsRouter.get("/", requireAuth,getAllCollections);
collectionsRouter.get("/:id", getCollectionById);
collectionsRouter.post("/",requireAuth, createCollection);
collectionsRouter.delete("/:id",requireAuth, deleteCollection);
collectionsRouter.patch("/:id",requireAuth,updateCollection)
