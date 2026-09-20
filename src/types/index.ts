import { Generated } from "kysely";

export interface Bookmark {
  id: string;
  collectionId: string;
  url: string;
  title: string;
  tags: string[];
  created_at:string;
}

export interface Collection {
  user_id: string;
  name : string;
  id:string;
  created_at: string;
}

export interface SessionData {
  userId: string;
  role: string;
  createdAt: Date;
  expiresAt: number
}

export interface User {
  id : string;
  name: string;
  role: string;
  passwordHash: string;
}