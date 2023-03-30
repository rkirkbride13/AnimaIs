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

});
