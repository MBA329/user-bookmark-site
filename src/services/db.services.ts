import fs from "node:fs/promises"
import path from "node:path"
import { Bookmark, Collection} from "../types"


const dataFile = path.join(__dirname,"data.json")

export async function getDb():Promise<{collection:Collection[];bookmarks:Bookmark[]}>{
try {
const data = await fs.readFile(dataFile,'utf-8')
return JSON.parse(data)
}
catch (error){
  return {
    collection:[],
    bookmarks: []
  }
}
}


export async function saveDb(data:{collection:Collection[];bookmarks:Bookmark[]}){
await fs.writeFile(dataFile,JSON.stringify(data,null,2),"utf-8")
}

