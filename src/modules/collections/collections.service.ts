import { Collection } from "../../types";
import { db } from "@/database/db";

const generateId = () => crypto.randomUUID();

const validateCollection = (name: any) => {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new Error('Validation error: Collection name must be a non-empty string.');
  }
};

export const collectionService = {
  getAllCollections: async (): Promise<Collection[]> => {
   const query = await db.selectFrom("collections")
   .selectAll()
   .execute()
  
   return query.map((qr)=>({
    ...qr,
    created_at: qr.created_at.toISOString()
   }))
  },

  getCollectionById: async (id: string): Promise<Collection | null > => {
   const collection = await db.selectFrom("collections")
   .selectAll()
   .where("id","=",id)
   .executeTakeFirst()
   
   if (!collection){
    return null
   }
   
  return {
    ...collection,
    created_at: collection.created_at.toISOString()
  }
  },

  createCollection: async (name: string,id:string): Promise<Collection> => {
    validateCollection(name);
    const collection = await db.insertInto("collections")
    .values({
     id:generateId(),
     name,
     user_id:id
    })
    .returningAll()
    .executeTakeFirstOrThrow()

    return {
      ...collection,
      created_at:collection.created_at.toISOString()
    }
  },

  deleteCollection: async (id: string): Promise<boolean> => {
    const result = await db.deleteFrom("collections")
    .where("id","=",id)
    .executeTakeFirst()

    return result.numDeletedRows > 0
  },

  updateCollection : async (id:string,data:Omit<Partial<Collection>,'created_at'| 'user_id'>):Promise<Collection | null>=>{
      const collection = await db.updateTable('collections')
      .set(data)
      .where("id","=",id)
      .returningAll()
      .executeTakeFirst()

      if (!collection){
        return null
      }

      return {
        ...collection,
        created_at:collection.created_at.toISOString()
      }
  }
};
