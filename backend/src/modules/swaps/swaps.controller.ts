import { Request, Response, NextFunction } from "express";
import { claimSwapSchema, listSwapsQuerySchema } from "./swaps.validation";
import {
  postShiftForSwap,
  listOpenShifts,
  claimShift,
  listSwaps,
  approveSwap,
  rejectSwap,
} from "./swaps.service";

export async function postForSwap(req: Request, res: Response, next: NextFunction) {
  try {
    const shiftId = Number(req.params.shiftId);
    const shift = await postShiftForSwap(shiftId, req.user!.userId);

    res.status(200).json({ success: true, data: shift });
  } catch (error) {
    next(error);
  }
}

export async function getOpenShifts(_req: Request, res: Response, next: NextFunction) {
  try {
    const shifts = await listOpenShifts();

    res.status(200).json({ success: true, data: shifts });
  } catch (error) {
    next(error);
  }
}

export async function claim(req: Request, res: Response, next: NextFunction) {
  try {
    const { shiftId } = claimSwapSchema.parse(req.body);
    const swapRequest = await claimShift(shiftId, req.user!.userId);

    res.status(201).json({ success: true, data: swapRequest });
  } catch (error) {
    next(error);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listSwapsQuerySchema.parse(req.query);
    const swaps = await listSwaps(query, req.user!.userId, req.user!.role);

    res.status(200).json({ success: true, data: swaps });
  } catch (error) {
    next(error);
  }
}

export async function approve(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const swap = await approveSwap(id, req.user!.userId);

    res.status(200).json({ success: true, data: swap });
  } catch (error) {
    next(error);
  }
}

export async function reject(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const swap = await rejectSwap(id, req.user!.userId);

    res.status(200).json({ success: true, data: swap });
  } catch (error) {
    next(error);
  }
}