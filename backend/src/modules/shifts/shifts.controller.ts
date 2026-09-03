import { Request, Response, NextFunction } from "express";
import {
  createShiftSchema,
  updateShiftSchema,
  listShiftsQuerySchema,
} from "./shifts.validation";
import {
  createShift,
  listShifts,
  getShiftById,
  updateShift,
  deleteShift,
} from "./shifts.service";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createShiftSchema.parse(req.body);
    const shift = await createShift(parsed, req.user!.userId);

    res.status(201).json({ success: true, data: shift });
  } catch (error) {
    next(error);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const query = listShiftsQuerySchema.parse(req.query);
    const shifts = await listShifts(query);

    res.status(200).json({ success: true, data: shifts });
  } catch (error) {
    next(error);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const shift = await getShiftById(id);

    res.status(200).json({ success: true, data: shift });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const parsed = updateShiftSchema.parse(req.body);
    const shift = await updateShift(id, parsed, req.user!.userId);

    res.status(200).json({ success: true, data: shift });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await deleteShift(id, req.user!.userId);

    res.status(200).json({ success: true, data: { message: "Shift deleted" } });
  } catch (error) {
    next(error);
  }
}