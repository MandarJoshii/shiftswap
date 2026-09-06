import request from "supertest";
import app from "../../src/app";
import testPrisma from "../utils/testPrisma";

describe("Auth API", () => {
  beforeEach(async () => {
    await testPrisma.notification.deleteMany();
    await testPrisma.auditLog.deleteMany();
    await testPrisma.swapRequest.deleteMany();
    await testPrisma.shift.deleteMany();
    await testPrisma.user.deleteMany();
  });

  afterAll(async () => {
    await testPrisma.$disconnect();
  });

  describe("POST /api/auth/register", () => {
    it("creates a new user and returns a token", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "Jane Employee",
        email: "jane@test.com",
        password: "password123",
        role: "EMPLOYEE",
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe("jane@test.com");
      expect(res.body.data.user.passwordHash).toBeUndefined();
    });

    it("rejects a duplicate email with 409", async () => {
      await request(app).post("/api/auth/register").send({
        name: "Jane",
        email: "jane@test.com",
        password: "password123",
        role: "EMPLOYEE",
      });

      const res = await request(app).post("/api/auth/register").send({
        name: "Jane Again",
        email: "jane@test.com",
        password: "password123",
        role: "EMPLOYEE",
      });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it("rejects invalid input with 400 and field-level details", async () => {
      const res = await request(app).post("/api/auth/register").send({
        name: "A",
        email: "not-an-email",
        password: "123",
        role: "EMPLOYEE",
      });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
      expect(res.body.error.details.length).toBeGreaterThan(0);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send({
        name: "Jane Employee",
        email: "jane@test.com",
        password: "password123",
        role: "EMPLOYEE",
      });
    });

    it("logs in with correct credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "jane@test.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();
    });

    it("rejects an incorrect password with 401", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "jane@test.com",
        password: "wrongpassword",
      });

      expect(res.status).toBe(401);
    });

    it("gives the same error for a nonexistent email as a wrong password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "nobody@test.com",
        password: "whatever123",
      });

      expect(res.status).toBe(401);
      expect(res.body.error.message).toBe("Invalid email or password");
    });
  });
});