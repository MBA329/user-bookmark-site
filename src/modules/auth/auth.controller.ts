import { Request, Response } from "express";
import crypto from "node:crypto";
import { sessions, USERS } from "./session.service";
import bcrypt from 'bcryptjs'

export const login = (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = USERS.find((u) => u.username === username);
 
  if (!user || user.password !== password) {
    return res
      .status(401)
      .json({ error: "invalid username or password combination" });
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
    sameSite: "lax",
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
export const signUp = (req: Request, res: Response) => {
  const { username, password } = req.body;
  

  if (typeof username !== "string" || typeof password !== "string") {
    return res
      .status(400)
      .json({ message: "bad request username or password must be a string" });
  }
  USERS.push(
    {id: crypto.randomUUID(),
      username:username,
      password:password,
      role:"user"

    })
    return res.status(201).json({message:"sign-up successful"})
};

export const getMe = (req: Request, res: Response) => {
  res.json({
    message: "Access granted to protected route",
    user: req.user,
  });
};
