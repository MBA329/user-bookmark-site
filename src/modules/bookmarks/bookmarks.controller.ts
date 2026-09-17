import { Request, Response } from "express";
import { bookmarkService } from "./bookmark.service";
import { Bookmark } from "../../types";

export const getBookmark = async (req: Request, res: Response) => {
  try {
    const tagFilter = req.query.tag as string | undefined;

    const bookmarks = await bookmarkService.getAllbookmarks(tagFilter);
    return res.status(200).json(bookmarks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const getBookmarkById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const bookmark = await bookmarkService.getBookmarkById(id);

    if (!bookmark) {
      return res.status(404).json({ message: "bookmark not found" });
    }
    return res.status(200).json(bookmark);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

export const updateBookmark = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const updates: Partial<Bookmark> = req.body;

    const updateBookmark = await bookmarkService.updateBookmark(id, updates);

    if (!updateBookmark) {
      return res.status(404).json({ error: "bookmark not found" });
    }
    return res.status(200).json(updateBookmark);
  } catch (error: any) {
    if (error.message && error.message.startsWith("Validation error")) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "internal server error" });
  }
};

export const deleteBookmark = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const isDeleted = await bookmarkService.deleteBookmark(id as string);

    if (isDeleted) {
      return res
        .status(200)
        .json({ message: "bookmark has been deleted successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

export const createBookmark = async (req: Request, res: Response) => {
  const { collectionId } = req.params;
  try {
    if (!req.body.url || !req.body.title || !req.body.tags) {
      return res
        .status(400)
        .json({ error: "missing required fields: url, title,collectionId" });
    }
    const newBookmark = { collectionId, ...req.body };
    await bookmarkService.createBookmark(newBookmark);
    return res.status(201).json(newBookmark);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "internal server error" });
  }
};
