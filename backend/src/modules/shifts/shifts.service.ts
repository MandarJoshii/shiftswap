import prisma from "../../utils/prisma";
import type { CreateShiftInput, UpdateShiftInput, ListShiftsQuery } from "./shifts.validation";

import { AppError } from "../../utils/AppError";

export class ShiftError extends AppError {}

async function assertEmployeeExists(employeeId: number) {
  const employee = await prisma.user.findUnique({ where: { id: employeeId } });
  if (!employee) {
    throw new ShiftError("Assigned employee does not exist", 404);
  }
  if (employee.role !== "EMPLOYEE") {
    throw new ShiftError("Shifts can only be assigned to users with the EMPLOYEE role", 400);
  }
}

export async function createShift(input: CreateShiftInput, createdById: number) {
  if (input.employeeId) {
    await assertEmployeeExists(input.employeeId);
  }

  const shift = await prisma.shift.create({
    data: {
      employeeId: input.employeeId ?? null,
      createdById,
      date: new Date(input.date),
      startTime: new Date(input.startTime),
      endTime: new Date(input.endTime),
      status: "SCHEDULED",
    },
    include: {
      employee: { select: { id: true, name: true, email: true } },
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: createdById,
      action: "SHIFT_CREATED",
      entityType: "Shift",
      entityId: shift.id,
      metadata: { date: input.date, startTime: input.startTime, endTime: input.endTime },
    },
  });

  return shift;
}

export async function listShifts(query: ListShiftsQuery) {
  return prisma.shift.findMany({
    where: {
      employeeId: query.employeeId,
      ...(query.startDate && query.endDate
        ? { date: { gte: new Date(query.startDate), lte: new Date(query.endDate) } }
        : {}),
    },
    include: {
      employee: { select: { id: true, name: true, email: true } },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });
}

export async function getShiftById(id: number) {
  const shift = await prisma.shift.findUnique({
    where: { id },
    include: {
      employee: { select: { id: true, name: true, email: true } },
    },
  });

  if (!shift) {
    throw new ShiftError("Shift not found", 404);
  }

  return shift;
}

export async function updateShift(id: number, input: UpdateShiftInput, actorId: number) {
  const existing = await prisma.shift.findUnique({ where: { id } });
  if (!existing) {
    throw new ShiftError("Shift not found", 404);
  }

  if (input.employeeId) {
    await assertEmployeeExists(input.employeeId);
  }

  const shift = await prisma.shift.update({
    where: { id },
    data: {
      employeeId: input.employeeId === null ? null : input.employeeId ?? undefined,
      date: input.date ? new Date(input.date) : undefined,
      startTime: input.startTime ? new Date(input.startTime) : undefined,
      endTime: input.endTime ? new Date(input.endTime) : undefined,
    },
    include: {
      employee: { select: { id: true, name: true, email: true } },
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId,
      action: "SHIFT_UPDATED",
      entityType: "Shift",
      entityId: shift.id,
      metadata: input,
    },
  });

  return shift;
}

export async function deleteShift(id: number, actorId: number) {
  const existing = await prisma.shift.findUnique({ where: { id } });
  if (!existing) {
    throw new ShiftError("Shift not found", 404);
  }

  await prisma.shift.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      actorId,
      action: "SHIFT_DELETED",
      entityType: "Shift",
      entityId: id,
      metadata: { date: existing.date, startTime: existing.startTime, endTime: existing.endTime },
    },
  });
}