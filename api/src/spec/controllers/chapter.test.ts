import Chapter from "../../models/chapter";
import { app } from "../../app";
import request from "supertest";
import "../mongodb_helper";
import User from "../../models/user";
import Token from "../../models/token";

describe("/chapters", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await Chapter.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Chapter.deleteMany({});
  });

  describe("Post", () => {
    test("responds with a status code 200 and creates a chapter", async () => {
      let user = new User({
        name: "Robbie",
        email: "robbie@email.com",
        password: "password1",
      });
      await user.save();
      let token = await Token.jsonwebtoken(user.id);
      let response = await request(app)
        .post("/chapters")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "The Dog",
        });

      expect(response.status).toEqual(200);
      let chapters = await Chapter.find();
      expect(chapters.length).toEqual(1);
      expect(chapters[0].title).toEqual("The Dog");
    });
  });
});
