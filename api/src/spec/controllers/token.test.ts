import { app } from "../../app";
import request from "supertest";
import "../mongodb_helper";
import User from "../../models/user";

describe("/tokens", () => {
  beforeAll(async () => {
    await User.deleteMany({});
    await request(app).post("/users").send({
      name: "Robbie",
      email: "robbie@email.com",
      password: "password1",
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it("returns a token when credentials are valid", async () => {
    let response = await request(app)
      .post("/tokens")
      .send({ email: "robbie@email.com", password: "password1" });
    expect(response.body.message).toEqual("OK");
    expect(response.status).toEqual(200);
    expect(response.body.token).not.toEqual(undefined);
  });

  it("does NOT return a token when password is invalid", async () => {
    let response = await request(app)
      .post("/tokens")
      .send({ email: "robbie@email.com", password: "1password" });
    expect(response.status).toEqual(401);
    expect(response.body.token).toEqual(undefined);
    expect(response.body.message).toEqual(
      "auth error - passwords do not match"
    );
  });

  it("does NOT return a token when email is invalid", async () => {
    let response = await request(app)
      .post("/tokens")
      .send({ email: "eibbor@email.com", password: "password1" });
    expect(response.status).toEqual(401);
    expect(response.body.token).toEqual(undefined);
    expect(response.body.message).toEqual("auth error - user does not exist");
  });
});
