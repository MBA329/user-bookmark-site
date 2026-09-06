import express from 'express'
import { getBookmark,updateBookmark,deleteBookmark,createBookmark,getBookmarkById } from "../../controllers/bookmark.controllers";

export const v1Router = express.Router()

v1Router.post('/collections/:collectionId/bookmarks',createBookmark)
v1Router.patch('/bookmarks/:id',updateBookmark)
v1Router.get('/bookmarks/:id',getBookmarkById)
v1Router.get('/bookmarks',getBookmark)
v1Router.delete('/bookmarks/:id',deleteBookmark)
