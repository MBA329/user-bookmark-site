import express, { Request, Response } from 'express'
import { bookmarkRouter } from './modules/bookmarks/bookmark.route'
import { authRouter } from './modules/auth/login.routes'
import { collectionsRouter } from './modules/collections/collections.routes'
import cookieParser from 'cookie-parser'
import { SessionData } from './types'
import cors from 'cors'

export const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "null"],
    credentials: true,
  }),
);

app.get('/', (req: Request, res: Response) => {
  return res.json({
    message: "app is running on http://localhost:3000"
  })
})

declare global {
  namespace Express {
    interface Request {
      user?: SessionData
    }
  }
}

const appRouter = express.Router();

appRouter.use('/', bookmarkRouter);
appRouter.use('/auth', authRouter);
appRouter.use('/collections', collectionsRouter);

app.use("/api", appRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` })
})
