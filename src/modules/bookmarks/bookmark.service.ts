import { Bookmark } from "../../types";
import {db} from "@/database/db";
import { Kysely,sql,SqlBool } from "kysely";


const generateId = ()=> Math.random().toString(36).substring(2,9);

export const bookmarkService = {
  
  getAllbookmarks: async(tagfilter?:string):Promise<Bookmark[]>=>{
    
    let query  = db.selectFrom("bookmarks").selectAll()

    if (tagfilter){
  query = query.where(sql<SqlBool>`${sql.val(tagfilter)} = ANY(tags)`)
     };

     const bookmarks = await query.execute();
     return bookmarks.map((bk)=>({
      ...bk,
      created_at: bk.created_at.toISOString()
     }));
   
    
  },

  getBookmarkById: async(id:string):Promise<Bookmark | null>=>{
    
    const bookmark = await db 
    .selectFrom("bookmarks")
    .selectAll()
    .where("id","=",id)
    .executeTakeFirst();


    if (!bookmark){
      return null;
    }

    return {
      ...bookmark,
      created_at:bookmark.created_at.toISOString()
    }
  },

  updateBookmark: async(id:string,updates:Omit<Partial<Bookmark>, 'created_at'|'id'>): Promise<Bookmark | null> =>{
   

    if (updates.url && typeof updates.url !== "string"){
      throw new Error("Vallidation Error: url must be a string");
    }
    if (updates.title && typeof updates.title !== "string"){
      throw new Error("Validation Error: title must be  a string")
    }
    if (updates.tags && Array.isArray(updates.tags) && updates.tags.length === 0){
      throw new Error("Validation error tags cannot be empty")
    }

    const updatedBookmark = await db.updateTable("bookmarks")
    .set(updates)
    .where("id","=",id)
    .returningAll()
    .executeTakeFirst();

    if (!updatedBookmark){
      return null
    }

    return {
      ...updatedBookmark,
      created_at: updatedBookmark.created_at.toISOString()
    }
  },

  createBookmark: async(data:Omit<Bookmark,'id' | 'created_at'>):Promise<Bookmark>=>{
    const newBookmark = await db.insertInto("bookmarks")
    .values({
      id:generateId(),
    ...data,
    }).returningAll()
    .executeTakeFirstOrThrow()

   return {
    ...newBookmark,
    created_at: newBookmark.created_at.toISOString()
   }

  },
  deleteBookmark: async(id:string):Promise<boolean>=>{
    const result = await db
    .deleteFrom("bookmarks")
    .where("id", "=",id)
    .execute()

    return result.length > 0
}

}