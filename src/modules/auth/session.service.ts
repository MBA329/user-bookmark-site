import { SessionData } from '../../types';

export const sessions: Record<string, SessionData> = {};

export const USERS = [
  { id: "user_1", username: "alex", password: "password123", role: "user" },
  { id: "user_2", username: "admin", password: "adminpassword", role: "admin" },
  { id: "user_3", username: "admin", password: "nonadminpassword", role: "user" },
  {id:"user_4",username:"emmanuel",password:"youngboy",role:"user"}
];
