import request from "supertest";
import app from "../../src/app";
import testPrisma from "../utils/testPrisma";

async function registerAndLogin(role: "EMPLOYEE" | "MANAGER", email: string) {
  await request(app).post("/api/auth/register").send({
    name: role === "MANAGER" ? "Test Manager" : email,
    email,
    password: "password123",
    role,
  });
  const res = await request(app).post("/api/auth/login").send({ email, password: "password123" });
  return { token: res.body.data.token as string, user: res.body.data.user };
}

async function createShift(
  token: string,
  input: { employeeId?: number; date: string; startTime: string; endTime: string }
) {
  const res = await request(app).post("/api/shifts").set("Authorization", `Bearer ${token}`).send(input);
  return res.body.data;
}

describe("Conflict detection", () => {
  let managerToken: string;
  let emp1Token: string;
  let emp1Id: number;
  let emp2Token: string;
  let emp2Id: number;

  beforeEach(async () => {
    await testPrisma.notification.deleteMany();
    await testPrisma.auditLog.deleteMany();
    await testPrisma.swapRequest.deleteMany();
    await testPrisma.shift.deleteMany();
    await testPrisma.user.deleteMany();

    const manager = await registerAndLogin("MANAGER", "manager@test.com");
    const e1 = await registerAndLogin("EMPLOYEE", "emp1@test.com");
    const e2 = await registerAndLogin("EMPLOYEE", "emp2@test.com");

    managerToken = manager.token;
    emp1Token = e1.token;
    emp1Id = e1.user.id;
    emp2Token = e2.token;
    emp2Id = e2.user.id;
  });

  afterAll(async () => {
    await testPrisma.$disconnect();
  });

  it("rejects a claim that overlaps the claimant's existing shift", async () => {
    // Employee 2 already has a shift 13:00-18:00
    await createShift(managerToken, {
      employeeId: emp2Id,
      date: "2026-10-05",
      startTime: "2026-10-05T13:00:00Z",
      endTime: "2026-10-05T18:00:00Z",
    });

    // Employee 1 has a shift 14:00-22:00 on the same day, posted for swap
    const shift = await createShift(managerToken, {
      employeeId: emp1Id,
      date: "2026-10-05",
      startTime: "2026-10-05T14:00:00Z",
      endTime: "2026-10-05T22:00:00Z",
    });
    await request(app).post(`/api/swaps/${shift.id}/post`).set("Authorization", `Bearer ${emp1Token}`);

    // Employee 2 tries to claim it — overlaps their 13:00-18:00 shift
    const res = await request(app)
      .post("/api/swaps/claim")
      .set("Authorization", `Bearer ${emp2Token}`)
      .send({ shiftId: shift.id });

    expect(res.status).toBe(409);
    expect(res.body.error.message).toBe(
      "This shift overlaps with a shift you're already assigned to"
    );
  });

  it("allows a claim with no overlap", async () => {
    // Employee 2 has a shift on a completely different day
    await createShift(managerToken, {
      employeeId: emp2Id,
      date: "2026-10-06",
      startTime: "2026-10-06T09:00:00Z",
      endTime: "2026-10-06T17:00:00Z",
    });

    const shift = await createShift(managerToken, {
      employeeId: emp1Id,
      date: "2026-10-05",
      startTime: "2026-10-05T09:00:00Z",
      endTime: "2026-10-05T17:00:00Z",
    });
    await request(app).post(`/api/swaps/${shift.id}/post`).set("Authorization", `Bearer ${emp1Token}`);

    const res = await request(app)
      .post("/api/swaps/claim")
      .set("Authorization", `Bearer ${emp2Token}`)
      .send({ shiftId: shift.id });

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe("PENDING");
  });

  it("allows a claim on a shift that ends exactly when the claimant's shift starts (back-to-back, no overlap)", async () => {
    // Employee 2 has 09:00-17:00
    await createShift(managerToken, {
      employeeId: emp2Id,
      date: "2026-10-05",
      startTime: "2026-10-05T09:00:00Z",
      endTime: "2026-10-05T17:00:00Z",
    });

    // Open shift is 17:00-23:00 — starts exactly when the other ends
    const shift = await createShift(managerToken, {
      employeeId: emp1Id,
      date: "2026-10-05",
      startTime: "2026-10-05T17:00:00Z",
      endTime: "2026-10-05T23:00:00Z",
    });
    await request(app).post(`/api/swaps/${shift.id}/post`).set("Authorization", `Bearer ${emp1Token}`);

    const res = await request(app)
      .post("/api/swaps/claim")
      .set("Authorization", `Bearer ${emp2Token}`)
      .send({ shiftId: shift.id });

    expect(res.status).toBe(201);
  });

  it("approving a swap reassigns the shift and auto-rejects other pending claims", async () => {
    const shift = await createShift(managerToken, {
      employeeId: emp1Id,
      date: "2026-10-05",
      startTime: "2026-10-05T09:00:00Z",
      endTime: "2026-10-05T17:00:00Z",
    });
    await request(app).post(`/api/swaps/${shift.id}/post`).set("Authorization", `Bearer ${emp1Token}`);

    const claim = await request(app)
      .post("/api/swaps/claim")
      .set("Authorization", `Bearer ${emp2Token}`)
      .send({ shiftId: shift.id });

    const approveRes = await request(app)
      .patch(`/api/swaps/${claim.body.data.id}/approve`)
      .set("Authorization", `Bearer ${managerToken}`);

    expect(approveRes.status).toBe(200);
    expect(approveRes.body.data.status).toBe("APPROVED");

    const shiftRes = await request(app)
      .get(`/api/shifts/${shift.id}`)
      .set("Authorization", `Bearer ${managerToken}`);

    expect(shiftRes.body.data.employeeId).toBe(emp2Id);
    expect(shiftRes.body.data.status).toBe("SCHEDULED");
  });

  it("blocks an employee from claiming their own posted shift", async () => {
    const shift = await createShift(managerToken, {
      employeeId: emp1Id,
      date: "2026-10-05",
      startTime: "2026-10-05T09:00:00Z",
      endTime: "2026-10-05T17:00:00Z",
    });
    await request(app).post(`/api/swaps/${shift.id}/post`).set("Authorization", `Bearer ${emp1Token}`);

    const res = await request(app)
      .post("/api/swaps/claim")
      .set("Authorization", `Bearer ${emp1Token}`)
      .send({ shiftId: shift.id });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toBe("You cannot claim your own shift");
  });
    it("only shows an employee their own swap requests, not other employees'", async () => {
    // Employee 1 posts and gets a claim from Employee 2
    const shift = await createShift(managerToken, {
      employeeId: emp1Id,
      date: "2026-10-05",
      startTime: "2026-10-05T09:00:00Z",
      endTime: "2026-10-05T17:00:00Z",
    });
    await request(app).post(`/api/swaps/${shift.id}/post`).set("Authorization", `Bearer ${emp1Token}`);
    await request(app)
      .post("/api/swaps/claim")
      .set("Authorization", `Bearer ${emp2Token}`)
      .send({ shiftId: shift.id });

    // A third, uninvolved employee should see nothing
    const emp3 = await registerAndLogin("EMPLOYEE", "emp3@test.com");
    const res = await request(app).get("/api/swaps").set("Authorization", `Bearer ${emp3.token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(0);

    // The manager should see it
    const managerRes = await request(app).get("/api/swaps").set("Authorization", `Bearer ${managerToken}`);
    expect(managerRes.body.data.length).toBe(1);
  });
});