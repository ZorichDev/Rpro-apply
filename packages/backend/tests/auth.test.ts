import request from "supertest";
import { createApp } from "../src/app";
import { User } from "../src/models/User";

const app = createApp();

describe("POST /api/auth/register", () => {
  it("creates a student account and returns tokens", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "student@example.com",
      password: "password123",
      role: "student",
    });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("student@example.com");
    expect(res.body.user.role).toBe("student");
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  it("rejects a duplicate email", async () => {
    await request(app).post("/api/auth/register").send({
      email: "dupe@example.com",
      password: "password123",
      role: "student",
    });

    const res = await request(app).post("/api/auth/register").send({
      email: "dupe@example.com",
      password: "differentpassword",
      role: "vendor",
    });

    expect(res.status).toBe(409);
  });

  it("rejects a password under 8 characters", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "short@example.com",
      password: "short",
      role: "student",
    });

    expect(res.status).toBe(400);
  });

  it("auto-generates a referral code for recruitment partners only", async () => {
    const partnerRes = await request(app).post("/api/auth/register").send({
      email: "partner@example.com",
      password: "password123",
      role: "recruitment_partner",
    });
    const studentRes = await request(app).post("/api/auth/register").send({
      email: "student2@example.com",
      password: "password123",
      role: "student",
    });

    const partner = await User.findOne({ email: "partner@example.com" });
    const student = await User.findOne({ email: "student2@example.com" });

    expect((partner as any).referralCode).toBeDefined();
    expect((student as any).referralCode).toBeUndefined();
    expect(partnerRes.status).toBe(201);
    expect(studentRes.status).toBe(201);
  });

  it("attributes a student to the referring partner when a valid code is supplied", async () => {
    await request(app).post("/api/auth/register").send({
      email: "referrer@example.com",
      password: "password123",
      role: "recruitment_partner",
    });
    const partner = await User.findOne({ email: "referrer@example.com" });
    const code = (partner as any).referralCode;

    await request(app).post("/api/auth/register").send({
      email: "referred-student@example.com",
      password: "password123",
      role: "student",
      referralCode: code,
    });

    const student = await User.findOne({ email: "referred-student@example.com" });
    expect((student as any).referredBy?.toString()).toBe(partner!.id);
  });

  it("silently ignores an unknown referral code rather than failing registration", async () => {
    const res = await request(app).post("/api/auth/register").send({
      email: "bad-ref@example.com",
      password: "password123",
      role: "student",
      referralCode: "NOT-A-REAL-CODE",
    });

    expect(res.status).toBe(201);
    const student = await User.findOne({ email: "bad-ref@example.com" });
    expect((student as any).referredBy).toBeUndefined();
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await request(app).post("/api/auth/register").send({
      email: "login-test@example.com",
      password: "correctpassword",
      role: "student",
    });
  });

  it("logs in with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "login-test@example.com",
      password: "correctpassword",
    });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it("rejects an incorrect password", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "login-test@example.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
  });

  it("rejects a suspended account, even with the correct password", async () => {
    await User.findOneAndUpdate({ email: "login-test@example.com" }, { isSuspended: true });

    const res = await request(app).post("/api/auth/login").send({
      email: "login-test@example.com",
      password: "correctpassword",
    });

    expect(res.status).toBe(403);
  });

  it("rejects a removed (soft-deleted) account", async () => {
    await User.findOneAndUpdate({ email: "login-test@example.com" }, { isDeleted: true });

    const res = await request(app).post("/api/auth/login").send({
      email: "login-test@example.com",
      password: "correctpassword",
    });

    expect(res.status).toBe(401);
  });
});

describe("GET /api/users/me (auth middleware)", () => {
  it("rejects a request with no token", async () => {
    const res = await request(app).get("/api/users/me");
    expect(res.status).toBe(401);
  });

  it("blocks access immediately once a user is suspended, even with a still-valid access token", async () => {
    const registerRes = await request(app).post("/api/auth/register").send({
      email: "will-be-suspended@example.com",
      password: "password123",
      role: "student",
    });
    const token = registerRes.body.accessToken;

    // Token still valid — works before suspension.
    const before = await request(app).get("/api/users/me").set("Authorization", `Bearer ${token}`);
    expect(before.status).toBe(200);

    await User.findOneAndUpdate({ email: "will-be-suspended@example.com" }, { isSuspended: true });

    // Same token, now rejected — requireAuth checks the DB on every
    // request, not just at login.
    const after = await request(app).get("/api/users/me").set("Authorization", `Bearer ${token}`);
    expect(after.status).toBe(403);
  });
});
