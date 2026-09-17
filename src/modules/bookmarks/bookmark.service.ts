import { Bookmark } from "../../types";
import {getDb,saveDb} from "@/database/jsonDb"

const generateId = ()=> Math.random().toString(36).substring(2,9);

export const bookmarkService = {
  
  getAllbookmarks: async(tagfilter?:string):Promise<Bookmark[]>=>{
    const db = await getDb();
    let bookmarks = db.bookmarks;

    if (tagfilter){
     bookmarks = bookmarks.filter((bk)=>{
      return bk.tags.some(tag => tag.toLowerCase() === tagfilter.toLowerCase())
     });
    }
    return bookmarks
  },

  getBookmarkById: async(id:string):Promise<Bookmark | null>=>{
    const db = await getDb();

    const bookmark = db.bookmarks.find((bk)=> bk.id === id)
    return bookmark || null;
  },

  updateBookmark: async(id:string,updates:Partial<Bookmark>): Promise<Bookmark | null> =>{
    const db = await getDb();
    const bookmarkIndex = db.bookmarks.findIndex((bk)=> bk.id === id);

    if (bookmarkIndex === -1){
      return null
    }

    if (updates.url && typeof updates.url !== "string"){
      throw new Error("Vallidation Error: url must be a string");
    }
    if (updates.title && typeof updates.title !== "string"){
      throw new Error("Validation Error: title must be  a string")
    }
    if (updates.tags && Array.isArray(updates.tags) && updates.tags.length === 0){
      throw new Error("Validation error tags cannot be empty")
    }

    const updateBookmark = {
      ...db.bookmarks[bookmarkIndex],
      ...updates,
    } as Bookmark;
    db.bookmarks[bookmarkIndex] = updateBookmark

    await saveDb(db)
    return updateBookmark 
  },

  createBookmark: async(data:Omit<Bookmark,'id'>):Promise<Bookmark>=>{
    const db = await getDb();

    const newBookmark = {
      id : generateId(),
      ...data
    };

    db.bookmarks.push(newBookmark);
    await saveDb(db);
    return newBookmark
  },
  deleteBookmark: async(id:string):Promise<boolean>=>{
    const db = await getDb();
    const initialLength = db.bookmarks.length

    db.bookmarks = db.bookmarks.filter((bk)=> bk.id !== id);

    if (db.bookmarks.length < initialLength) {
      await saveDb(db)
      return true
    }
   return false
  }
}

