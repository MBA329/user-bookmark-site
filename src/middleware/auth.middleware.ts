import { Request, Response, NextFunction } from "express";
import { sessions } from "@/modules/auth/session.service";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const sessionId = req.cookies?.sid;

  if (!sessionId) {
    return res
      .status(401)
      .json({ error: "Unauthorized: No session cookie provided" });
  }

  const session = sessions[sessionId];
  if (!session) {
    return res
      .status(401)
      .json({ error: "unauthorized: Invalid or expired session" });
  }
  

  if (Date.now()>session.expiresAt){
    delete sessions[sessionId];
    res.clearCookie("sid");
    return res.status(401).json({error:"unauthorized session"})
  }

  else if (Date.now()<session.expiresAt){
      session.expiresAt =  Date.now() + 15 * 60 * 1000
  }
  req.user = session;
  next();
}

