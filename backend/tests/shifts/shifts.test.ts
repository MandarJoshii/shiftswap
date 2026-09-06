import request from "supertest";
import app from "../../src/app";
import testPrisma from "../utils/testPrisma";

async function registerAndLogin(role: "EMPLOYEE" | "MANAGER", email: string) {
  await request(app).post("/api/auth/register").send({
    name: role === "MANAGER" ? "Test Manager" : "Test Employee",
    email,
    password: "password123",
    role,
  });
  const res = await request(app).post("/api/auth/login").send({ email, password: "password123" });
  return { token: res.body.data.token as string, user: res.body.data.user };
}

describe("Shifts API", () => {
  let managerToken: string;
  let employeeToken: string;
  let employeeId: number;

  beforeEach(async () => {
    await testPrisma.notification.deleteMany();
    await testPrisma.auditLog.deleteMany();
    await testPrisma.swapRequest.deleteMany();
    await testPrisma.shift.deleteMany();
    await testPrisma.user.deleteMany();

    const manager = await registerAndLogin("MANAGER", "manager@test.com");
    const employee = await registerAndLogin("EMPLOYEE", "employee@test.com");
    managerToken = manager.token;
    employeeToken = employee.token;
    employeeId = employee.user.id;
  });

  afterAll(async () => {
    await testPrisma.$disconnect();
  });

  describe("POST /api/shifts", () => {
    it("allows a manager to create an unassigned shift", async () => {
      const res = await request(app)
        .post("/api/shifts")
        .set("Authorization", `Bearer ${managerToken}`)
        .send({ date: "2026-10-01", startTime: "2026-10-01T09:00:00Z", endTime: "2026-10-01T17:00:00Z" });

      expect(res.status).toBe(201);
      expect(res.body.data.employeeId).toBeNull();
      expect(res.body.data.status).toBe("SCHEDULED");
    });

    it("allows a manager to create a shift assigned to an employee", async () => {
      const res = await request(app)
        .post("/api/shifts")
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          employeeId,
          date: "2026-10-01",
          startTime: "2026-10-01T09:00:00Z",
          endTime: "2026-10-01T17:00:00Z",
        });

      expect(res.status).toBe(201);
      expect(res.body.data.employeeId).toBe(employeeId);
      expect(res.body.data.employee.id).toBe(employeeId);
    });

    it("blocks an employee from creating a shift", async () => {
      const res = await request(app)
        .post("/api/shifts")
        .set("Authorization", `Bearer ${employeeToken}`)
        .send({ date: "2026-10-01", startTime: "2026-10-01T09:00:00Z", endTime: "2026-10-01T17:00:00Z" });

      expect(res.status).toBe(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    it("rejects an endTime before startTime", async () => {
      const res = await request(app)
        .post("/api/shifts")
        .set("Authorization", `Bearer ${managerToken}`)
        .send({ date: "2026-10-01", startTime: "2026-10-01T17:00:00Z", endTime: "2026-10-01T09:00:00Z" });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
    });

    it("rejects assignment to a nonexistent employee", async () => {
      const res = await request(app)
        .post("/api/shifts")
        .set("Authorization", `Bearer ${managerToken}`)
        .send({
          employeeId: 999999,
          date: "2026-10-01",
          startTime: "2026-10-01T09:00:00Z",
          endTime: "2026-10-01T17:00:00Z",
        });

      expect(res.status).toBe(404);
      expect(res.body.error.message).toBe("Assigned employee does not exist");
    });

    it("rejects requests with no auth token", async () => {
      const res = await request(app)
        .post("/api/shifts")
        .send({ date: "2026-10-01", startTime: "2026-10-01T09:00:00Z", endTime: "2026-10-01T17:00:00Z" });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/shifts", () => {
    it("lets both roles list shifts", async () => {
      await request(app)
        .post("/api/shifts")
        .set("Authorization", `Bearer ${managerToken}`)
        .send({ date: "2026-10-01", startTime: "2026-10-01T09:00:00Z", endTime: "2026-10-01T17:00:00Z" });

      const res = await request(app).get("/api/shifts").set("Authorization", `Bearer ${employeeToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });
  });

  describe("DELETE /api/shifts/:id", () => {
    it("blocks an employee from deleting a shift", async () => {
      const created = await request(app)
        .post("/api/shifts")
        .set("Authorization", `Bearer ${managerToken}`)
        .send({ date: "2026-10-01", startTime: "2026-10-01T09:00:00Z", endTime: "2026-10-01T17:00:00Z" });

      const res = await request(app)
        .delete(`/api/shifts/${created.body.data.id}`)
        .set("Authorization", `Bearer ${employeeToken}`);

      expect(res.status).toBe(403);
    });
  });
});