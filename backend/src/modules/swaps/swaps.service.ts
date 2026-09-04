import prisma from "../../utils/prisma";
import { AppError } from "../../utils/AppError";
import { findConflictingShifts } from "../shifts/shifts.service";
import type { ListSwapsQuery } from "./swaps.validation";

export class SwapError extends AppError {}

export async function postShiftForSwap(shiftId: number, requesterId: number) {
  const shift = await prisma.shift.findUnique({ where: { id: shiftId } });

  if (!shift) {
    throw new SwapError("Shift not found", 404);
  }

  if (shift.employeeId !== requesterId) {
    throw new SwapError("You can only post your own shifts for swap", 403);
  }

  if (shift.status !== "SCHEDULED") {
    throw new SwapError("This shift is not available to post for swap", 400);
  }

  const updatedShift = await prisma.shift.update({
    where: { id: shiftId },
    data: { status: "OPEN_FOR_SWAP" },
  });

  await prisma.auditLog.create({
    data: {
      actorId: requesterId,
      action: "SHIFT_POSTED_FOR_SWAP",
      entityType: "Shift",
      entityId: shiftId,
      metadata: {},
    },
  });

  await prisma.notification.create({
    data: {
      userId: requesterId,
      message: `Your shift on ${shift.date.toISOString().split("T")[0]} was posted for swap.`,
      type: "SWAP_REQUESTED",
    },
  });

  return updatedShift;
}

export async function listOpenShifts() {
  return prisma.shift.findMany({
    where: { status: "OPEN_FOR_SWAP" },
    include: {
      employee: { select: { id: true, name: true, email: true } },
    },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });
}

export async function claimShift(shiftId: number, claimerId: number) {
  const shift = await prisma.shift.findUnique({ where: { id: shiftId } });

  if (!shift) {
    throw new SwapError("Shift not found", 404);
  }

  if (shift.status !== "OPEN_FOR_SWAP") {
    throw new SwapError("This shift is not available for swap", 400);
  }

  if (shift.employeeId === claimerId) {
    throw new SwapError("You cannot claim your own shift", 400);
  }

  const existingClaim = await prisma.swapRequest.findFirst({
    where: { shiftId, claimedById: claimerId, status: "PENDING" },
  });
  if (existingClaim) {
    throw new SwapError("You have already requested this shift", 409);
  }

  const conflicts = await findConflictingShifts(claimerId, shift.startTime, shift.endTime);
  if (conflicts.length > 0) {
    throw new SwapError(
      "This shift overlaps with a shift you're already assigned to",
      409
    );
  }

  const swapRequest = await prisma.swapRequest.create({
    data: {
      shiftId,
      requestedById: shift.employeeId!,
      claimedById: claimerId,
      status: "PENDING",
    },
    include: {
      shift: true,
      claimedBy: { select: { id: true, name: true, email: true } },
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: claimerId,
      action: "SWAP_REQUESTED",
      entityType: "SwapRequest",
      entityId: swapRequest.id,
      metadata: { shiftId },
    },
  });

  const managers = await prisma.user.findMany({ where: { role: "MANAGER" } });
  await prisma.notification.createMany({
    data: managers.map((manager) => ({
      userId: manager.id,
      message: `A new shift swap request needs your review.`,
      type: "NEW_CLAIM" as const,
      relatedSwapId: swapRequest.id,
    })),
  });

  return swapRequest;
}

export async function listSwaps(query: ListSwapsQuery, userId: number, userRole: string) {
  return prisma.swapRequest.findMany({
    where: {
      status: query.status,
      ...(userRole === "MANAGER"
        ? {}
        : { OR: [{ requestedById: userId }, { claimedById: userId }] }),
    },
    include: {
      shift: true,
      requestedBy: { select: { id: true, name: true, email: true } },
      claimedBy: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function approveSwap(swapId: number, managerId: number) {
  const swap = await prisma.swapRequest.findUnique({
    where: { id: swapId },
    include: { shift: true },
  });

  if (!swap) {
    throw new SwapError("Swap request not found", 404);
  }
  if (swap.status !== "PENDING") {
    throw new SwapError("This swap request has already been decided", 400);
  }

  const [updatedSwap] = await prisma.$transaction([
    prisma.swapRequest.update({
      where: { id: swapId },
      data: { status: "APPROVED", decidedById: managerId, decidedAt: new Date() },
    }),
    prisma.shift.update({
      where: { id: swap.shiftId },
      data: { employeeId: swap.claimedById, status: "SCHEDULED" },
    }),
    prisma.swapRequest.updateMany({
      where: { shiftId: swap.shiftId, status: "PENDING", id: { not: swapId } },
      data: { status: "REJECTED", decidedById: managerId, decidedAt: new Date() },
    }),
  ]);

  await prisma.auditLog.create({
    data: {
      actorId: managerId,
      action: "SWAP_APPROVED",
      entityType: "SwapRequest",
      entityId: swapId,
      metadata: { shiftId: swap.shiftId },
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: swap.requestedById,
        message: "Your shift swap request was approved.",
        type: "SWAP_APPROVED" as const,
        relatedSwapId: swapId,
      },
      {
        userId: swap.claimedById!,
        message: "Manager approved your shift swap claim.",
        type: "SWAP_APPROVED" as const,
        relatedSwapId: swapId,
      },
    ],
  });

  return updatedSwap;
}

export async function rejectSwap(swapId: number, managerId: number) {
  const swap = await prisma.swapRequest.findUnique({ where: { id: swapId } });

  if (!swap) {
    throw new SwapError("Swap request not found", 404);
  }
  if (swap.status !== "PENDING") {
    throw new SwapError("This swap request has already been decided", 400);
  }

  const updatedSwap = await prisma.swapRequest.update({
    where: { id: swapId },
    data: { status: "REJECTED", decidedById: managerId, decidedAt: new Date() },
  });

  await prisma.auditLog.create({
    data: {
      actorId: managerId,
      action: "SWAP_REJECTED",
      entityType: "SwapRequest",
      entityId: swapId,
      metadata: { shiftId: swap.shiftId },
    },
  });

  await prisma.notification.create({
    data: {
      userId: swap.claimedById!,
      message: "Your shift swap request was rejected.",
      type: "SWAP_REJECTED",
      relatedSwapId: swapId,
    },
  });

  return updatedSwap;
}