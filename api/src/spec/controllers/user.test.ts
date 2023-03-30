import { app } from "../../app";
import request from "supertest";
import "../mongodb_helper";
import User from "../../models/user";
import bcrypt from "bcrypt";

describe("/users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("post when email and password are provided", () => {
    it("gives response code 200 and creates a user", async () => {
      let response = await request(app).post("/users").send({
        name: "Robbie",
        email: "robbie@email.com",
        password: "password",
      });
      expect(response.statusCode).toBe(200);

      let users = await User.find();
      let newUser = users[users.length - 1];
      expect(newUser.email).toEqual("robbie@email.com");
    });

    it("encrypts the password", async () => {
      let response = await request(app).post("/users").send({
        name: "Robbie",
        email: "robbie@email.com",
        password: "password",
      });
      expect(response.statusCode).toBe(200);

      let users = await User.find();
      let newUser = users[users.length - 1];
      bcrypt
        .compare("password", newUser.password)
        .then((res) => expect(res).toBe(true));
    });
  });
});
