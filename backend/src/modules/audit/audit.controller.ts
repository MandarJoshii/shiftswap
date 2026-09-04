import { Request, Response, NextFunction } from "express";
import prisma from "../../utils/prisma";

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        actor: { select: { id: true, name: true, role: true } },
      },
    });

    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
}