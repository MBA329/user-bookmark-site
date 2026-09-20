import { Request, Response } from "express";
import crypto from "node:crypto";
import { sessions} from "./session.service";
import {db} from "../../database/db"
import bcrypt from 'bcryptjs'

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

const user = await db.selectFrom("users")
.selectAll()
.where("username", "=",username)
.executeTakeFirst();

const isPasswordValid = user? await bcrypt.compare(password,user.password) : false;

if (!user || !isPasswordValid){
  return res.status(401).json({message:"authentication failed: incorrect username or password combination",username:username,password:password})
}
  const sessionId = crypto.randomUUID();

  sessions[sessionId] = {
    userId: user.id,
    role: user.role,
    createdAt: new Date(),
    expiresAt: Date.now() + 15 * 60 * 1000,
  };

  res.cookie("sid", sessionId, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
    maxAge: 15 * 60 * 1000,
  });

  return res.json({ message: "login successful", userId: user.id });
};

export const logout = (req: Request, res: Response) => {
  const sessionId = req.cookies.sid;

  delete sessions[sessionId];

  res.clearCookie("sid");
  res.json({ message: "Logged out successfully" });
};

export const signUp = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  

  if (typeof username !== "string" || typeof password !== "string") {
    return res
      .status(400)
      .json({ message: "bad request username or password must be a string" });
  }

  const usernameTaken = await db.selectFrom("users")
  .selectAll()
  .where("username","=",username)
  .executeTakeFirst()

  if(usernameTaken){
    return res.status(409).json({error:"username already exists try something else"})
  }

   const hashedPassword = await bcrypt.hash(password,10)
  await db 
  .insertInto("users")
  .values({
    id: crypto.randomUUID(),
    username,
    password:hashedPassword,
    role:"user"
  }).execute()
    return res.status(201).json({message:"sign-up successful"})
};

export const getMe = (req: Request, res: Response) => {
  res.json({
    message: "Access granted to protected route",
    user: req.user,
  });
};
