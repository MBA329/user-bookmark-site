import express,{Request,Response} from 'express'
import { v1Router } from './routes/v1/bookmark'

export const app = express()
app.use(express.json())

app.get('/',(req:Request,res:Response)=>{
  return res.json({
    message:"app is running on http://localhost:3000"
  })
})

app.use('/api/v1',v1Router)

app.use((req:Request,res:Response)=>{
res.status(404).json({error:`Route ${req.method} ${req.originalUrl} not found`})
})