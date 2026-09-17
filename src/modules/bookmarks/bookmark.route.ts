import express from "express";
import {
  getBookmark,
  updateBookmark,
  deleteBookmark,
  createBookmark,
  getBookmarkById,
} from "./bookmarks.controller";
import { requireAuth } from "../../api/middleware/auth.middleware";




export const bookmarkRouter = express.Router();

bookmarkRouter.post("/collections/:collectionId/bookmarks", createBookmark);
bookmarkRouter.patch("/bookmarks/:id", updateBookmark);
bookmarkRouter.get("/bookmarks/:id",requireAuth, getBookmarkById);
bookmarkRouter.get("/bookmarks", requireAuth, getBookmark);
bookmarkRouter.delete("/bookmarks/:id", deleteBookmark);
