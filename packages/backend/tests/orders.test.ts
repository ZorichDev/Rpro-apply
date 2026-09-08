import request from "supertest";
import { createApp } from "../src/app";

const app = createApp();

async function registerAndLogin(email: string, role: string, referralCode?: string) {
  const res = await request(app)
    .post("/api/auth/register")
    .send({ email, password: "password123", role, referralCode });
  return res.body.accessToken as string;
}

async function setupVendorWithService(email: string, priceAmount: number, currency: string) {
  const token = await registerAndLogin(email, "vendor");
  await request(app)
    .patch("/api/users/me/profile")
    .set("Authorization", `Bearer ${token}`)
    .send({ companyName: "Test Vendor Co", serviceCategory: "test_prep" });

  const serviceRes = await request(app)
    .post("/api/services")
    .set("Authorization", `Bearer ${token}`)
    .send({ title: "IELTS Prep", category: "test_prep", priceAmount, currency });

  return serviceRes.body.service._id as string;
}

async function setupStudent(email: string, referralCode?: string) {
  const token = await registerAndLogin(email, "student", referralCode);
  await request(app)
    .patch("/api/users/me/profile")
    .set("Authorization", `Bearer ${token}`)
    .send({ firstName: "Test", lastName: "Student", country: "Kenya" });
  return token;
}

describe("Orders and commission", () => {
  it("creates an order in the service's own currency, not a hardcoded one", async () => {
    const serviceId = await setupVendorWithService("kes-vendor@example.com", 5000, "KES");
    const studentToken = await setupStudent("kes-student@example.com");

    const orderRes = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ serviceId });

    expect(orderRes.status).toBe(201);
    expect(orderRes.body.order.amount).toBe(5000);
    expect(orderRes.body.order.currency).toBe("KES");
    expect(orderRes.body.order.status).toBe("pending");
  });

  it("calculates 7% commission in the order's own currency when a referred student pays", async () => {
    const partnerToken = await registerAndLogin("order-partner@example.com", "recruitment_partner");
    const partnerMe = await request(app).get("/api/users/me").set("Authorization", `Bearer ${partnerToken}`);
    const referralCode = partnerMe.body.user.referralCode;

    const serviceId = await setupVendorWithService("ngn-vendor@example.com", 10000, "NGN");
    const studentToken = await setupStudent("referred-buyer@example.com", referralCode);

    const orderRes = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ serviceId });
    const orderId = orderRes.body.order._id;

    const payRes = await request(app)
      .post(`/api/orders/${orderId}/pay`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(payRes.status).toBe(200);
    expect(payRes.body.order.status).toBe("paid");
    expect(payRes.body.order.commissionAmount).toBe(700); // 7% of 10,000
    expect(payRes.body.order.currency).toBe("NGN");
  });

  it("charges no commission when the student was never referred", async () => {
    const serviceId = await setupVendorWithService("no-ref-vendor@example.com", 10000, "NGN");
    const studentToken = await setupStudent("unreferred-buyer@example.com");

    const orderRes = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ serviceId });

    const payRes = await request(app)
      .post(`/api/orders/${orderRes.body.order._id}/pay`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(payRes.body.order.commissionAmount).toBe(0);
  });

  it("rejects paying the same order twice", async () => {
    const serviceId = await setupVendorWithService("double-pay-vendor@example.com", 5000, "USD");
    const studentToken = await setupStudent("double-pay-student@example.com");

    const orderRes = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ serviceId });
    const orderId = orderRes.body.order._id;

    await request(app).post(`/api/orders/${orderId}/pay`).set("Authorization", `Bearer ${studentToken}`);
    const secondPay = await request(app)
      .post(`/api/orders/${orderId}/pay`)
      .set("Authorization", `Bearer ${studentToken}`);

    expect(secondPay.status).toBe(409);
  });

  it("a student can't pay for another student's order", async () => {
    const serviceId = await setupVendorWithService("theft-vendor@example.com", 5000, "USD");
    const ownerToken = await setupStudent("order-owner@example.com");
    const intruderToken = await setupStudent("order-intruder@example.com");

    const orderRes = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${ownerToken}`)
      .send({ serviceId });

    const res = await request(app)
      .post(`/api/orders/${orderRes.body.order._id}/pay`)
      .set("Authorization", `Bearer ${intruderToken}`);

    expect(res.status).toBe(404);
  });
});
