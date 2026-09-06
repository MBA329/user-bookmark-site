export interface Bookmark {
  id: string;
  collectionId: string;
  url: string;
  title: string;
  tags: string[];
}

export interface Collection {
  name : string;
  id:string;
}