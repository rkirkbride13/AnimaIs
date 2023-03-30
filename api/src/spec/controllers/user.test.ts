import { app } from "../../app";
import request from "supertest";
import "../mongodb_helper";
import User from "../../models/user";
import bcrypt from "bcrypt";

describe("/users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe("POST", () => {
    it("gives response code 200 and creates a user with correct credentials", async () => {
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

    it("gives response code 400 and does NOT create user when name missing", async () => {
      let response = await request(app)
        .post("/users")
        .send({ email: "robbie@email.com", password: "password1" });
      expect(response.statusCode).toBe(400);
      let users = await User.find();
      expect(users.length).toEqual(0);
    });

    it("gives response code 400 and does NOT create user when email missing", async () => {
      let response = await request(app)
        .post("/users")
        .send({ name: "Robbie", password: "password1" });
      expect(response.statusCode).toBe(400);
      let users = await User.find();
      expect(users.length).toEqual(0);
    });

    it("gives response code 400 and does NOT create user when password missing", async () => {
      let response = await request(app)
        .post("/users")
        .send({ name: "Robbie", email: "robbie@email.com" });
      expect(response.statusCode).toBe(400);
      let users = await User.find();
      expect(users.length).toEqual(0);
    });

    it("gives response code 400 and does NOT create user when email is invalid", async () => {
      let response = await request(app)
        .post("/users")
        .send({
          name: "Robbie",
          email: "robbieemail.com",
          password: "password1",
        });
      expect(response.statusCode).toBe(400);
      let users = await User.find();
      expect(users.length).toEqual(0);
    });

    it("gives response code 400 and does NOT create user when email already exists", async () => {
      await User.create({
        name: "Robbie",
        email: "robbie@email.com",
        password: "password1",
      });
      let response = await request(app)
        .post("/users")
        .send({
          name: "Robbie New",
          email: "robbie@email.com",
          password: "password100",
        });
      expect(response.statusCode).toBe(400);
      let users = await User.find();
      expect(users.length).toEqual(1);
    });
  });
});
