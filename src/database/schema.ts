import {Generated} from "kysely"

export interface Database {
users: UserTable;
collections: CollectionTable;
bookmarks: BookmarkTable;
}

export interface UserTable {
  id: string;
  username: string;
  password: string;
  role: string;
  created_at: Generated<Date>;
}

export interface CollectionTable {
  id: string;
  user_id: string;
  name: string;
  created_at: Generated<Date>;
}

export interface BookmarkTable{
  id:string;
  collectionId:string;
  url:string;
  title:string;
  tags:string[];
  created_at: Generated<Date>;
}