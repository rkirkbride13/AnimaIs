import { app } from "../../app";
import request from "supertest";
import "../mongodb_helper";
import User from "../../models/user";
import Token from "../../models/token";
import Chapter from "../../models/chapter";

describe("ChaptersController", () => {
  describe("CreateContent", () => {
    beforeEach(async () => {
      await User.deleteMany({});
      await Chapter.deleteMany({});
    });

    afterAll(async () => {
      await User.deleteMany({});
      await Chapter.deleteMany({});
    });

    it("should create a new chapter and return status 200 with valid input", async () => {
      let user = new User({
        name: "Test",
        email: "test@email.com",
        password: "password",
      });
      await user.save();
      let token = await Token.jsonwebtoken(user.id);

      const mockResponse = {
        data: {
          choices: [{ text: "This is the chapter content." }],
        },
      };
      jest.mock("openai", () => ({
        Configuration: jest.fn(),
        OpenAIApi: jest.fn(() => ({
          createCompletion: jest.fn(() => Promise.resolve(mockResponse)),
        })),
      }));

      const res = await request(app)
        .post("/chapters")
        .set("Authorization", `Bearer ${token}`)
        .send({
          user_id: "user123",
          title: "Chapter 1",
        });

      expect(res.status).toEqual(200);
      expect(res.body).toEqual({ message: "OK" });

      const chapters = await Chapter.find();
      expect(chapters).toHaveLength(1);
      expect(chapters[0].title).toBe("Chapter 1");
      expect(chapters[0].content).toEqual([mockResponse.data.choices[0].text]);
    });

    it("should return status 400 with invalid input", async () => {
      let user = new User({
        name: "Test",
        email: "test@email.com",
        password: "password",
      });
      await user.save();
      let token = await Token.jsonwebtoken(user.id);

      const res = await request(app)
        .post("/chapters")
        .send({ user_id: "user123" })
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toEqual(400);
      expect(res.body).toEqual({ message: "Chapter not created" });
      const chapters = await Chapter.find();
      expect(chapters).toHaveLength(0);
    });
  });

  describe("FindByUser", () => {
    it("responds with a status code 200, and returns all users chapters", async () => {
      let user = new User({
        name: "Test",
        email: "test@email.com",
        password: "password",
      });
      await user.save();
      let token = await Token.jsonwebtoken(user.id);

      await request(app)
        .post("/chapters")
        .set("Authorization", `Bearer ${token}`)
        .send({
          user_id: "user123",
          title: "Chapter 1",
        });

      let res = await request(app)
        .get("/chapters")
        .set("Authorization", `Bearer ${token}`)
        .send();

      expect(res.status).toEqual(200);
      expect(res.body.chapters[0].title).toEqual("Chapter 1");
    });

    it("should return status 400 if token not found", async () => {
      let user = new User({
        name: "Robbie",
        email: "robbie@email.com",
        password: "password1",
      });
      await user.save();
      let token = await Token.jsonwebtoken(user.id);
      await request(app)
        .post("/acts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          user_id: "user123",
          title: "Chapter 1",
        });

      let response = await request(app).get("/chapters").send();
      expect(response.status).toEqual(400);
    });
  });

  describe("DeleteChapter", () => {
    it("responds with a status code 200 and deletes chapter", async () => {
      let user = new User({
        name: "Robbie",
        email: "robbie@email.com",
        password: "password1",
      });
      await user.save();
      let token = await Token.jsonwebtoken(user.id);
      await request(app)
        .post("/chapters")
        .set("Authorization", `Bearer ${token}`)
        .send({
          user_id: "user123",
          title: "Chapter 1",
        });
      let chapters = await Chapter.find();
      expect(chapters.length).toEqual(1);
      const chapter_id = chapters[0]._id;

      let response_2 = await request(app)
        .delete("/chapters")
        .set("Authorization", `Bearer ${token}`)
        .set({ chapter_id: chapter_id })
        .send();

      let updatedChapters = await Chapter.find();
      expect(response_2.statusCode).toEqual(200);
      expect(updatedChapters.length).toEqual(0);
    });

    it("should return status 400 if token not found", async () => {
      let user = new User({
        name: "Robbie",
        email: "robbie@email.com",
        password: "password1",
      });
      await user.save();
      let token = await Token.jsonwebtoken(user.id);
      await request(app)
        .post("/acts")
        .set("Authorization", `Bearer ${token}`)
        .send({
          user_id: "user123",
          title: "Chapter 1",
        });

      let response = await request(app).delete("/chapters").send();
      expect(response.status).toEqual(400);
    });
  });
});
