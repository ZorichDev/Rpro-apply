import request from "supertest";
import { createApp } from "../src/app";
import { Bonus } from "../src/models/Bonus";

const app = createApp();

async function registerAndLogin(email: string, role: string, referralCode?: string) {
  const res = await request(app)
    .post("/api/auth/register")
    .send({ email, password: "password123", role, referralCode });
  return { token: res.body.accessToken as string, userId: res.body.user.id as string };
}

async function setupInstitutionWithProgram(email: string) {
  const { token } = await registerAndLogin(email, "institution");
  await request(app)
    .patch("/api/users/me/profile")
    .set("Authorization", `Bearer ${token}`)
    .send({ institutionName: "Test University", country: "Nigeria", institutionType: "university" });

  const programRes = await request(app)
    .post("/api/programs")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "BSc Computer Science",
      level: "undergraduate",
      country: "Nigeria",
      tuitionAmount: 500000,
      currency: "NGN",
    });

  return { institutionToken: token, programId: programRes.body.program._id as string };
}

async function setupStudent(email: string, referralCode?: string) {
  const { token } = await registerAndLogin(email, "student", referralCode);
  await request(app)
    .patch("/api/users/me/profile")
    .set("Authorization", `Bearer ${token}`)
    .send({ firstName: "Amara", lastName: "Okafor", country: "Nigeria" });
  return token;
}

describe("Student -> Institution application flow", () => {
  it("lets a student apply to a program and the institution review it", async () => {
    const { institutionToken, programId } = await setupInstitutionWithProgram("inst1@example.com");
    const studentToken = await setupStudent("student1@example.com");

    const applyRes = await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ programId, personalStatement: "x".repeat(60) });

    expect(applyRes.status).toBe(201);
    expect(applyRes.body.application.status).toBe("submitted");

    const receivedRes = await request(app)
      .get("/api/applications/received")
      .set("Authorization", `Bearer ${institutionToken}`);

    expect(receivedRes.status).toBe(200);
    expect(receivedRes.body.applications).toHaveLength(1);

    const applicationId = applyRes.body.application._id;
    const acceptRes = await request(app)
      .patch(`/api/applications/${applicationId}/status`)
      .set("Authorization", `Bearer ${institutionToken}`)
      .send({ status: "accepted" });

    expect(acceptRes.status).toBe(200);
    expect(acceptRes.body.application.status).toBe("accepted");
  });

  it("rejects a duplicate application to the same program", async () => {
    const { programId } = await setupInstitutionWithProgram("inst2@example.com");
    const studentToken = await setupStudent("student2@example.com");

    await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ programId, personalStatement: "x".repeat(60) });

    const secondRes = await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ programId, personalStatement: "y".repeat(60) });

    expect(secondRes.status).toBe(409);
  });

  it("blocks an unprofiled student from applying", async () => {
    const { programId } = await setupInstitutionWithProgram("inst3@example.com");
    const { token: studentToken } = await registerAndLogin("student3@example.com", "student");
    // Deliberately skip the profile-completion step.

    const res = await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ programId, personalStatement: "x".repeat(60) });

    expect(res.status).toBe(403);
  });

  it("creates a ₦250,000 success bonus for the referring partner when a referred student is accepted", async () => {
    const { token: partnerToken } = await registerAndLogin("bonus-partner@example.com", "recruitment_partner");
    const partnerMe = await request(app).get("/api/users/me").set("Authorization", `Bearer ${partnerToken}`);
    const referralCode = partnerMe.body.user.referralCode;

    const { institutionToken, programId } = await setupInstitutionWithProgram("bonus-inst@example.com");
    const studentToken = await setupStudent("bonus-student@example.com", referralCode);

    const applyRes = await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ programId, personalStatement: "x".repeat(60) });

    await request(app)
      .patch(`/api/applications/${applyRes.body.application._id}/status`)
      .set("Authorization", `Bearer ${institutionToken}`)
      .send({ status: "accepted" });

    const bonuses = await Bonus.find({ applicationId: applyRes.body.application._id });
    expect(bonuses).toHaveLength(1);
    expect(bonuses[0].amountNgn).toBe(250000);
  });

  it("does not create a bonus when the accepted student was never referred", async () => {
    const { institutionToken, programId } = await setupInstitutionWithProgram("no-bonus-inst@example.com");
    const studentToken = await setupStudent("no-bonus-student@example.com"); // no referral code

    const applyRes = await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ programId, personalStatement: "x".repeat(60) });

    await request(app)
      .patch(`/api/applications/${applyRes.body.application._id}/status`)
      .set("Authorization", `Bearer ${institutionToken}`)
      .send({ status: "accepted" });

    const bonuses = await Bonus.find({ applicationId: applyRes.body.application._id });
    expect(bonuses).toHaveLength(0);
  });

  it("never creates a second bonus if an application's status is set to accepted more than once", async () => {
    const { token: partnerToken } = await registerAndLogin("dupe-bonus-partner@example.com", "recruitment_partner");
    const partnerMe = await request(app).get("/api/users/me").set("Authorization", `Bearer ${partnerToken}`);
    const referralCode = partnerMe.body.user.referralCode;

    const { institutionToken, programId } = await setupInstitutionWithProgram("dupe-bonus-inst@example.com");
    const studentToken = await setupStudent("dupe-bonus-student@example.com", referralCode);

    const applyRes = await request(app)
      .post("/api/applications")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({ programId, personalStatement: "x".repeat(60) });
    const applicationId = applyRes.body.application._id;

    // Move it to accepted, then back to under_review, then accepted again —
    // simulates an institution correcting a mistaken decision.
    await request(app)
      .patch(`/api/applications/${applicationId}/status`)
      .set("Authorization", `Bearer ${institutionToken}`)
      .send({ status: "accepted" });
    await request(app)
      .patch(`/api/applications/${applicationId}/status`)
      .set("Authorization", `Bearer ${institutionToken}`)
      .send({ status: "under_review" });
    await request(app)
      .patch(`/api/applications/${applicationId}/status`)
      .set("Authorization", `Bearer ${institutionToken}`)
      .send({ status: "accepted" });

    const bonuses = await Bonus.find({ applicationId });
    expect(bonuses).toHaveLength(1);
  });
});
