export interface Bookmark {
  id: string;
  collectionId: string;
  url: string;
  title: string;
  tags: string[];
}

export interface Collection {
  userId: string;
  name : string;
  id:string;
  createdAt: Date
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