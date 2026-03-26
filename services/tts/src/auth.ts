import type { Request, Response, NextFunction } from "express";

const PB_URL = process.env.PB_URL || "http://pocketbase:8090";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authorization header required" });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const response = await fetch(
      `${PB_URL}/api/collections/users/auth-refresh`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!response.ok) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    next();
  } catch {
    res.status(401).json({ error: "Auth service unavailable" });
  }
}
