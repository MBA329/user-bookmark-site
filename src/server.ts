import express, {Request,Response,NextFunction

} from 'express'
import crypto from 'node:crypto'
import {app} from './app'
import { v1Router } from './routes/v1/bookmark'
const PORT = 3000

const USERS = [
  {id:"user_1",username:"alex",password:"password123",role:'user'},
  {id:"user_2",username:"admin",password:"adminpassword",role:'admin'}
]

interface SessionData {
  userId:string;
  role:string;
  createdAt:Date;
}

const sessions: Record<string,SessionData> = {

}

declare global {
  namespace Express{
    interface Request{
      user?:SessionData
    }
  }
}

v1Router.post('/api/v1/auth/login-session',(req:Request,res:Response)=>{
    const {username,password} = req.body;

    const user = USERS.find((u)=> u.username === username);

    if (!user || user.password !== password){
      return res.status(401).json({error:"invalid username or password combination"});

    }
    const sessionId = crypto.randomUUID();

    sessions[sessionId] = {
      userId: user.id,
      role: user.role,
      createdAt: new Date(),
    }

    res.cookie('sid',sessionId,{
      httpOnly: true,
      secure:false,
      sameSite:'lax',
      maxAge: 15 * 60 * 1000,
    })

    return res.json({message:"login successful",userId:user.id});

})


    function requireAuth(req: Request, res: Response, next: NextFunction) {
      const sessionId = req.cookies?.sid;

      if (!sessionId) {
        return res
          .status(401)
          .json({ error: "Unauthorized: No session cookie provided" });
      }

      const session = sessions[sessionId];
      if(!session){
        return res.status(401).json({error:"unauthorized: Invalid or expired session"})
      }
      req.user = session
      next()
    }

v1Router.get('/api/v1/me',requireAuth,(req:Request,res:Response)=>{

  res.json({
    message: 'Access granted to protected route',
    user:req.user,
  });
});

app.post('/api/v1/auth/logout',requireAuth,(req:Request,res:Response)=>{
  const sessionId = req.cookies.sid;

  delete sessions[sessionId];

  res.clearCookie('sid');
  res.json({message:"Logged out successfully"})
})

app.listen(PORT, () => {
  console.log("server listening on http://localhost:3000");
});
