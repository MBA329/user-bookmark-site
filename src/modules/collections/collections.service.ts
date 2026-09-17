import { Collection } from "../../types";
import { getDb, saveDb } from "../../services/db.services";

const generateId = () => crypto.randomUUID();

const validateCollection = (name: any) => {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new Error('Validation error: Collection name must be a non-empty string.');
  }
};

export const collectionService = {
  getAllCollections: async (): Promise<Collection[]> => {
    const db = await getDb();
    return db.collections;
  },

  getCollectionById: async (id: string): Promise<Collection | null> => {
    const db = await getDb();
    const collection = db.collections.find((col) => col.id === id);
    return collection || null;
  },

  createCollection: async (name: string,id:string): Promise<Collection> => {
    validateCollection(name);
    const db = await getDb();
    const newCollection: Collection = {
      userId:id,
      id: generateId(),
      name: name.trim(),
      createdAt: new Date()
    };
    db.collections.push(newCollection);
    await saveDb(db);
    return newCollection;
  },

  deleteCollection: async (id: string): Promise<boolean> => {
    const db = await getDb();
    const initialLength = db.collections.length;
    db.collections = db.collections.filter((col) => col.id !== id);

    if (db.collections.length < initialLength) {
      await saveDb(db);
      return true;
    }
    return false;
  },
};
