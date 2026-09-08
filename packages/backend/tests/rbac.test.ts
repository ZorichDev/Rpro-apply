import request from "supertest";
import { createApp } from "../src/app";

const app = createApp();

async function registerAndLogin(email: string, role: string) {
  const res = await request(app).post("/api/auth/register").send({
    email,
    password: "password123",
    role,
  });
  return res.body.accessToken as string;
}

describe("Role-based access control", () => {
  it("blocks a student from creating a program (institution-only route)", async () => {
    const studentToken = await registerAndLogin("student-rbac@example.com", "student");

    const res = await request(app)
      .post("/api/programs")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        title: "Should not be created",
        level: "undergraduate",
        country: "Nigeria",
        tuitionAmount: 100000,
        currency: "NGN",
      });

    expect(res.status).toBe(403);
  });

  it("blocks an institution from submitting an application (student-only route)", async () => {
    const institutionToken = await registerAndLogin("institution-rbac@example.com", "institution");

    const res = await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${institutionToken}`)
      .send({ programId: "000000000000000000000000", personalStatement: "x".repeat(60) });

    expect(res.status).toBe(403);
  });

  it("blocks a vendor from accessing admin-only routes", async () => {
    const vendorToken = await registerAndLogin("vendor-rbac@example.com", "vendor");

    const res = await request(app)
      .get("/api/admin/stats")
      .set("Authorization", `Bearer ${vendorToken}`);

    expect(res.status).toBe(403);
  });

  it("blocks a recruitment partner from creating a vendor service", async () => {
    const partnerToken = await registerAndLogin("partner-rbac@example.com", "recruitment_partner");

    const res = await request(app)
      .post("/api/services")
      .set("Authorization", `Bearer ${partnerToken}`)
      .send({ title: "Test prep", category: "test_prep", priceAmount: 50, currency: "USD" });

    expect(res.status).toBe(403);
  });
});
