import { Request, Response } from "express";
import { collectionService } from "./collections.service";
import { SessionData } from "../../types";
import { sessions } from "../auth/session.service";


export const getAllCollections = async (req: Request, res: Response) => {
  try {
    const collections = await collectionService.getAllCollections();
    res.json(collections);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCollectionById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const collection = await collectionService.getCollectionById(id);
    if (!collection) {
      return res.status(404).json({ error: "Collection not found" });
    }
    res.json(collection);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createCollection = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const id = req.user?.userId as string
    const newCollection = await collectionService.createCollection(name,id);
    res.status(201).json(newCollection);
  } catch (error: any) {
    if (error.message && error.message.startsWith("Validation error")) {
      return res.status(400).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCollection = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const isDeleted = await collectionService.deleteCollection(id);
    if (isDeleted) {
      res.json({ message: "Collection deleted successfully" });
    } else {
      res.status(404).json({ error: "Collection not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCollection = async(req:Request,res:Response)=>{
  try{
    const id = req.params.id as string
    const data = req.body
    const updatedCollection = await collectionService.updateCollection(id,data)

    if (!updatedCollection){
      return res.status(400).json({error:"bad request"})
    }
    return res.status(200).json(updatedCollection)
  }
  catch(error){
     console.error(error)
     res.status(500).json({error:"Internal server error"})
  }
}
